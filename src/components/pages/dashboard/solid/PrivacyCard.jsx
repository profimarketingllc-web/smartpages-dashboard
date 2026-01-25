import { createResource, createSignal, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🔐 PrivacyCard (SmartPages v6.0)
 * -------------------------------------------------------
 * ✅ Design 1:1 wie ImprintCard
 * ✅ Einheitlicher Toggle + Custom-Text Flow
 * ✅ Dashboard-i18n (dashboard / privacy)
 * ✅ Modal-Button integriert
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
          : t(lang(), "dashboard", "privacy", "saveError")
      );

      if (json.ok) {
        window.dispatchEvent(new Event("refresh-privacy-data"));
      }
    } catch {
      setMessage(t(lang(), "dashboard", "privacy", "unexpectedError"));
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t(lang(), "dashboard", "privacy", "emptyText"));
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

      const json = await res.json();
      setMessage(
        json.ok
          ? t(lang(), "dashboard", "privacy", "saveSuccess")
          : t(lang(), "dashboard", "privacy", "saveError")
      );
    } catch {
      setMessage(t(lang(), "dashboard", "privacy", "unexpectedError"));
    }
    setSaving(false);
  };

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-5 relative">
      {/* 🔹 Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] flex items-center gap-2">
          🔒 {t(lang(), "dashboard", "privacy", "title")}
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

      {/* 🔘 Toggle */}
      <div class="mb-4 p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
          class="h-4 w-4"
        />
        <span class="font-medium">
          {t(lang(), "dashboard", "privacy", "useOwnPrivacy")}
        </span>
      </div>

      {/* ✍️ Custom Text */}
      <Show when={useCustom()}>
        <div>
          <label class="block font-medium mb-2">
            {t(lang(), "dashboard", "privacy", "customTextLabel")}
          </label>

          <textarea
            class="w-full h-44 border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
            value={customText()}
            onInput={(e) => setCustomText(e.currentTarget.value)}
          />

          <div class="flex justify-end mt-3">
            <button
              disabled={saving()}
              onClick={handleSave}
              class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition-transform"
            >
              {saving()
                ? t(lang(), "dashboard", "system", "saving")
                : t(lang(), "dashboard", "system", "saveButton")}
            </button>
          </div>
        </div>
      </Show>

      {/* 📋 Standard View */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border rounded-xl p-4">
          {Object.entries(data()).map(([key, value]) => (
            <div>
              <span class="font-semibold">
                {t(lang(), "dashboard", "privacy", key)}
              </span>
              <p>{display(value)}</p>
            </div>
          ))}
        </div>
      </Show>

      {/* 💬 Status */}
      <Show when={message()}>
        <p class="mt-3 text-sm text-gray-600">{message()}</p>
      </Show>
    </div>
  );
}
