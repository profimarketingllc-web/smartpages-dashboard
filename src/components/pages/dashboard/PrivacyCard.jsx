import { createSignal } from "solid-js";

export default function PrivacyCard(props) {
  const { t, system } = props;
  const [useCustom, setUseCustom] = createSignal(false);

  return (
    <div class="bg-white rounded-2xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-[#1E2A45]">
          🔒 {t.title}
        </h2>

        <button
          class="bg-[#E47E00] text-white px-4 py-2 rounded-xl"
          onClick={() =>
           <button
             onClick={props.onEdit}
             class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
             >
             {props.t.button}
           </button>

          }
        >
          {t.button}
        </button>
      </div>

      <label class="flex items-center gap-3 text-sm mb-4">
        <input
          type="checkbox"
          checked={useCustom()}
          onChange={(e) => setUseCustom(e.currentTarget.checked)}
        />
        {t.useOwnPrivacy}
      </label>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><strong>{t.privacy_contact}</strong><br />—</div>
        <div><strong>{t.email}</strong><br />—</div>
        <div><strong>{t.phone}</strong><br />—</div>
        <div><strong>{t.address}</strong><br />—</div>
        <div><strong>{t.country}</strong><br />—</div>
      </div>
    </div>
  );
}
