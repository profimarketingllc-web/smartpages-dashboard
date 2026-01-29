import { createSignal, Show } from "solid-js";
import ImprintModal from "./modals/ImprintModal";

export default function ImprintCard() {
  const [open, setOpen] = createSignal(false);
  const [useCustom, setUseCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Imprint information</h2>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit imprint
        </button>
      </div>

      {/* Toggle */}
      <div class="mb-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => setUseCustom(e.currentTarget.checked)}
        />
        <span>I use my own imprint</span>
      </div>

      {/* Standard Imprint */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="font-medium">Company</div>
            <div class="text-gray-500">—</div>
          </div>
          <div>
            <div class="font-medium">Address</div>
            <div class="text-gray-500">—</div>
          </div>
          <div>
            <div class="font-medium">Email</div>
            <div class="text-gray-500">—</div>
          </div>
          <div>
            <div class="font-medium">Phone</div>
            <div class="text-gray-500">—</div>
          </div>
        </div>
      </Show>

      {/* Custom Imprint */}
      <Show when={useCustom()}>
        <div class="mt-4">
          <label class="block text-sm font-medium mb-2">
            Custom imprint text
          </label>
          <textarea
            class="w-full min-h-[160px] border rounded p-3 text-sm"
            placeholder="Enter your imprint text here…"
          />
        </div>
      </Show>

      {/* Modal */}
      <ImprintModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
