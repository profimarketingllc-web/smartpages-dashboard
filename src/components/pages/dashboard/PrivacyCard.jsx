import { createResource, createSignal, Show } from "solid-js";

export default function PrivacyCard(props) {
  const { t, system } = props;

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
            ? t.customEnabled
            : t.customDisabled
          : t.saveError
      );
    } catch {
      setMessage(t.unexpectedError);
    }
  };

  const saveCustom = async () => {
    if (!customText().trim()) {
      setMessage(t.emptyText);
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
      setMessage(json.ok ? t.saveSuccess : t.saveError);
    } catch {
      setMessage(t.unexpectedError);
    }
    setSaving(false);
  };

  /* ----------------------------- */
  /* 📋 Render                     */
  /* ----------------------------- */
  return (
    <section class="bg-white rounded-xl p-6 shadow space-y-4">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold flex gap-2">
          🔒 {t.title}
        </h2>

        <button
          class="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
          onClick={() =>
            window.dispatchEvent(new Event("open-privacy-modal"))
          }
        >
          {t.button}
        </button>
      </div>

      {/* Toggle */}
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => toggleCustom(e.currentTarget.checked)}
        />
        <span class="text-sm">{t.useOwnPrivacy}</span>
      </div>

      {/* Custom */}
      <Show when={useCustom()}>
        <label class="block text-sm font-medium">
          {t.customTextLabel}
        </label>

        <textarea
          class="w-full h-40 p-3 border rounded-lg text-sm"
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />

        <div class="flex justify-end">
          <button
            disabled={saving()}
            onClick={saveCustom}
            class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
          >
            {saving() ? system.saving : system.saveButton}
          </button>
        </div>
      </Show>

      {/* Standard */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t.privacy_contact} value={data().privacy_contact} />
          <Field label={t.email} value={data().email} />
          <Field label={t.phone} value={data().phone} />
          <Field label={t.address} value={data().address} />
          <Field label={t.country} value={data().country} />
        </div>
      </Show>

      <Show when={message()}>
        <p class="text-sm text-gray-600">{message()}</p>
      </Show>
    </section>
  );
}

/* ----------------------------- */
/* 🧩 Field                      */
/* ----------------------------- */
function Field(props) {
  return (
    <div>
      <span class="font-medium text-sm">{props.label}</span>
      <p class="text-gray-500 text-sm">{props.value || "—"}</p>
    </div>
  );
}
