import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprachlogik
  const lang =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? "en"
      : "de";

  const t = {
    de: {
      title: "Impressum",
      company: "Firma",
      address: "Adresse",
      contact: "Kontakt",
      website: "Webseite",
      button: "Impressum bearbeiten",
      placeholderCompany: "– keine Angaben –",
      placeholderAddress: "– keine Adresse –",
      placeholderContact: "– keine Kontaktdaten –",
      placeholderWebsite: "– keine Website –",
    },
    en: {
      title: "Imprint",
      company: "Company",
      address: "Address",
      contact: "Contact",
      website: "Website",
      button: "Edit Imprint",
      placeholderCompany: "– no information –",
      placeholderAddress: "– no address –",
      placeholderContact: "– no contact info –",
      placeholderWebsite: "– no website –",
    },
  }[lang];

  // 🛰️ Daten abrufen (mit Platzhaltern, wenn API leer)
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data || !data.company) throw new Error("No imprint data");
      return data;
    } catch {
      return {
        company: t.placeholderCompany,
        address: t.placeholderAddress,
        contact: t.placeholderContact,
        website: t.placeholderWebsite,
      };
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-6 md:py-7">
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t.title}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p class="text-gray-600">{data().company}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.address}:</span>
          <p class="text-gray-600">{data().address}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p class="text-gray-600">{data().contact}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.website}:</span>
          <p class="text-gray-600 break-all">{data().website}</p>
        </div>

        {/* 🟧 Bearbeiten-Button */}
        <div class="sm:col-span-2 flex justify-end mt-4">
          <button
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
            data-signal="open-imprint-modal"
          >
            {t.button}
          </button>
        </div>
      </div>
    </div>
  );
}
