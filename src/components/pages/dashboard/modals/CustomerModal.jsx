import ModalWrapper from "./ModalWrapper";

export default function CustomerModal(props) {
  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-4">
        Edit customer
      </h3>

      <p class="text-sm text-gray-600">
        This is a test modal.  
        If you see this, everything works 🎉
      </p>

      <div class="mt-6 flex justify-end">
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
