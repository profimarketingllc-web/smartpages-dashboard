import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprache erkennen
  const lang =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? "en"
      : "de";

  // 🌐 Übersetzungen
  const t = {
    de: {
      title: "Impressum",
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
      empty: "—",
    },
    en: {
      title: "Imprint",
      company: "Company",
      contact: "Contact person",
      street: "Street",
      number: "Number",
      zip: "ZIP",
      city: "City",
      phone: "Phone",
      email: "Email",
      vat: "VAT ID",
      button: "Edit Imprint",
      empty: "—",
    },
  }[lang];

  // 🔗 Daten abrufen
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      return await res.json();
    } catch {
      return {}; // 🔹 Kein Fallback mit echten Werten – leer lassen
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const show = (v) => (v && v.trim() !== "" ? v : t.empty);

  // 🧱 Layout (wie dein Original)
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* Überschrift */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t.title}
      </h2>

      {/* Felder im Raster */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        {/* 1️⃣ Reihe */}
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p class="text-gray-500">{show(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p class="text-gray-500">{show(data().contact)}</p>
        </div>
        <div class="flex justify-end lg:justify-start items-start">
          <button
            data-signal="open-imprint-modal"
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t.button}
          </button>
        </div>

        {/* 2️⃣ Reihe */}
        <div>
          <span class="font-medium text-gray-800">{t.street}:</span>
          <p class="text-gray-500">{show(data().street)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.number}:</span>
          <p class="text-gray-500">{show(data().number)}</p>
        </div>
        <div></div>

        {/* 3️⃣ Reihe */}
        <div>
          <span class="font-medium text-gray-800">{t.zip}:</span>
          <p class="text-gray-500">{show(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.city}:</span>
          <p class="text-gray-500">{show(data().city)}</p>
        </div>
        <div></div>

        {/* 4️⃣ Reihe */}
        <div>
          <span class="font-medium text-gray-800">{t.phone}:</span>
          <p class="text-gray-500">{show(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.email}:</span>
          <p class="text-gray-500">{show(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.vat}:</span>
          <p class="text-gray-500">{show(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
