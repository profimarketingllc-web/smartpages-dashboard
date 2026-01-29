import { createSignal, onMount, onCleanup, Show } from "solid-js";

export default function CustomerModal(props) {
  const { t, system, customer } = props;

  const [open, setOpen] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [form, setForm] = createSignal({});

  /* ----------------------------- */
  /* 🔔 Event Handling             */
  /* ----------------------------- */
  const openModal = () => {
    setForm({ ...customer() });
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  onMount(() => {
    window.addEventListener("open-customer-modal", openModal);
  });

  onCleanup(() => {
    window.removeEventListener("open-customer-modal", openModal);
  });

  /* ----------------------------- */
  /* 💾 Save                       */
  /* ----------------------------- */
  const save = async () => {
    setSaving(true);

    try {
      const res = await fetch("/api/customer/edit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form()),
      });

      const json = await res.json();

      if (json.ok) {
        window.dispatchEvent(
          new CustomEvent("customer-updated", {
            detail: form(),
          })
        );
        closeModal();
      }
    } catch {
      /* bewusst leer */
    }

    setSaving(false);
  };

  /* ----------------------------- */
  /* 🧱 Render                     */
  /* ----------------------------- */
  return (
    <Show when={open()}>
      <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div class="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
          <h2 class="text-lg font-semibold">
            {t.editTitle}
          </h2>

          <input
            class="w-full border p-2 rounded"
            placeholder={t.firstName}
            value={form().first_name || ""}
            onInput={(e) =>
              setForm({ ...form(), first_name: e.currentTarget.value })
            }
          />

          <input
            class="w-full border p-2 rounded"
            placeholder={t.lastName}
            value={form().last_name || ""}
            onInput={(e) =>
              setForm({ ...form(), last_name: e.currentTarget.value })
            }
          />

          <input
            class="w-full border p-2 rounded"
            placeholder={t.company}
            value={form().company || ""}
            onInput={(e) =>
              setForm({ ...form(), company: e.currentTarget.value })
            }
          />

          <div class="flex justify-end gap-3 pt-4">
            <button
              onClick={closeModal}
              class="px-4 py-2 rounded bg-gray-200"
            >
              {system.cancelButton}
            </button>

            <button
              disabled={saving()}
              onClick={save}
              class="px-4 py-2 rounded bg-slate-800 text-white"
            >
              {saving() ? system.saving : system.saveButton}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
