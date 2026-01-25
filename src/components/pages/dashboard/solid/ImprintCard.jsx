import { createResource, createSignal, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧠 ImprintCard (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Seitenbasierte i18n (section = "imprint")
 * ✅ Einheitliches API-Verhalten (/api/customer/imprint)
 * ✅ SSR-sicher
 */

export default function ImprintCard(props) {
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

  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
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

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const display = (v) => (v && v !== "" ? v : "—");

  const handleToggle = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustom(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: active,
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setMessage(
          active
            ? t(lang(), "customEnabled", "imprint")
            : t(lang(), "customDisabled", "imprint")
        );
        window.dispatchEvent(new Event("refresh-imprint-data"));
      } else {
        setMessage(t(lang(), "updateError", "imprint"));
      }
    } catch {
      setMessage(t(lang(), "unexpectedError", "imprint"));
    }
  };

  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t(lang(), "emptyText", "imprint"));
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

      const json = await res.json();
      setMessage(
        json.ok
          ? t(lang(), "saveSuccess", "imprint")
          : t(lang(), "saveError", "imprint")
      );
    } catch {
      setMessage(t(lang(), "unexpectedError", "imprint"));
    }
    setSaving(false);
  };

  return (
    <div class="w-full text-sm text-gray-700 px-7 py-5">
      <h2 class="text-xl font-extrabold text-[#1E2A45] mb-4">
        {t(lang(), "title", "imprint")}
      </h2>

      <div class="flex items-center gap-3 mb-4">
        <input type="checkbox" checked={useCustom()} onChange={handleToggle} />
        <span>{t(lang(), "useOwnImprint", "imprint")}</span>
      </div>

      <Show when={useCustom()}>
        <textarea
          class="w-full h-40 border rounded-lg p-3"
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end mt-3">
          <button
            disabled={saving()}
            onClick={handleSave}
            class="bg-[#1E2A45] text-white px-5 py-2 rounded-lg"
          >
            {saving()
              ? t(lang(), "saving", "system")
              : t(lang(), "saveButton", "system")}
          </button>
        </div>
      </Show>

      <Show when={!useCustom()}>
        <div class="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(data()).map(([k, v]) => (
            <div>
              <span class="font-medium">{t(lang(), k, "imprint")}</span>
              <p>{display(v)}</p>
            </div>
          ))}
        </div>
      </Show>

      <Show when={message()}>
        <p class="mt-3 text-sm text-gray-600">{message()}</p>
      </Show>
    </div>
  );
}
