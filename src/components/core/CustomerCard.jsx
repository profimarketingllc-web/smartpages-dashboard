import { createResource } from "solid-js";

export default function CustomerCard() {
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
    },
  }.de;

  const fetchCustomer = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/customer", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return {
        name: "—",
        plan: "—",
        activeUntil: "—",
        status: t.loggedOut,
        lastLogin: "—",
      };
    }
  };

  const [customer] = createResource(fetchCustomer);
  const data = () => customer() || {};
  const displayValue = (val) => (val ? val : "—");

  return (
    <div class="relative w-full text-sm text-gray-700 px-8 md:px-10 py-5 md:py-6">
      {/* 🔹 Status rechts oben */}
      <div class="absolute top-4 right-8">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border 
                  ${
                    data().status === "Aktiv"
                      ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                      : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
                  }`}
        >
          {data().status ?? "—"}
        </span>
      </div>

      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-6">
        {t.title}
      </h2>

      {/* 🔹 Felder */}
      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-8 text-left">
        <div>
          <span class="font-medium text-gray-800">{t.name}:</span>
          <p>{displayValue(data().name)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.plan}:</span>
          <p>{displayValue(data().plan)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.activeUntil}:</span>
          <p>{displayValue(data().activeUntil)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t.lastLogin}:</span>
          <p>{displayValue(data().lastLogin)}</p>
        </div>
      </div>

      {/* 🔹 Button */}
      <div class="mt-6 flex justify-end">
        <button class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200">
          {t.button}
        </button>
      </div>
    </div>
  );
}
