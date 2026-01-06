import { createResource, createSignal, onMount } from "solid-js";

export default function ImprintCard(props) {
  // 🌍 Sprache bestimmen
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  // ✅ Fallback auf URL beim Mount (Client-seitig)
  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🌐 Übersetzungen
  const translations = {
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
  };

  const t = () => translations[lang()];

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
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-5 md:py-6 relative">
      {/* 🧭 Header mit Button */}
      <div class="flex justify-between items-start mb-6">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t().title}
        </h2>

        <button
          data-signal="open-imprint-modal"
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200 absolute right-8 top-6 md:static md:ml-auto"
        >
          {t().button}
        </button>
      </div>

      {/* 📋 Datenraster */}
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-3 text-sm text-smart-text leading-relaxed">
        {/* 1️⃣ Reihe */}
        <div>
          <span class="font-semibold">{t().company}:</span>
          <p class="text-gray-500">{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-semibold">{t().contact}:</span>
          <p class="text-gray-500">{displayValue(data().contact)}</p>
        </div>

        {/* 2️⃣ Reihe */}
        <div>
          <span class="font-semibold">{t().street}:</span>
          <p class="text-gray-500">{displayValue(data().street)}</p>
        </div>
        <div>
          <span class="font-semibold">{t().number}:</span>
          <p class="text-gray-500">{displayValue(data().number)}</p>
        </div>

        {/* 3️⃣ Reihe */}
        <div>
          <span class="font-semibold">{t().zip}:</span>
          <p class="text-gray-500">{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-semibold">{t().city}:</span>
          <p class="text-gray-500">{displayValue(data().city)}</p>
        </div>

        {/* 4️⃣ Reihe */}
        <div>
          <span class="font-semibold">{t().phone}:</span>
          <p class="text-gray-500">{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-semibold">{t().email}:</span>
          <p class="text-gray-500">{displayValue(data().email)}</p>
        </div>
        <div class="xl:col-span-3">
          <span class="font-semibold">{t().vat}:</span>
          <p class="text-gray-500">{displayValue(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
