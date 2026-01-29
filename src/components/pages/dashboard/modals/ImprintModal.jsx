import ModalWrapper from "./ModalWrapper";

export default function ImprintModal(props) {
  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-2">Edit imprint</h3>

      <p class="text-sm text-gray-600 mb-4">
        This is a test modal for the imprint.
      </p>

      <div class="flex justify-end">
        <button
          class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}
