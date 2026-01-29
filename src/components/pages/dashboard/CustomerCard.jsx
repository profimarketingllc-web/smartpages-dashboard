import { createSignal } from "solid-js";
import CustomerModal from "./modals/CustomerModal";

export default function CustomerCard() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Customer Information</h2>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit customer
        </button>
      </div>

      {/* Content */}
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium">First name</div>
          <div>—</div>
        </div>

        <div>
          <div class="font-medium">Last name</div>
          <div>—</div>
        </div>

        <div>
          <div class="font-medium">Company</div>
          <div>—</div>
        </div>
      </div>

      {/* Modal */}
      <CustomerModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
