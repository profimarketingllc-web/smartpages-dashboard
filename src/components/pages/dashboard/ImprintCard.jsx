// src/components/pages/dashboard/ImprintCard.jsx
export default function ImprintCard(props) {
  return (
    <div class="bg-white rounded-2xl shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          🧾 Imprint information
        </h2>

        <button
          onClick={props.onEdit}
          class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg text-sm"
        >
          Edit imprint
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium">Company</span>
          <p class="text-gray-500">—</p>
        </div>

        <div>
          <span class="font-medium">Email</span>
          <p class="text-gray-500">—</p>
        </div>

        <div>
          <span class="font-medium">Address</span>
          <p class="text-gray-500">—</p>
        </div>
      </div>
    </div>
  );
}
