import { createResource } from "solid-js";

export default function CustomerCard() {
  // Sprache aus URL erkennen (Server + Client)
  const lang =
    typeof window !== "undefined"
      ? window.location.pathname.startsWith("/en")
        ? "en"
        : "de"
      : "de";

  // Übersetzungen für statische Felder
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

  // Kundendaten abrufen
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

  const Skeleton = (props) => (
    <span
      class={`block h-3 w-${props.w || "20"} bg-gray-300/70 rounded-md`}
    ></span>
  );

  return (
    <div class="relative p-4 md:p-5 text-sm text-gray-700 flex flex-col items-center text-center">
      {/* 🔹 Login-Pill */}
      <div class="absolute top-2 right-8">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border 
                  ${
                    data().status === t.active
                      ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                      : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
                  }`}
        >
          {data().status}
        </span>
      </div>

      {/* 🔹 Überschrift */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5">
        {t.title}
      </h2>

      {/* 🔹 Erste Zeile */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 justify-center">
        <div class="md:col-span-2">
          <span class="font-medium text-gray-800">{t.name}:</span>
          <p>{data().name ?? <Skeleton w="36" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.plan}:</span>
          <p>{data().plan ?? <Skeleton w="24" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.activeUntil}:</span>
          <p class="text-gray-600 text-sm">
            {data().activeUntil ?? <Skeleton w="20" />}
          </p>
        </div>
      </div>

      {/* 🔹 Zweite Zeile */}
      <div class="grid grid-cols-3 mt-6 items-center justify-center">
        <div>
          <span class="font-medium text-gray-800">{t.status}:</span>
          <p>{data().status ?? <Skeleton w="16" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.lastLogin}:</span>
          <p class="text-gray-600 text-sm">
            {data().lastLogin ?? <Skeleton w="16" />}
          </p>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t.button}
          </button>
        </div>
      </div>
    </div>
  );
}
