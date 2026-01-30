import { createSignal } from "solid-js";
import CustomerModal from "./modals/CustomerModal";

export default function CustomerCard() {
  const [open, setOpen] = createSignal(false);
  const authenticated = false; // später aus userinfo

  return (
    <div class="bg-white rounded-xl p-4 shadow">
      {/* Header */}
      <div class="flex items-start justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold">Customer information</h2>
        </div>

        {/* Status pill */}
        <span
          class={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            authenticated
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {authenticated ? "Authenticated" : "Not authenticated"}
        </span>
      </div>

      {/* Content */}
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 text-sm text-gray-700">
        {/* Left column */}
        <div class="space-y-4">
          <div>
            <span class="font-medium">Name:</span> —
          </div>
          <div>
            <span class="font-medium">Company:</span> —
          </div>
          <div>
            <span class="font-medium">Last login:</span> —
          </div>
        </div>

        {/* Right column */}
        <div class="space-y-4">
          <div>
            <span class="font-medium">Plan:</span> —
          </div>
          <div>
            <span class="font-medium">Active until:</span> —
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div class="mt-4 flex justify-end">
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit customer
        </button>
      </div>

      {/* Modal */}
      <CustomerModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
