import ModalWrapper from "./ModalWrapper";

export default function PrivacyModal(props) {
  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-semibold mb-4">Edit privacy policy</h3>

      <div class="space-y-4 text-sm">
        <div>
          <label class="block font-medium mb-1">Privacy contact</label>
          <input
            type="text"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">Email</label>
          <input
            type="email"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label class="block font-medium mb-1">Street & house number</label>
          <input
            type="text"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block font-medium mb-1">ZIP</label>
            <input
              type="text"
              class="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label class="block font-medium mb-1">City</label>
            <input
              type="text"
              class="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label class="block font-medium mb-1">Country</label>
          <input
            type="text"
            class="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <button
          class="text-sm"
          onClick={props.onClose}
        >
          Cancel
        </button>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded text-sm"
        >
          Save
        </button>
      </div>
    </ModalWrapper>
  );
}
