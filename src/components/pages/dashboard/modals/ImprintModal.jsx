import ModalWrapper from "./ModalWrapper";

export default function ImprintModal(props) {
  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-4">Edit imprint</h3>

      <p class="text-sm text-gray-600 mb-6">
        This modal will later contain the full imprint form.
      </p>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 text-sm"
          onClick={props.onClose}
        >
          Cancel
        </button>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded text-sm"
          onClick={props.onClose}
        >
          Save
        </button>
      </div>
    </ModalWrapper>
  );
}
