export default function ImprintCard(props) {
  const t = props.t;

  return (
    <section class="bg-white rounded-2xl shadow-sm border px-6 py-5">
      {/* Header */}
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-extrabold text-[#1E2A45] flex gap-2">
          🧾 {t.title}
        </h2>

        <button
          onClick={props.onEdit}
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          {t.button}
        </button>
      </div>

      {/* Status / Platzhalter */}
      <div class="text-sm text-gray-600">
        Standard-Impressum geladen.
      </div>
    </section>
  );
}
