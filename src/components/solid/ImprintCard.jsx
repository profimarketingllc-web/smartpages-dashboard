import { createSignal, onMount } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprache automatisch erkennen
  const lang =
    typeof window !== "undefined"
      ? window.location.pathname.startsWith("/en")
        ? "en"
        : "de"
      : "de";

  // 🌐 Übersetzungen
  const t = {
    de: {
      title: "Impressum",
      company: "Firma",
      address: "Adresse",
      contact: "Kontakt",
      website: "Webseite",
      edit: "Impressum bearbeiten",
    },
    en: {
      title: "Imprint",
      company: "Company",
      address: "Address",
      contact: "Contact",
      website: "Website",
      edit: "Edit Imprint",
    },
  }[lang];

  const [imprint, setImprint] = createSignal({
    company: "SmartPages GmbH",
    address: "Musterstraße 12, 12345 Berlin",
    contact: "info@smartpages.online",
    website: "https://smartpages.online",
  });

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t.title}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p class="text-gray-600">{imprint().company}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.address}:</span>
          <p class="text-gray-600">{imprint().address}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p class="text-gray-600">{imprint().contact}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t.website}:</span>
          <p class="text-gray-600">
            <a
              href={imprint().website}
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline"
            >
              {imprint().website}
            </a>
          </p>
        </div>

        {/* 🟧 Bearbeiten-Button (signalbasiert) */}
        <div class="flex justify-end items-center sm:justify-end col-span-2">
          <button
            data-signal="open-imprint-modal"
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t.edit}
          </button>
        </div>
      </div>
    </div>
  );
}
