import { createSignal } from "solid-js";
import PrivacyModal from "./modals/PrivacyModal";

export default function PrivacyCard() {
  const [open, setOpen] = createSignal(false);
  const [custom, setCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-lg font-semibold">Privacy policy</h2>

          <label class="mt-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={custom()}
              onChange={(e) => setCustom(e.currentTarget.checked)}
            />
            I use my own privacy policy
          </label>
        </div>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit privacy
        </button>
      </div>

      {/* Custom privacy policy */}
      {custom() ? (
        <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm text-gray-600 mb-2">
            You are using your own privacy policy. SmartPages will not generate or
            modify legal content.
          </p>

          <div class="min-h-[120px] rounded border bg-white p-3 text-sm text-gray-700">
            —
          </div>
        </div>
      ) : (
        /* Structured fields */
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 mt-4">
          {/* Row 1 */}
          <div>
            <span class="font-medium">Privacy contact:</span> —
          </div>
          <div>
            <span class="font-medium">Email:</span> —
          </div>

          {/* Row 2 – Address block */}
          <div class="space-y-1">
            <span class="font-medium">Address:</span>
            <div class="text-gray-600">
              Street —<br />
              <span>ZIP</span> <span>City</span>, <span>Country</span>
            </div>
          </div>
          <div></div>
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
