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

        {/* Edit Button NUR im Standard-Modus */}
        <Show when={!useCustom()}>
          <button
            class="bg-slate-800 text-white px-4 py-2 rounded"
            onClick={() => setOpen(true)}
          >
            Edit imprint
          </button>
        </Show>
      </div>

      {/* TOGGLE – ZENTRALER SCHALTER */}
      <label class="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => setUseCustom(e.currentTarget.checked)}
        />
        I use my own imprint text
      </label>

      {/* STANDARD VIEW */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div class="font-medium">Company / Name</div>
            <div class="text-gray-600">—</div>
          </div>

          <div>
            <div class="font-medium">Email</div>
            <div class="text-gray-600">—</div>
          </div>

          <div class="md:col-span-2">
            <div class="font-medium">Address</div>
            <div class="text-gray-600">
              —<br />
              — —
            </div>
          </div>

          <div>
            <div class="font-medium">Country</div>
            <div class="text-gray-600">—</div>
          </div>

          <div>
            <div class="font-medium">Register</div>
            <div class="text-gray-600">— / —</div>
          </div>
        </div>
      </Show>

      {/* CUSTOM MODE INFO */}
      <Show when={useCustom()}>
        <div class="text-sm text-gray-600 italic">
          You are using your own imprint text.  
          SmartPages will not generate or modify legal content.
        </div>
      </Show>

      {/* MODAL NUR IM STANDARD-MODUS */}
      <Show when={!useCustom()}>
        <ImprintModal
          open={open()}
          onClose={() => setOpen(false)}
        />
      </Show>
    </div>
  );
}
