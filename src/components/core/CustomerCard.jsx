import { createSignal, onMount } from "solid-js";

export default function CustomerCard() {
  const [user, setUser] = createSignal({
    name: "",
    tariff: "",
    status: "",
    activeUntil: "",
    lastLogin: "",
  });

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    // Simulierter Ladezustand
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  return (
    <div class="bg-[#f9fafb] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 relative">
      <h2 class="text-lg md:text-xl font-extrabold text-[#1E2A45] mb-4">
        Kundendaten
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#1E2A45]">
        <div>
          <span class="font-medium">Name:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-3/4" : ""}`}>
            {!loading() && (user().name || "—")}
          </div>
        </div>
        <div>
          <span class="font-medium">Tarif:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-1/2" : ""}`}>
            {!loading() && (user().tariff || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">Aktiv bis:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-1/3" : ""}`}>
            {!loading() && (user().activeUntil || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">Letzter Login:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-2/3" : ""}`}>
            {!loading() && (user().lastLogin || "—")}
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white font-medium px-5 py-2 rounded-2xl shadow-md hover:shadow-lg transition"
        >
          Profil bearbeiten
        </button>

        <span
          class={`text-sm font-semibold px-4 py-1.5 rounded-2xl ${
            loading()
              ? "bg-gray-200 text-transparent"
              : "bg-red-200 text-red-800"
          }`}
        >
          {!loading() && "Abgemeldet"}
        </span>
      </div>
    </div>
  );
}
