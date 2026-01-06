import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprache automatisch über URL erkennen
  const lang =
    typeof window !== "undefined"
      ? window.location.pathname.includes("/en/") ? "en" : "de"
      : "de";

  // 🌐 Übersetzungen
  const t = {
    de: {
      title: "Impressumsdaten",
      company: "Firma",
      contact: "Ansprechpartner",
      street: "Straße",
      number: "Hausnummer",
      zip: "PLZ",
      city: "Ort",
      phone: "Telefon",
      email: "E-Mail",
      vat: "USt-ID",
      button: "Impressum bearbeiten",
    },
    en: {
      title: "Imprint Information",
      company: "Company",
      contact: "Contact Person",
      street: "Street",
      number: "Number",
      zip: "ZIP",
      city: "City",
      phone: "Phone",
      email: "Email",
      vat: "VAT-ID",
      button: "Edit Imprint",
    },
  }[lang];

  // 🔗 Imprint-Daten abrufen
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
        street: "—",
        number: "—",
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

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t.title}
      </h2>

      {/* 🟧 Bearbeiten-Button oben rechts */}
      <div class="absolute top-4 right-8">
        <button
          data-signal="open-imprint-modal"
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t.button}
        </button>
      </div>

      {/* 🧩 Grid-Struktur */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-3">
        {/* Reihe 1 */}
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p class="text-gray-500">{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p class="text-gray-500">{displayValue(data().contact)}</p>
        </div>

        {/* Reihe 2 */}
        <div>
          <span class="font-medium text-gray-800">{t.street}:</span>
          <p class="text-gray-500">{displayValue(data().street)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.number}:</span>
          <p class="text-gray-500">{displayValue(data().number)}</p>
        </div>

        {/* Reihe 3 */}
        <div>
          <span class="font-medium text-gray-800">{t.zip}:</span>
          <p class="text-gray-500">{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.city}:</span>
          <p class="text-gray-500">{displayValue(data().city)}</p>
        </div>
      </div>

      {/* Reihe 4 – 3-spaltig */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mt-4">
        <div>
          <span class="font-medium text-gray-800">{t.phone}:</span>
          <p class="text-gray-500">{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.email}:</span>
          <p class="text-gray-500">{displayValue(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.vat}:</span>
          <p class="text-gray-500">{displayValue(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
