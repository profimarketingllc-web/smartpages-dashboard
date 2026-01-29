import { createSignal } from "solid-js";
import PrivacyModal from "./modals/PrivacyModal";

export default function PrivacyCard() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Privacy policy</h2>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={() => setOpen(true)}
        >
          Edit privacy
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium">Privacy contact</div>
          <div>—</div>
        </div>
        <div>
          <div class="font-medium">Email</div>
          <div>—</div>
        </div>
      </div>

      <PrivacyModal
        open={open()}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
