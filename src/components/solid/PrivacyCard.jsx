import { createSignal, createResource, onMount, onCleanup } from "solid-js";
import { t } from "~/utils/i18n";

export default function PrivacyCard(props) {
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  const [useCustomPrivacy, setUseCustomPrivacy] = createSignal(false);
  const [customText, setCustomText] = createSignal("");

  // 🔗 Datenschutz-Daten abrufen
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (!result?.ok || !result.data) return {};

      const p = result.data;

      // Flag prüfen
      setUseCustomPrivacy(p.use_custom_privacy === 1);
      setCustomText(p.custom_privacy_text || "");

      return {
        company: p.company_name || "—",
        contact: p.contact_name || "—",
        street: p.street || "—",
        hs_no: p.hs_no || "—",
        postal_code: p.postal_code || "—",
        city: p.city || "—",
        country: p.country || "—",
        phone: p.phone || "—",
        email: p.email || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Datenschutzerklärung:", err);
      return {};
    }
  };

  const [privacy, { refetch }] = createResource(fetchPrivacy);

  // 🔄 Refresh bei Speichern
  onMount(() => {
    const handler = () => refetch();
    window.addEventListener("refresh-privacy-data", handler);
    onCleanup(() => window.removeEventListener("refresh-privacy-data", handler));
  });

  const handleToggle = async (e) => {
    const active = e.target.checked;
    setUseCustomPrivacy(active);

    try {
      await fetch("/api/customer/privacytoggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ use_custom_privacy: active }),
      });
      console.log(`🔁 Privacy Toggle aktualisiert: ${active}`);
    } catch (err) {
      console.error("⚠️ Fehler beim Umschalten:", err);
    }
  };

  const data = () => privacy() || {};
  const display = (val) => (val && val !== "" ? val : "—");

  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t(lang(), "title", "privacy")}
      </h2>

      {/* 🟢 Button (nur wenn KEIN Custom aktiv) */}
      {!useCustomPrivacy() && (
        <div class="absolute top-4 right-8">
          <button
            onClick={() => window.dispatchEvent(new Event("open-privacy-modal"))}
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "privacy")}
          </button>
        </div>
      )}

      {/* ⚙️ Toggle */}
      <div class="mb-6 flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
        <input
          id="toggle-privacy"
          type="checkbox"
          checked={useCustomPrivacy()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black cursor-pointer"
        />
        <label for="toggle-privacy" class="text-gray-800 text-sm font-medium cursor-pointer">
          Ich verwende eine eigene Datenschutzerklärung
        </label>
      </div>

      {/* 📋 Anzeige Felder oder Custom Text */}
      {useCustomPrivacy() ? (
        <div class="p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 whitespace-pre-line text-sm">
          {customText() || "Kein eigener Datenschutztext hinterlegt."}
        </div>
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">Firma *</span>
            <p class="text-gray-500">{display(data().company)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Ansprechpartner *</span>
            <p class="text-gray-500">{display(data().contact)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">Straße *</span>
            <p class="text-gray-500">{display(data().street)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Hausnummer *</span>
            <p class="text-gray-500">{display(data().hs_no)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">PLZ *</span>
            <p class="text-gray-500">{display(data().postal_code)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Ort *</span>
            <p class="text-gray-500">{display(data().city)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">Telefon</span>
            <p class="text-gray-500">{display(data().phone)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">E-Mail *</span>
            <p class="text-gray-500">{display(data().email)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">Land *</span>
            <p class="text-gray-500">{display(data().country)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
