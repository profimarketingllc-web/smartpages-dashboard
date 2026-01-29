import { createSignal } from "solid-js";

export default function ImprintCard(props) {
  const { t, system } = props;
  const [useCustom, setUseCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-2xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-[#1E2A45]">
          🧾 {t.title}
        </h2>

        {!useCustom() && (
          <button
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-4 py-2 rounded-xl"
            onClick={() =>
              window.dispatchEvent(new Event("open-imprint-modal"))
            }
          >
            {t.button}
          </button>
        )}
      </div>

      <label class="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => setUseCustom(e.currentTarget.checked)}
        />
        {t.useOwnImprint}
      </label>

      <p class="mt-3 text-gray-500 text-sm">
        Standard imprint loaded.
      </p>
    </div>
  );
}
