export default function ImprintCard(props) {
  return (
    <div class="bg-white rounded-2xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold">Imprint information</h2>

        <button
          class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
          onClick={props.onEdit}
        >
          Edit imprint
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium">Company</span>
          <div class="text-gray-500">—</div>
        </div>

        <div>
          <span class="font-medium">Address</span>
          <div class="text-gray-500">—</div>
        </div>
      </div>
    </div>
  );
}
