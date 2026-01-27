import {
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function PrivacyCard(props) {
  /* ----------------------------- */
  /* 🌍 Sprache                    */
  /* ----------------------------- */
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  /* ----------------------------- */
  /* 🧠 State                      */
  /* ----------------------------- */
  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  /* ----------------------------- */
  /* 📡 Fetch                      */
  /* ----------------------------- */
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return {};

      const json = await res.json();
      const p = json?.data;
      if (!p) return {};

      setUseCustom(p.use_custom_privacy === 1);
      if (p.custom_html) setCustomText(p.custom_html);

      return {
        privacy_contact: p.privacy_contact,
        email: p.email,
        phone: p.phone,
        address: p.address,
        country: p.country,
      };
    } catch {
      return {};
    }
  };

  const [privacy] = createResource(fetchPrivacy);
  const data = () => privacy() || {};

  /* ----------------------------- */
  /* 🔄 Actions                    */
  /* ----------------------------- */
  const toggleCustom = async (checked) => {
    setUseCustom(checked);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_privacy: checked,
          custom_html: checked ? customText() : "",
        }),
      });

      const json = await res.json();
      setMessage(
        json.ok
          ? checked
            ? t(lang(), "dashboard", "privacy", "customEnabled")
            : t(lang(), "dashboard", "privacy", "customDisabled")
          : t(lang(), "dashboard", "privacy", "saveError")
      );
    } catch {
      setMessage(t(lang(), "dashboard", "privacy", "unexpectedError"));
    }
  };

  const saveCustom = async () => {
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

  /* ----------------------------- */
  /* 📋 Render                     */
  /* ----------------------------- */
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-5">

      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] flex gap-2">
          🔒 {t(lang(), "dashboard", "privacy", "title")}
        </h2>

        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2 rounded-xl shadow hover:scale-105"
          onClick={() =>
            window.dispatchEvent(new Event("open-privacy-modal"))
          }
        >
          {t(lang(), "dashboard", "privacy", "button")}
        </button>
      </div>

      {/* Toggle */}
      <div class="mb-4 p-4 rounded-xl border bg-gray-50 flex items-center gap-3">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => toggleCustom(e.currentTarget.checked)}
          class="h-4 w-4"
        />
        <span class="font-medium">
          {t(lang(), "dashboard", "privacy", "useOwnPrivacy")}
        </span>
      </div>

      {/* Custom */}
      {useCustom() && (
        <>
          <label class="block font-medium mb-2">
            {t(lang(), "dashboard", "privacy", "customTextLabel")}
          </label>

          <textarea
            class="w-full h-44 border rounded-xl p-3"
            value={customText()}
            onInput={(e) => setCustomText(e.currentTarget.value)}
          />

          <div class="flex justify-end mt-3">
            <button
              disabled={saving()}
              onClick={saveCustom}
              class={
                saving()
                  ? "bg-gray-400 text-white px-6 py-2 rounded-xl"
                  : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2 rounded-xl hover:scale-105"
              }
            >
              {saving()
                ? t(lang(), "dashboard", "system", "saving")
                : t(lang(), "dashboard", "system", "saveButton")}
            </button>
          </div>
        </>
      )}

      {/* Standard */}
      {!useCustom() && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border rounded-xl p-4">
          <Field label={t(lang(), "dashboard", "privacy", "privacy_contact")} value={data().privacy_contact} />
          <Field label={t(lang(), "dashboard", "privacy", "email")} value={data().email} />
          <Field label={t(lang(), "dashboard", "privacy", "phone")} value={data().phone} />
          <Field label={t(lang(), "dashboard", "privacy", "address")} value={data().address} />
          <Field label={t(lang(), "dashboard", "privacy", "country")} value={data().country} />
        </div>
      )}

      {message() && (
        <p class="mt-3 text-sm text-gray-600">{message()}</p>
      )}
    </div>
  );
}

/* ----------------------------- */
/* 🧩 Field                      */
/* ----------------------------- */
function Field(props) {
  return (
    <div>
      <span class="font-semibold">{props.label}</span>
      <p>{props.value || "—"}</p>
    </div>
  );
}
