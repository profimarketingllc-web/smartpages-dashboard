import ModalWrapper from "./ModalWrapper";

export default function ImprintModal(props) {
  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-6">Edit imprint</h3>

      <div class="grid grid-cols-2 gap-4 text-sm">
        {/* Company */}
        <div class="col-span-2">
          <label class="font-medium">Company</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Contact */}
        <div class="col-span-2">
          <label class="font-medium">Contact name</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Street */}
        <div>
          <label class="font-medium">Street</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* House number */}
        <div>
          <label class="font-medium">House number</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* ZIP */}
        <div>
          <label class="font-medium">ZIP</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* City */}
        <div>
          <label class="font-medium">City</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Country */}
        <div class="col-span-2">
          <label class="font-medium">Country</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Email */}
        <div class="col-span-2">
          <label class="font-medium">Email</label>
          <input type="email" class="w-full border rounded p-2" />
        </div>

        {/* Phone */}
        <div class="col-span-2">
          <label class="font-medium">Phone</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* VAT */}
        <div class="col-span-2">
          <label class="font-medium">VAT ID</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Register court */}
        <div>
          <label class="font-medium">Register court</label>
          <input class="w-full border rounded p-2" />
        </div>

        {/* Register number */}
        <div>
          <label class="font-medium">Register number</label>
          <input class="w-full border rounded p-2" />
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-end gap-3 mt-6">
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
