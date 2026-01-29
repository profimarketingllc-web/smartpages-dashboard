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

      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  };

  const [imprint] = createResource(fetchImprint);

  /* ----------------------------- */
  /* 🔄 Actions                    */
  /* ----------------------------- */
  const toggleCustom = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustom(active);
    setMessage("");
  };

  const saveCustom = async () => {
    if (!customText().trim()) {
      setMessage(t.emptyText);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage(t.saveSuccess);
    }, 500);
  };

  /* ----------------------------- */
  /* 🧱 Render                     */
  /* ----------------------------- */
  return (
    <section class="bg-white rounded-xl p-6 shadow space-y-4">
      <h2 class="text-lg font-semibold">🧾 {t.title}</h2>

      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={toggleCustom}
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
            onClick={saveCustom}
            class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
          >
            {saving() ? system.saving : system.saveButton}
          </button>
        </div>
      </Show>

      <Show when={!useCustom()}>
        <div class="text-sm text-gray-500">
          Standard-Impressum geladen.
        </div>
      </Show>

      <Show when={message()}>
        <p class="text-sm text-gray-600">{message()}</p>
      </Show>
    </section>
  );
}
