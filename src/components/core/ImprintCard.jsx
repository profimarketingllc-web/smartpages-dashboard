import { createResource } from "solid-js";

export default function ImprintCard() {
  // Impressumsdaten abrufen
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      return await res.json();
    } catch {
      // ✅ Fallback: Nur Platzhalter
      return {
        company: "—",
        contact: "—",
        address: "—",
        zip: "—",
        city: "—",
        country: "—",
        email: "—",
        phone: "—",
        vat: "—",
      };
    }
  };

  const [imprint] = createResource(fetchImprint);

  return (
    <div class="w-full">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Impressumsdaten</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
        <div>
          <span class="font-medium text-gray-800">Firma:</span>
          <p class="text-gray-500">{imprint()?.company ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ansprechpartner:</span>
          <p class="text-gray-500">{imprint()?.contact ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Adresse:</span>
          <p class="text-gray-500">{imprint()?.address ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">PLZ / Ort:</span>
          <p class="text-gray-500">
            {imprint()?.zip ?? "—"} {imprint()?.city ?? ""}
          </p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Land:</span>
          <p class="text-gray-500">{imprint()?.country ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">E-Mail:</span>
          <p class="text-gray-500">{imprint()?.email ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Telefon:</span>
          <p class="text-gray-500">{imprint()?.phone ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">USt-ID:</span>
          <p class="text-gray-500">{imprint()?.vat ?? "—"}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          Impressum bearbeiten
        </button>
      </div>
    </div>
  );
}
