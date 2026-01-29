import { createSignal, Show } from "solid-js";
import PrivacyModal from "./modals/PrivacyModal";

export default function PrivacyCard() {
  const [open, setOpen] = createSignal(false);
  const [useCustomText, setUseCustomText] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Privacy policy</h2>

        <Show when={!useCustomText()}>
          <button
            class="bg-slate-800 text-white px-4 py-2 rounded"
            onClick={() => setOpen(true)}
          >
            Edit privacy
          </button>
        </Show>
      </div>

      {/* Toggle */}
      <div class="mb-4">
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useCustomText()}
            onChange={(e) => setUseCustomText(e.currentTarget.checked)}
          />
          I use my own privacy policy text
        </label>
      </div>

      {/* Standard data view */}
      <Show when={!useCustomText()}>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="font-medium">Privacy contact</div>
            <div class="text-gray-500">—</div>
          </div>

          <div>
            <div class="font-medium">Email</div>
            <div class="text-gray-500">—</div>
          </div>

          <div>
            <div class="font-medium">Address</div>
            <div class="text-gray-500">—</div>
          </div>

          <div>
            <div class="font-medium">Country</div>
            <div class="text-gray-500">—</div>
          </div>
        </div>
      </Show>

      {/* Custom text info */}
      <Show when={useCustomText()}>
        <div class="text-sm text-gray-600 italic">
          Custom privacy policy is active.
        </div>
      </Show>

      {/* Modal */}
      <PrivacyModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
