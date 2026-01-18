import { createResource, createSignal, onMount, onCleanup, Show } from "solid-js";
import { t } from "~/utils/i18n";

export default function ImprintCard(props) {
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Daten abrufen
  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return {};

      const result = await res.json();
      if (!result?.ok || !result.data) return {};

      const i = result.data;
      setUseCustom(i.use_custom_imprint === 1);
      if (i.custom_html) setCustomText(i.custom_html);

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
        registerCourt: i.register_court || "—",
        registerNumber: i.register_number || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden des Impressums:", err);
      return {};
    }
  };

  const [imprint, { refetch }] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const displayValue = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const newVal = e.currentTarget.checked;
    setUseCustom(newVal);
    try {
      await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_custom_imprint: newVal }),
      });
    } catch (err) {
      console.error("Fehler beim Speichern des Toggles:", err);
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage("Bitte gib deinen Impressumstext ein.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: true,
          custom_html: customText(),
        }),
      });
      const result = await res.json();
      setMessage(result.ok ? "✅ Dein Impressum wurde gespeichert." : "❌ Fehler beim Speichern.");
    } catch {
      setMessage("❌ Unerwarteter Fehler beim Speichern.");
    }
    setSaving(false);
  };

  // 🧱 Layout ohne eigenen Rahmen
  return (
    <div class="w-full text-sm text-gray-700 px-6 py-2">
      {/* Kopfzeile */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "imprint")}
        </h2>

        {/* Toggle sichtbar */}
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <span class="text-gray-600">
            {useCustom() ? "Eigenes Impressum" : "Standard"}
          </span>
          <input
            type="checkbox"
            checked={useCustom()}
            onChange={handleToggle}
            class="w-5 h-5 accent-[#1E2A45]"
          />
        </label>
      </div>

      {/* Standardansicht */}
      <Show when={!useCustom()}>
        {/* Button rechts */}
        <div class="flex justify-end mb-3">
          <button
            onClick={() => window.dispatchEvent(new Event("open-imprint-modal"))}
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "imprint")}
          </button>
        </div>

        {/* Grid-Daten */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">Firma *</span>
            <p class="text-gray-500">{displayValue(data().company)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Ansprechpartner *</span>
            <p class="text-gray-500">{displayValue(data().contact)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Straße *</span>
            <p class="text-gray-500">{displayValue(data().street)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Hausnummer *</span>
            <p class="text-gray-500">{displayValue(data().hs_no)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">PLZ *</span>
            <p class="text-gray-500">{displayValue(data().zip)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Ort *</span>
            <p class="text-gray-500">{displayValue(data().city)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Telefon</span>
            <p class="text-gray-500">{displayValue(data().phone)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">E-Mail *</span>
            <p class="text-gray-500">{displayValue(data().email)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">USt-ID</span>
            <p class="text-gray-500">{displayValue(data().vat)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Registergericht</span>
            <p class="text-gray-500">{displayValue(data().registerCourt)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Registernummer</span>
            <p class="text-gray-500">{displayValue(data().registerNumber)}</p>
          </div>
        </div>
      </Show>

      {/* Custom-Ansicht */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700 mt-2"
          placeholder="Hier kannst du dein eigenes Impressum eingeben..."
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end mt-3">
          <button
            disabled={saving()}
            onClick={handleSave}
            class={`px-5 py-2.5 rounded-lg text-white ${
              saving() ? "bg-gray-400" : "bg-[#1E2A45] hover:bg-[#2C3B5A]"
            }`}
          >
            {saving() ? "Speichert..." : "Speichern"}
          </button>
        </div>
        <Show when={message()}>
          <p class="mt-2 text-right text-sm text-gray-600">{message()}</p>
        </Show>
      </Show>
    </div>
  );
}
