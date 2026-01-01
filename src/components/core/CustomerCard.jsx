export default function CustomerCard() {
  return (
    <div class="w-full">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Kundendaten</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-sm text-gray-700">
        <div>
          <span class="font-medium text-gray-800">Name:</span>
          <p class="text-gray-500">—</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Tarif:</span>
          <p class="text-gray-500">—</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Status:</span>
          <p class="text-gray-500">Abgemeldet</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Aktiv bis:</span>
          <p class="text-gray-500">—</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Letzter Login:</span>
          <p class="text-gray-500">—</p>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200">
          Profil bearbeiten
        </button>
      </div>
    </div>
  );
}
