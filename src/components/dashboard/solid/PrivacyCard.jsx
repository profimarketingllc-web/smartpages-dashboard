import { createSignal, createResource, onMount, onCleanup, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function PrivacyCard(props) {
  // 🌍 Sprachlogik (SSR-kompatibel)
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  const [useCustomPrivacy, setUseCustomPrivacy] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

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
      setUseCustomPrivacy(p.use_custom_privacy === 1);
      if (p.custom_html) setCustomText(p.custom_html);

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
  const data = () => privacy() || {};
  const display = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle speichern → direkt D1-Update auslösen
  const handleToggle = async (e) => {
    const active = e.target.checked;
    setUseCustomPrivacy(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          use_custom_privacy: active,
          privacy_template: "",
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        console.log(`✅ use_custom_privacy aktualisiert: ${active}`);
        setMessage(
          active
            ? t(lang(), "customEnabled", "privacy") ||
              "Eigene Datenschutzerklärung aktiviert."
            : t(lang(), "customDisabled", "privacy") ||
              "Standard-Datenschutzerklärung wieder aktiv."
        );
        window.dispatchEvent(new Event("refresh-privacy-data"));
      } else {
        setMessage(
          t(lang(), "updateError", "privacy") ||
            "⚠️ Fehler beim Aktualisieren der Datenschutzerklärung."
        );
      }
    } catch (err) {
      console.error("❌ Fehler beim Speichern des Toggles:", err);
      setMessage(
        t(lang(), "unexpectedError", "privacy") ||
          "❌ Unerwarteter Fehler beim Aktualisieren."
      );
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(
        t(lang(), "emptyText", "privacy") ||
          "Bitte gib deinen Datenschutztext ein."
      );
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          use_custom_privacy: true,
          custom_html: customText(),
        }),
      });
      const result = await res.json();
      setMessage(
        result.ok
          ? t(lang(), "saveSuccess", "privacy") ||
            "✅ Datenschutz erfolgreich gespeichert."
          : t(lang(), "saveError", "privacy") ||
            "❌ Fehler beim Speichern."
      );
    } catch {
      setMessage(
        t(lang(), "unexpectedError", "privacy") ||
          "❌ Unerwarteter Fehler beim Speichern."
      );
    }
    setSaving(false);
  };

  // 🧱 Layout
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 relative">
      {/* 🔹 Titel + Modal-Button */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "privacy")}
        </h2>

        <Show when={!useCustomPrivacy()}>
          <button
            onClick={() =>
              window.dispatchEvent(new Event("open-privacy-modal"))
            }
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "privacy")}
          </button>
        </Show>
      </div>

      {/* ⚙️ Toggle */}
      <div class="mb-6 flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-400">
        <input
          id="toggle-privacy"
          type="checkbox"
          checked={useCustomPrivacy()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black cursor-pointer"
        />
        <label
          for="toggle-privacy"
          class="text-gray-800 text-sm font-medium cursor-pointer"
        >
          {t(lang(), "useOwnPrivacy", "privacy") ||
            "Ich verwende eine eigene Datenschutzerklärung"}
        </label>
      </div>

      {/* 📋 Anzeige Felder oder Custom Text */}
      <Show when={useCustomPrivacy()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700 mt-2"
          placeholder={
            t(lang(), "placeholder", "privacy") ||
            "Hier kannst du deine eigene Datenschutzerklärung eingeben..."
          }
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

      {/* 📋 Standard-Datenanzeige */}
      <Show when={!useCustomPrivacy()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          {[
            ["company", "Firma *", data().company],
            ["contact", "Ansprechpartner *", data().contact],
            ["street", "Straße *", data().street],
            ["hs_no", "Hausnummer *", data().hs_no],
            ["postal_code", "PLZ *", data().postal_code],
            ["city", "Ort *", data().city],
            ["phone", "Telefon", data().phone],
            ["email", "E-Mail *", data().email],
            ["country", "Land *", data().country],
          ].map(([key, label, value]) => (
            <div>
              <span class="font-medium text-gray-800">
                {t(lang(), key, "privacy") || label}
              </span>
              <p class="text-gray-500">{display(value)}</p>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
}

