import { createSignal, Show } from "solid-js";
import CustomerModal from "./modals/CustomerModal";

export default function CustomerCard() {
  const [open, setOpen] = createSignal(false);

  /**
   * STATIC / PLACEHOLDER STATE
   * später kommt hier API / Store rein
   */
  const isAuthenticated = false; // ← simuliert ausgeloggten User

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold">Customer Information</h2>

          {/* Status Pill */}
          <Show
            when={isAuthenticated}
            fallback={
              <span class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                Logged out
              </span>
            }
          >
            <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
              Active
            </span>
          </Show>
        </div>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setOpen(true)}
        >
          Edit customer
        </button>
      </div>

      {/* Content */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium">First name</div>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <div class="font-medium">Last name</div>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <div class="font-medium">Company</div>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <div class="font-medium">Plan</div>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <div class="font-medium">Active until</div>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <div class="font-medium">Last login</div>
          <div class="text-gray-500">—</div>
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
