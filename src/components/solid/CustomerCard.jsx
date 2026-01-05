import { createResource } from "solid-js";

export default function CustomerCard() {
  // 🌍 Sprache automatisch über URL erkennen
  const lang =
    typeof window !== "undefined"
      ? window.location.pathname.includes("/en/")
        ? "en"
        : "de"
      : "de";

  // 🌐 Übersetzungen
  const t = {
    de: {
      title: "Kundendaten",
      name: "Name",
      plan: "Tarif",
      activeUntil: "aktiviert bis",
      status: "Status",
      lastLogin: "letzter Login",
      button: "Profil bearbeiten",
      loggedOut: "Abgemeldet",
      active: "Aktiv",
    },
    en: {
      title: "Customer Data",
      name: "Name",
      plan: "Plan",
      activeUntil: "active until",
      status: "Status",
      lastLogin: "last login",
      button: "Edit Profile",
      loggedOut: "Logged out",
      active: "Active",
    },
  }[lang];

  // 🔗 Kundendaten abrufen
  const fetchCustomer = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/customer", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No customer data");
      return await res.json();
    } catch {
      return {
        name: null,
        plan: null,
        status: t.loggedOut,
        activeUntil: null,
        lastLogin: null,
      };
    }
  };

  const [customer] = createResource(fetchCustomer);
  const data = () => customer() || {};
  const displayValue = (val) => (val ? val : "—");

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Login-Status oben rechts */}
      <div class="absolute top-4 right-10 md:right-14">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border 
            ${
              data().status === t.active
                ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
            }`}
        >
          {data().status ?? "—"}
        </span>
      </div>

      {/* 🔹 Überschrift */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t.title}
      </h2>

      {/* 🔹 Felder */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
        <div>
          <span class="font-medium text-gray-800">{t.name}:</span>
          <p class="text-gray-600">{displayValue(data().name)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.plan}:</span>
          <p class="text-gray-600">{displayValue(data().plan)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.activeUntil}:</span>
          <p class="text-gray-600">{displayValue(data().activeUntil)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.status}:</span>
          <p class="text-gray-600">{displayValue(data().status)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.lastLogin}:</span>
          <p class="text-gray-600">{displayValue(data().lastLogin)}</p>
        </div>

        {/* 🟧 Bearbeiten-Button */}
        <div class="flex justify-end items-center sm:justify-end">
          <button
            data-signal="open-customer-modal"
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t.button}
          </button>
        </div>
      </div>
    </div>
  );
}
