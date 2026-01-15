import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t } from "~/utils/i18n";

/**
 * 🧾 ImprintCard (SmartPages v5-ready)
 * -------------------------------------------------------
 * ✅ Holt Daten über Core Worker Proxy (/api/customer/imprint)
 * ✅ Zeigt Pflichtfelder mit * an
 * ✅ Straße / Hausnummer getrennt
 * ✅ Letzte Zeile in 3-Spalten-Layout (Telefon, E-Mail, USt-ID)
 */

export default function ImprintCard(props) {
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Imprint-Daten abrufen
  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Nicht eingeloggt oder Session abgelaufen");
          return {};
        }
        throw new Error(`API-Fehler: ${res.status}`);
      }

      const result = await res.json();
      if (!result?.ok || !result.data) return {};

      const i = result.data;
      return {
        company: i.company_name || "—",
        contact: i.contact_name || "—",
        street: i.street || "—",
        hs_no: i.hs_no || "—",
        zip: i.postal_code || "—",
        city: i.city || "—",
        phone: i.phone || "—",
        email: i.email || "—",
        vat: i.tax_id || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden des Impressums:", err);
      return {};
    }
  };

  const [imprint, { refetch }] = createResource(fetchImprint);

  onMount(() => {
    const handler = () => {
      console.log("🔄 ImprintCard: Daten werden aktualisiert...");
      refetch();
    };
    window.addEventListener("refresh-imprint-data", handler);
    onCleanup(() => window.removeEventListener("refresh-imprint-data", handler));
  });

  const data = () => imprint() || {};
  const val = (v) => (v ? v : "—");

  // 🔸 Pflichtfeld-Markierung
  const requiredLabel = (label) => (
    <span>
      {label} <span class="text-red-500 font-bold">*</span>
    </span>
  );

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t(lang(), "title", "imprint")}
      </h2>

      {/* 🟧 Bearbeiten-Button */}
      <div class="absolute top-4 right-8">
        <button
          onClick={() => window.dispatchEvent(new Event("open-imprint-modal"))}
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t(lang(), "button", "imprint")}
        </button>
      </div>

      {/* 🧩 GRID: Grundstruktur */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {/* Firma / Ansprechpartner */}
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Firma")}:</span>
          <p class="text-gray-500">{val(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Ansprechpartner")}:</span>
          <p class="text-gray-500">{val(data().contact)}</p>
        </div>

        {/* Straße / Hausnummer */}
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Straße")}:</span>
          <p class="text-gray-500">{val(data().street)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Hausnummer")}:</span>
          <p class="text-gray-500">{val(data().hs_no)}</p>
        </div>

        {/* PLZ / Ort */}
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("PLZ")}:</span>
          <p class="text-gray-500">{val(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Ort")}:</span>
          <p class="text-gray-500">{val(data().city)}</p>
        </div>
      </div>

      {/* 📞 Zeile 4+5 in einer Reihe mit 3 Spalten */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mt-4">
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("Telefon")}:</span>
          <p class="text-gray-500">{val(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("E-Mail")}:</span>
          <p class="text-gray-500">{val(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{requiredLabel("USt-ID")}:</span>
          <p class="text-gray-500">{val(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
