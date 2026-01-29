export default function CustomerCard(props) {
  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Customer Information</h2>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          onClick={props.onEdit}
        >
          Edit customer
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div class="font-medium">First name</div>
          <div>—</div>
        </div>
        <div>
          <div class="font-medium">Last name</div>
          <div>—</div>
        </div>
        <div>
          <div class="font-medium">Company</div>
          <div>—</div>
        </div>
      </div>
    </div>
  );
}
