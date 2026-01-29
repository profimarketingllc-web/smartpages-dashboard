export default function CustomerCard(props) {
  return (
    <div class="bg-white rounded-2xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold flex gap-2">
          👤 Customer Information
        </h2>

        <button
          class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
          onClick={props.onEdit}
        >
          Edit customer
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Field label="First name" value="—" />
        <Field label="Last name" value="—" />
        <Field label="Company" value="—" />
      </div>
    </div>
  );
}

function Field(props) {
  return (
    <div>
      <div class="font-medium text-gray-600">{props.label}</div>
      <div class="text-gray-900">{props.value}</div>
    </div>
  );
}
