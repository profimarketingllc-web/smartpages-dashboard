import { createSignal } from "solid-js";
import ImprintModal from "./modals/ImprintModal";

export default function ImprintCard() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Imprint information</h2>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit imprint
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium">Company</div>
          <div>—</div>
        </div>
        <div>
          <div class="font-medium">Address</div>
          <div>—</div>
        </div>
      </div>

      <ImprintModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
