import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

/**
 * ImprintModal
 * -----------------------------------
 * ✅ KEIN useLang
 * ✅ KEIN i18n import
 * ✅ Texte kommen über props.t
 */

export default function ImprintModal(props) {
  const t = props.t;
  const [saving, setSaving] = createSignal(false);
  const [text, setText] = createSignal("");

  const handleSave = async () => {
    setSaving(true);

    try {
      await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: true,
          custom_html: text(),
        }),
      });

      props.onClose();
    } catch (e) {
      console.error("Save imprint failed", e);
    }

    setSaving(false);
  };

  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-4">{t.editTitle}</h3>

      <textarea
        class="w-full h-48 border rounded-xl p-3 text-sm"
        value={text()}
        onInput={(e) => setText(e.currentTarget.value)}
      />

      <div class="flex justify-end gap-3 mt-5">
        <button
          onClick={props.onClose}
          class="px-4 py-2 rounded-lg border"
        >
          {props.system.cancelButton}
        </button>

        <button
          disabled={saving()}
          onClick={handleSave}
          class="px-5 py-2 rounded-lg text-white bg-[#1E2A45]"
        >
          {saving()
            ? props.system.saving
            : props.system.saveButton}
        </button>
      </div>
    </ModalWrapper>
  );
}
