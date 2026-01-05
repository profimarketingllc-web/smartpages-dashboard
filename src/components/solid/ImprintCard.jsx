import { createResource } from "solid-js";

export default function ImprintCard() {
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      return await res.json();
    } catch {
      return {
        company: "—",
        contact: "—",
        address: "—",
        zip: "—",
        city: "—",
        email: "—",
        phone: "—",
        vat: "—",
      };
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const displayValue = (val) => (val ? val : "—");

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        Impressumsdaten
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        <div>
          <span class="font-medium text-gray-800">Firma:</span>
          <p class="text-gray-500">{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ansprechpartner:</span>
          <p class="text-gray-500">{displayValue(data().contact)}</p>
        </div>
        <div class="flex justify-end lg:justify-start items-start">
          <button class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200">
            Impressum bearbeiten
          </button>
        </div>

        <div>
          <span class="font-medium text-gray-800">Straße:</span>
          <p class="text-gray-500">{displayValue(data().address)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Hausnummer:</span>
          <p class="text-gray-500">—</p>
        </div>

        <div></div>

        <div>
          <span class="font-medium text-gray-800">PLZ:</span>
          <p class="text-gray-500">{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ort:</span>
          <p class="text-gray-500">{displayValue(data().city)}</p>
        </div>

        <div></div>

        <div>
          <span class="font-medium text-gray-800">Telefon:</span>
          <p class="text-gray-500">{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">E-Mail:</span>
          <p class="text-gray-500">{displayValue(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">USt-ID:</span>
          <p class="text-gray-500">{displayValue(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
