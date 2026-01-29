export default function CustomerCard(props) {
  const { t, system } = props;

  return (
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="text-xl font-bold text-[#1E2A45] mb-2">
        {t.title}
      </h2>

      <p class="text-sm text-gray-600 mb-4">
        {system.statusActive}
      </p>

      <button
        class="bg-[#4F6EF7] text-white px-5 py-2 rounded-xl hover:opacity-90"
        onClick={() =>
          window.dispatchEvent(new Event("open-customer-modal"))
        }
      >
        {t.button}
      </button>
    </div>
  );
}
