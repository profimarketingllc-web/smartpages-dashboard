export default function PrivacyCard(props) {
  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Privacy policy</h2>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={props.onEdit}
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
    </div>
  );
}
