import { createResource } from "solid-js";
import { t } from "~/utils/i18n";

export default function ImprintCard(props) {
  // 🌍 Sprache aus Middleware oder Fallback (SSR-sicher)
  const lang =
    props.lang ||
    (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

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
        {t(lang, "title", "imprint")}
      </h2>

      {/* 🟧 Bearbeiten-Button oben rechts */}
      <div class="absolute top-4 right-8">
        <button
          data-signal="open-imprint-modal"
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t(lang, "editButton", "imprint")}
        </button>
      </div>

      {/* 🧩 Grid-Struktur */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <span class="font-medium text-gray-800">{t(lang, "company", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang, "contact", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().contact)}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t(lang, "street", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().street)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang, "number", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().number)}</p>
        </div>

        <div>
          <span class="font-medium text-gray-800">{t(lang, "zip", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang, "city", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().city)}</p>
        </div>
      </div>

      {/* Reihe 4 – 3-spaltig */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mt-4">
        <div>
          <span class="font-medium text-gray-800">{t(lang, "phone", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang, "email", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang, "vat", "imprint")}:</span>
          <p class="text-gray-500">{displayValue(data().vat)}</p>
        </div>
      </div>
    </div>
  );
}
