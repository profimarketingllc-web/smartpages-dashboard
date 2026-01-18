import { createResource, createSignal, onMount, onCleanup, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function ImprintCard(props) {
  // 🌍 Sprachlogik (SSR-kompatibel)
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (typeof window !== "undefined") {
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

  // 🔄 Toggle speichern → direkt D1-Update
  const handleToggle = async (e) => {
    const newVal = e.currentTarget.checked;
    setUseCustom(newVal);
    setMessage("");
    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: newVal,
          imprint_template: "",
          custom_html: newVal ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        console.log(`✅ use_custom_imprint aktualisiert: ${newVal}`);
        setMessage(
          newVal
            ? t(lang(), "customEnabled", "imprint") || "Eigenes Impressum aktiviert."
            : t(lang(), "customDisabled", "imprint") || "Standard-Impressum wird wieder verwendet."
        );
        window.dispatchEvent(new Event("refresh-imprint-data"));
      } else {
        setMessage(t(lang(), "updateError", "imprint") || "Fehler beim Aktualisieren.");
      }
    } catch (err) {
      console.error("❌ Fehler beim Speichern des Toggles:", err);
      setMessage(t(lang(), "unexpectedError", "imprint") || "Unerwarteter Fehler beim Aktualisieren.");
    }
  };

  // 💾 Custom speichern (R2 via Worker)
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t(lang(), "emptyText", "imprint") || "Bitte gib deinen Impressumstext ein.");
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
      setMessage(
        result.ok
          ? t(lang(), "saveSuccess", "imprint") || "✅ Dein Impressum wurde gespeichert."
          : t(lang(), "saveError", "imprint") || "❌ Fehler beim Speichern."
      );
    } catch {
      setMessage(t(lang(), "unexpectedError", "imprint") || "❌ Unerwarteter Fehler beim Speichern.");
    }
    setSaving(false);
  };

  // 🧱 Layout
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 relative">
      {/* 🔹 Titel + Button */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "imprint")}
        </h2>

        <Show when={!useCustom()}>
          <button
            onClick={() => window.dispatchEvent(new Event("open-imprint-modal"))}
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "imprint")}
          </button>
        </Show>
      </div>

      {/* 🟩 Eigene Impressum-Option */}
      <div class="flex items-center gap-3 mb-6 border border-gray-400 rounded-lg p-3 bg-gray-50">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black cursor-pointer"
        />
        <span class="text-gray-800 font-medium">
          {t(lang(), "useOwnImprint", "imprint") || "Ich verwende ein eigenes Impressum"}
        </span>
      </div>

      {/* ✏️ Custom Impressum */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700 mt-2"
          placeholder={t(lang(), "placeholder", "imprint") || "Hier kannst du dein eigenes Impressum eingeben..."}
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
            {saving()
              ? t(lang(), "saving", "system") || "Speichert..."
              : t(lang(), "saveButton", "system") || "Speichern"}
          </button>
        </div>
        <Show when={message()}>
          <p class="mt-2 text-right text-sm text-gray-600">{message()}</p>
        </Show>
      </Show>

      {/* 📋 Standard-Impressum */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          {[
            ["company", "Firma *", data().company],
            ["contact", "Ansprechpartner *", data().contact],
            ["street", "Straße *", data().street],
            ["hs_no", "Hausnummer *", data().hs_no],
            ["zip", "PLZ *", data().zip],
            ["city", "Ort *", data().city],
            ["registerNumber", "Registernummer", data().registerNumber],
            ["registerCourt", "Registergericht", data().registerCourt],
            ["phone", "Telefon", data().phone],
            ["email", "E-Mail *", data().email],
            ["vat", "USt-ID", data().vat],
          ].map(([key, label, value]) => (
            <div>
              <span class="font-medium text-gray-800">
                {t(lang(), key, "imprint") || label}
              </span>
              <p class="text-gray-500">{displayValue(value)}</p>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
}
