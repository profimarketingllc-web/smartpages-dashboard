import { createSignal } from "solid-js";
import PrivacyModal from "./modals/PrivacyModal";

export default function PrivacyCard() {
  const [open, setOpen] = createSignal(false);
  const [useCustom, setUseCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Privacy policy</h2>

        {!useCustom() && (
          <button
            class="bg-slate-800 text-white px-4 py-2 rounded"
            onClick={() => setOpen(true)}
          >
            Edit privacy
          </button>
        )}
      </div>

      {/* Toggle */}
      <label class="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => setUseCustom(e.currentTarget.checked)}
        />
        I use my own privacy policy
      </label>

      {/* Content */}
      {!useCustom() ? (
        <div class="text-sm text-gray-700 space-y-2">
          <div>
            <span class="font-medium">Privacy contact:</span> —
          </div>
          <div>
            <span class="font-medium">Email:</span> —
          </div>
          <div>
            <span class="font-medium">Address:</span> —
          </div>
          <div>
            <span class="font-medium">Country:</span> —
          </div>
        </div>
      ) : (
        <div class="text-sm text-gray-500 italic">
          Custom privacy text is active.
        </div>
      )}

      {/* Modal */}
      <PrivacyModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
