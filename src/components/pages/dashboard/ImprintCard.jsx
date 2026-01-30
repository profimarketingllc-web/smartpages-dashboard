import { createSignal } from "solid-js";
import ImprintModal from "./modals/ImprintModal";

export default function ImprintCard() {
  const [open, setOpen] = createSignal(false);
  const [custom, setCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-lg font-semibold">Imprint information</h2>

          <label class="mt-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={custom()}
              onChange={(e) => setCustom(e.currentTarget.checked)}
            />
            I use my own imprint text
          </label>
        </div>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit imprint
        </button>
      </div>

      {/* Custom imprint text */}
      {custom() ? (
        <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm text-gray-600 mb-2">
            You are using your own imprint text. SmartPages will not generate or
            modify legal content.
          </p>

          <div class="min-h-[120px] rounded border bg-white p-3 text-sm text-gray-700">
            {/* später: tatsächlicher Imprint-Text */}
            —
          </div>
        </div>
      ) : (
        /* Structured imprint fields */
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 text-sm text-gray-700 mt-4">
          {/* Left column */}
          <div class="space-y-3">
            <div>
              <span class="font-medium">Company:</span> —
            </div>
            <div>
              <span class="font-medium">Address:</span>
              <div class="mt-1 text-gray-600">
                —<br />—
              </div>
              <div>
               <span class="font-medium">Country:</span> —
              </div>
            </div>
           </div>

          {/* Right column */}
          <div class="space-y-3">
            <div>
              <span class="font-medium">Contact:</span> —
            </div>
            <div>
              <span class="font-medium">Email:</span> —
            </div>
            <div>
              <span class="font-medium">Register court:</span> —
            </div>
            <div>
              <span class="font-medium">Register number:</span> —
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <ImprintModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
