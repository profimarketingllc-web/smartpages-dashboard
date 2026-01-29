import ModalWrapper from "./ModalWrapper";

export default function PrivacyModal(props) {
  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-4">Edit privacy policy</h3>

      <div class="space-y-3 text-sm">
        <div>
          <label class="block font-medium mb-1">Privacy contact</label>
          <input class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block font-medium mb-1">Email</label>
          <input type="email" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block font-medium mb-1">Street & number</label>
          <input class="w-full border rounded px-3 py-2" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-medium mb-1">ZIP</label>
            <input class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block font-medium mb-1">City</label>
            <input class="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label class="block font-medium mb-1">Country</label>
          <input class="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          class="px-4 py-2 rounded border"
          onClick={props.onClose}
        >
          Cancel
        </button>
        <button class="px-4 py-2 rounded bg-slate-800 text-white">
          Save
        </button>
      </div>
    </ModalWrapper>
  );
}
