import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t } from "~/utils/i18n";

/**
 * 🧾 ImprintCard (SmartPages v5.2 – angepasst an D1 Schema)
 * -------------------------------------------------------
 * ✅ Läuft über Core Worker Proxy (/api/customer/imprint)
 * ✅ Holt Daten aus imprint_data (D1)
 * ✅ Reagiert auf refresh-imprint-data
 * ✅ Einheitliches Design mit CustomerCard
 * ✅ Mapping korrigiert: postal_code, email, tax_id usw.
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

  // 🔗 Imprint-Daten abrufen (über Core Worker Proxy)
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
          return { company: "—", contact: "—" };
        }
        throw new Error(`API-Fehler: ${res.status}`);
      }

      const result = await res.json();
      if (!result?.ok || !result.data) {
        return {
          company: "—",
          contact: "—",
          street: "—",
          number: "—",
          zip: "—",
          city: "—",
          email: "—",
          phone: "—",
          vat: "—",
        };
      }

      // 🔹 Feldzuordnung aus aktueller DB-Struktur (imprint_data)
      const i = result.data;
      return {
        company: i.company_name || "—",
        contact: i.contact_name || "—",
        street: i.street || "—",
        number: i.hs_no || "—",
        zip: i.postal_code || "—",
        city: i.city || "—",
        email: i.email || "—",
        phone: i.phone || "—",
        vat: i.tax_id || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden des Impressums:", err);
      return {
        company: "—",
        contact: "—",
        street: "—",
        number: "—",
        zip: "—",
        city: "—",
        email: "—",
        phone: "—",
        vat: "—",
      };
    }
  };

  // 🧠 Solid Resource + Refresh-Event
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
  const displayValue = (val) => (val ? val : "—");

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

      {/* 🧩 Gri*
