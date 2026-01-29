import { createResource, createSignal, Show } from "solid-js";

export default function ImprintCard(props) {
  const { t, system } = props;

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  /* ----------------------------- */
  /* 📡 Fetch                      */
  /* ----------------------------- */
  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return {};
      const json = await res.json();
      const i = json?.data;
      if (!i) return {};

      setUseCustom(i.use_custom_imprint === 1);
      if (i.custom_html) setCustomText(i.custom_html);

      return {
        company: i.company_name,
        contact: i.contact_name,
        street: i.street,
        hs_no: i.hs_no,
        zip: i.postal_code,
        city: i.city,
        country: i.country,
        phone: i.phone,
        email: i.email,
        vat: i.tax_id,
        registerCourt: i.register_court,
        registerNumber: i.register_number,
      };
    } catch {
      return {};
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const display = (v) => (v && v !== "" ? v : "—");

  /* ----------------------------- */
  /* 🔄 Actions                    */
  /* ----------------------------- */
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
      setMessage(
        json.ok
          ? active
            ? t.customEnabled
            : t.customDisabled
          : t.saveError
      );
    } catch {
      setMessage(t.unexpectedError);
    }
  };

  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t.emptyText);
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
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">🧾 {t.title}</h2>

        <Show when={!useCustom()}>
          <button
            onClick={() =>
              window.dispatchEvent(new Event("open-imprint-modal"))
            }
            class="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition"
          >
            {t.button}
          </button>
        </Show>
      </div>

      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
        />
        <span class="text-sm">{t.useOwnImprint}</span>
      </div>

      <Show when={useCustom()}>
        <textarea
          class="w-full h-40 p-3 border rounded-lg text-sm"
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end">
          <button
            disabled={saving()}
            onClick={handleSave}
            class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
          >
            {saving() ? system.saving : system.saveButton}
          </button>
        </div>
      </Show>

      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(data()).map((key) => (
            <div>
              <div
