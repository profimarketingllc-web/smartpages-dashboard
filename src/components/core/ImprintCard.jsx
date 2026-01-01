import { createSignal, onMount } from "solid-js";

export default function ImprintCard() {
  const [imprint, setImprint] = createSignal({
    company: "",
    contact: "",
    street: "",
    city: "",
    email: "",
    vat: "",
  });

  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    // Simulierter Ladezustand
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  });

  return (
    <div class="bg-[#f9fafb] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300">
      <h2 class="text-lg md:text-xl font-extrabold text-[#1E2A45] mb-4">
        Impressumsangaben
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-[#1E2A45]">
        <div>
          <span class="font-medium">Unternehmen:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-3/4" : ""}`}>
            {!loading() && (imprint().company || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">Ansprechpartner:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-3/4" : ""}`}>
            {!loading() && (imprint().contact || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">Straße & Nr.:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-2/3" : ""}`}>
            {!loading() && (imprint().street || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">PLZ / Ort:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-1/2" : ""}`}>
            {!loading() && (imprint().city || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">E-Mail:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-2/3" : ""}`}>
            {!loading() && (imprint().email || "—")}
          </div>
        </div>

        <div>
          <span class="font-medium">USt-ID:</span>
          <div class={`mt-1 rounded-lg ${loading() ? "bg-gray-200 h-5 w-1/4" : ""}`}>
            {!loading() && (imprint().vat || "—")}
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white font-medium px-5 py-2 rounded-2xl shadow-md hover:shadow-lg transition"
        >
          Impressum bearbeiten
        </button>
      </div>
    </div>
  );
}
