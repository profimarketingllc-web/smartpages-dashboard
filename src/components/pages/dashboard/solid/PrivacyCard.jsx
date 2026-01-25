import { createSignal, createResource, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function PrivacyCard(props) {
  // 🌍 Sprache (SSR-sicher)
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

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustomPrivacy(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          use_custom_privacy: active,
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setMessage(
          active
            ? t(lang(), "customEnabled", "privacy")
            : t(lang(), "customDisabled", "privacy")
        );
        window.dispatchEvent(new Event("refresh-privacy-data"));
      } else {
        setMessage(t(lang(), "updateError", "privacy"));
      }
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang(), "unexpectedError", "privacy"));
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t(lang(), "emptyText", "privacy"));
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
          ? t(lang(), "saveSuccess", "privacy")
          : t(lang(), "saveError", "privacy")
      );
    } catch {
      setMessage(t(lang(), "unexpectedError", "privacy"));
    }
    setSaving(false);
  };

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "privacy")}
        </h2>

        <Show when={!useCustomPrivacy()}>
          <button
            onClick={() =>
              window.dispatchEvent(new Event("open-privacy-modal"))
            }
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl"
          >
            {t(lang(), "button", "privacy")}
          </button>
        </Show>
      </div>

      <div class="mb-6 flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border">
        <input
          type="checkbox"
          checked={useCustomPrivacy()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black"
        />
        <span class="font-medium">
          {t(lang(), "useOwnPrivacy", "privacy")}
        </span>
      </div>

      <Show when={useCustomPrivacy()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg"
          placeholder={t(lang(), "placeholder", "privacy")}
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end mt-3">
          <button
            disabled={saving()}
            onClick={handleSave}
            class="px-5 py-2.5 rounded-lg text-white bg-[#1E2A45]"
          >
            {saving()
              ? t(lang(), "saving", "system")
              : t(lang(), "saveButton", "system")}
          </button>
        </div>
        <Show when={message()}>
          <p class="mt-2 text-right text-sm">{message()}</p>
        </Show>
      </Show>

      <Show when={!useCustomPrivacy()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-xl p-4">
          {[
            ["company", data().company],
            ["contact", data().contact],
            ["street", data().street],
            ["hs_no", data().hs_no],
            ["postal_code", data().postal_code],
            ["city", data().city],
            ["country", data().country],
            ["phone", data().phone],
            ["email", data().email],
          ].map(([key, value]) => (
            <div>
              <span class="font-medium">
                {t(lang(), key, "privacy")}
              </span>
              <p class="text-gray-500">{display(value)}</p>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
}
