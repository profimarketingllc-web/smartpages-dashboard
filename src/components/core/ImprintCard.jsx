import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprache erkennen
  const lang =
    typeof window !== "undefined"
      ? window.location.pathname.startsWith("/en")
        ? "en"
        : "de"
      : "de";

  // 🗣️ Übersetzungen
  const t = {
    de: {
      title: "Impressumsdaten",
      company: "Firma",
      contact: "Ansprechpartner",
      street: "Straße",
      houseNumber: "Hausnummer",
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
      houseNumber: "No.",
      zip: "ZIP",
      city: "City",
      phone: "Phone",
      email: "Email",
      vat: "VAT-ID",
      button: "Edit Imprint",
    },
  }[lang];

  // 📡 Datenabruf
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
        houseNumber: "—",
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

  // ✨ Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-8 md:px-10 py-7 md:py-9">
      {/* 🔸 Button oben rechts – leicht nach unten versetzt */}
      <div class="absolute top-7 right-10 md:right-14">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t.button}
        </button>
      </div>

      {/* 🔹 Titel – minimal tiefer gesetzt */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-8 text-center md:text-left">
        {t.title}
      </h2>

      {/* 📋 Inhalt */}
      <div class="space-y-6">
        {/* 1️⃣ Firma & Ansprechpartner */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">{t.company}:</span>
            <p>{data().company || "—"}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t.contact}:</span>
            <p>{data().contact || "—"}</p>
          </div>
        </div>

        {/* 2️⃣ Straße & Hausnummer */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">{t.street}:</span>
            <p>{data().street || "—"}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t.houseNumber}:</span>
            <p>{data().houseNumber || "—"}</p>
          </div>
        </div>

        {/* 3️⃣ PLZ & Ort */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">{t.zip}:</span>
            <p>{data().zip || "—"}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t.city}:</span>
            <p>{data().city || "—"}</p>
          </div>
        </div>

        {/* 4️⃣ Telefon · E-Mail · USt-ID */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">{t.phone}:</span>
            <p>{data().phone || "—"}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t.email}:</span>
            <p>{data().email || "—"}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t.vat}:</span>
            <p>{data().vat || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
