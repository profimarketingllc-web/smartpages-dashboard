export default function CustomerCard(props) {
  const { t, system } = props;

  return (
    <section class="bg-white rounded-xl p-6 shadow space-y-4">
      <h2 class="text-lg font-semibold">
        {t.title}
      </h2>

      <div class="text-sm text-gray-600">
        {system.statusActive}
      </div>

      <button class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
        {t.button}
      </button>
    </section>
  );
}
