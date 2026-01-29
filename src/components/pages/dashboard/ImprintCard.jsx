export default function ImprintCard(props) {
  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Imprint information</h2>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={props.onEdit}
        >
          Edit imprint
        </button>
      </div>

      <div class="text-sm">
        <div class="font-medium">Company</div>
        <div>—</div>

        <div class="font-medium mt-2">Address</div>
        <div>—</div>
      </div>
    </div>
  );
}
