import { createResource, createSignal, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🔐 PrivacyCard (SmartPages v6.0)
 * -------------------------------------------------------
 * ✅ Dashboard-Layout stabil
 * ✅ Toggle + Labels sichtbar
 * ✅ Modal-Button aktiv
 * ✅ Seitenbasierte i18n (dashboard / privacy)
 * ✅ JSX-safe (keine Kommentar-Fallen)
 */

export default function PrivacyCard(props) {
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

  // 🔗 Daten laden
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return {};
      const result = await res.json();
      if (!result?.ok || !result.data) return {};

      const p = result.data;
      setUseCustom(p.use_custom_privacy === 1);
      if (p.custom_html) setCustomText(p.custom_html);

      return {
        privacy_contact: p.privacy_contact || "—",
        email: p.email || "—",
        phone: p.phone || "—",
        address: p.address || "—",
        country: p.country || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Privacy-Daten:", err);
      return {};
    }
  };

  const [privacy] = createResource(fetchPrivacy);
  const data = () => privacy() || {};
  const display = (v) => (v && v !== "" ? v : "—");

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustom(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_privacy: active,
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      setMessage(
        json.ok
          ? active
            ? t(lang(), "dashboard", "privacy", "customEnabled")
            : t(lang(), "dashboard", "privacy", "customDisabled")
          : t(lang(), "dashboard", "privacy", "updateError")
      );

      if (json.ok) {
        window.dispatchEvent(new Event("refresh-privacy-data"));
      }
    } catch {
      setMessage(t(lang(), "dashboard", "privacy", "unexpectedError"));
    }
  };

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-5 relative">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          🔐 {t(lang(), "dashboard", "privacy", "title")}
        </h2>

        <button
          onClick={() =>
            window.dispatchEvent(new Event("open-privacy-modal"))
          }
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition-transform"
        >
          {t(lang(), "dashboard", "privacy", "button")}
        </button>
      </div>

      {/* Toggle */}
      <div class="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
        />
        <span>
          {t(lang(), "dashboard", "privacy", "useOwnPrivacy")}
        </span>
      </div>

      {/* Standard-Daten */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(data()).map(([key, value]) => (
            <div>
              <span class="font-medium text-gray-800">
                {t(lang(), "dashboard", "privacy", key)}
              </span>
              <p class="text-gray-600">{display(value)}</p>
            </div>
          ))}
        </div>
      </Show>

      {/* Eigener Text */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-40 border rounded-lg p-3 text-sm"
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
      </Show>

      {/* Status */}
      <Show when={message()}>
        <p class="mt-3 text-sm text-gray-600">{message()}</p>
      </Show>
    </div>
  );
}
