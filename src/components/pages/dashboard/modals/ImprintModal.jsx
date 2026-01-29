// src/components/pages/dashboard/modals/ImprintModal.jsx
import ModalWrapper from "./ModalWrapper";

export default function ImprintModal(props) {
  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h2 class="text-lg font-semibold mb-2">Edit imprint</h2>

      <p class="text-sm text-gray-600 mb-6">
        This is a test modal for the imprint.
      </p>

      <div class="flex justify-end">
        <button
          onClick={props.onClose}
          class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}
