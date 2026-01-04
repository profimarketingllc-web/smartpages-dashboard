import { createResource } from "solid-js";

export default function ImprintCard() {
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        company: "—",
        contact: "—",
        street: "—",
        housenumber: "—",
        zip: "—",
        city: "—",
        phone: "—",
        email: "—",
        vat: "—",
      };
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const displayValue = (val) => (val ? val : "—");

  return (
    <div class="relative w-full text-sm text-gray-700 px-8 md:px-10 py-5 md:py-6">
      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-6">
        Impressumsdaten
      </h2>

      {/* 🔹 Button oben rechts */}
      <div class="absolute top-5 right-8">
        <button class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200">
          Impressum bearbeiten
        </button>
      </div>

      {/* 🔹 Grid-Struktur */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-left">
        {/* Reihe 1 */}
        <div>
          <span class="font-medium text-gray-800">Firma:</span>
          <p>{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ansprechpartner:</span>
          <p>{displayValue(data().contact)}</p>
        </div>

        {/* Reihe 2 */}
        <div>
          <span class="font-medium text-gray-800">Straße:</span>
          <p>{displayValue(data().street)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Hausnummer:</span>
          <p>{displayValue(data().housenumber)}</p>
        </div>

        {/* Reihe 3 */}
        <div>
          <span class="font-medium text-gray-800">PLZ:</span>
          <p>{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ort:</span>
          <p>{displayValue(data().city)}</p>
        </div>

        {/* Reihe 4 */}
        <div>
          <span class="font-medium text-gray-800">Telefon:</span>
          <p>{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">E-Mail:</span>
          <p>{displayValue(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">USt-ID:</span>
          <p>{displayValue(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
