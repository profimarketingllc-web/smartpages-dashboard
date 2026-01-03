import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprachlogik – erkennt Sprache aus URL
  const lang =
    typeof window !== "undefined" && window.location.pathname.includes("/en/")
      ? "en"
      : "de";

  // 🗂️ Übersetzungen
  const t = {
    de: {
      title: "Impressumsdaten",
      company: "Firma",
      contact: "Ansprechpartner",
      address: "Adresse",
      zipCity: "PLZ / Ort",
      country: "Land",
      email: "E-Mail",
      phone: "Telefon",
      vat: "USt-ID",
      edit: "Impressum bearbeiten",
    },
    en: {
      title: "Imprint Information",
      company: "Company",
      contact: "Contact Person",
      address: "Address",
      zipCity: "ZIP / City",
      country: "Country",
      email: "Email",
      phone: "Phone",
      vat: "VAT-ID",
      edit: "Edit Imprint",
    },
  }[lang];

  // 🧩 Datenabruf für Impressum
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      return await res.json();
    } catch {
      // ✅ Fallback mit Platzhaltern
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
    <div class="w-full flex flex-col">
      {/* Titelzeile */}
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-800">{t.title}</h2>
      </div>

      {/* GRID: 3 Spalten für Premium-Design */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-700">
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p class="text-gray-500">{imprint()?.company ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p class="text-gray-500">{imprint()?.contact ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.address}:</span>
          <p class="text-gray-500">{imprint()?.address ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.zipCity}:</span>
          <p class="text-gray-500">
            {imprint()?.zip ?? "—"} {imprint()?.city ?? ""}
          </p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.country}:</span>
          <p class="text-gray-500">{imprint()?.country ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.email}:</span>
          <p class="text-gray-500">{imprint()?.email ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.phone}:</span>
          <p class="text-gray-500">{imprint()?.phone ?? "—"}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.vat}:</span>
          <p class="text-gray-500">{imprint()?.vat ?? "—"}</p>
        </div>
      </div>

      {/* Button unten rechts */}
      <div class="mt-6 flex justify-end">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          {t.edit}
        </button>
      </div>
    </div>
  );
}
