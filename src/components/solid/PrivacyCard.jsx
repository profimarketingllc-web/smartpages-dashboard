import { createResource, createSignal, onMount, Show } from "solid-js";
import { t } from "~/utils/i18n";

export default function PrivacyCard(props) {
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

  // 🔗 Datenschutz-Daten abrufen
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return {};

      const result = await res.json();
      if (!result?.ok || !result.data) return {};

      const i = result.data;
      setUseCustom(i.use_custom_privacy === 1);
      if (i.custom_html) setCustomText(i.custom_html);

      return {
        privacy_contact: i.privacy_contact || "—",
        email: i.email || "—",
        phone: i.phone || "—",
        address: i.address || "—",
        country: i.country || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Datenschutzerklärung:", err);
      return {};
    }
  };

  const [privacy, { refetch }] = createResource(fetchPrivacy);
  const data = () => privacy() || {};
  const displayValue = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const newVal = e.currentTarget.checked;
    setUseCustom(newVal);
    try {
      await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_custom_privacy: newVal }),
      });
    } catch (err) {
      console.error("Fehler beim Speichern des Toggles:", err);
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage("Bitte gib deinen Datenschutztext ein.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_privacy: true,
          custom_html: customText(),
        }),
      });
      const result = await res.json();
      setMessage(result.ok ? "✅ Deine Datenschutzerklärung wurde gespeichert." : "❌ Fehler beim Speichern.");
    } catch {
      setMessage("❌ Unerwarteter Fehler beim Speichern.");
    }
    setSaving(false);
  };

  // 🧱 Layout
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 relative">
      {/* 🔹 Titel + Button (wenn kein Custom aktiv) */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "privacy") || "Datenschutzerklärung"}
        </h2>

        <Show when={!useCustom()}>
          <button
            onClick={() => window.dispatchEvent(new Event("open-privacy-modal"))}
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "privacy") || "Datenschutz bearbeiten"}
          </button>
        </Show>
      </div>

      {/* 🟩 Eigene Datenschutzerklärung */}
      <div class="flex items-center gap-3 mb-6 border border-gray-300 rounded-lg p-3 bg-gray-50">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black cursor-pointer"
        />
        <span class="text-gray-800 font-medium">
          Ich verwende eine eigene Datenschutzerklärung
        </span>
      </div>

      {/* Wenn eigene Datenschutzerklärung aktiv */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700 mt-2"
          placeholder="Hier kannst du deine eigene Datenschutzerklärung eingeben..."
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

      {/* Wenn Standard-Datenschutz aktiv */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">Datenschutzbeauftragter *</span>
            <p class="text-gray-500">{displayValue(data().privacy_contact)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">E-Mail *</span>
            <p class="text-gray-500">{displayValue(data().email)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">Telefon</span>
            <p class="text-gray-500">{displayValue(data().phone)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">Adresse *</span>
            <p class="text-gray-500">{displayValue(data().address)}</p>
          </div>

          <div>
            <span class="font-medium text-gray-800">Land</span>
            <p class="text-gray-500">{displayValue(data().country)}</p>
          </div>
        </div>
      </Show>
    </div>
  );
}
