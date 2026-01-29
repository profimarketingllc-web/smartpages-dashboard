export default function CustomerCard(props) {
  const t = props.t;

  return (
    <section class="bg-white rounded-2xl shadow-sm border px-6 py-5">
      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-extrabold text-[#1E2A45] flex gap-2">
          👤 {t.title}
        </h2>

        <button
          onClick={props.onEdit}
          class="bg-[#1E2A45] text-white px-5 py-2 rounded-xl hover:bg-[#2C3B5A] transition"
        >
          {t.button}
        </button>
      </div>

      {/* Content (Platzhalter, Daten kommen später) */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Field label={t.firstName} value="—" />
        <Field label={t.lastName} value="—" />
        <Field label={t.company} value="—" />
        <Field label={t.status} value="Active" />
      </div>
    </section>
  );
}

function Field(props) {
  return (
    <div>
      <div class="font-medium text-gray-800">{props.label}</div>
      <div class="text-gray-500">{props.value}</div>
    </div>
  );
}
