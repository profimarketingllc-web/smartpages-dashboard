import { createResource } from "solid-js";

export default function ImprintCard() {
  // 🌍 Sprache erkennen (wie in CustomerCard)
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

  // 📡 Daten abrufen
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

  // 💠 Platzhalter-Element
  const Skeleton = (props) => (
    <span
      class={`block h-3 w-${props.w || "24"} bg-gray-300/70 rounded-md`}
    ></span>
  );

  // 💎 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-8 md:px-10 py-6 md:py-8">
      {/* 🟠 Button oben rechts */}
      <div class="absolute top-5 right-10 md:right-14">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t.button}
        </button>
      </div>

      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-6 text-center md:text-left">
        {t.title}
      </h2>

      {/* 📋 Grid-Struktur */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10 text-sm text-gray-700">

        {/* 1️⃣ Firma & Ansprechpartner */}
        <div>
          <span class="font-medium text-gray-800">{t.company}:</span>
          <p>{data().company ?? <Skeleton w="36" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.contact}:</span>
          <p>{data().contact ?? <Skeleton w="36" />}</p>
        </div>

        {/* 2️⃣ Straße & Hausnummer */}
        <div>
          <span class="font-medium text-gray-800">{t.street}:</span>
          <p>{data().street ?? <Skeleton w="36" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.houseNumber}:</span>
          <p>{data().houseNumber ?? <Skeleton w="12" />}</p>
        </div>

        {/* 3️⃣ PLZ & Ort */}
        <div>
          <span class="font-medium text-gray-800">{t.zip}:</span>
          <p>{data().zip ?? <Skeleton w="12" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.city}:</span>
          <p>{data().city ?? <Skeleton w="24" />}</p>
        </div>

        {/* 4️⃣ Telefon, E-Mail, USt-ID */}
        <div>
          <span class="font-medium text-gray-800">{t.phone}:</span>
          <p>{data().phone ?? <Skeleton w="24" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.email}:</span>
          <p>{data().email ?? <Skeleton w="36" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.vat}:</span>
          <p>{data().vat ?? <Skeleton w="16" />}</p>
        </div>
      </div>
    </div>
  );
}
