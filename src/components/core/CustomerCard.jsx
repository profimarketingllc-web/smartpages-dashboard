import { createResource } from "solid-js";

export default function CustomerCard() {
  // Kundendaten abrufen
  const fetchCustomer = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/customer", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No customer data");
      return await res.json();
    } catch {
      // ✅ Fallback: nur Platzhalter
      return {
        name: null,
        plan: null,
        status: "Abgemeldet",
        activeUntil: null,
        lastLogin: null,
      };
    }
  };

  const [customer] = createResource(fetchCustomer);

  // 🩶 Skeleton Helper – zeigt grauen Balken, wenn Wert fehlt
  const Skeleton = (props) => (
    <span
      class={`block h-3 w-${props.w || "20"} bg-gray-300/70 rounded-md`}
    ></span>
  );

  const data = () => customer() || {};

  return (
    <div class="relative p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
      {/* 🔹 Login-Pill */}
      <div class="absolute top-4 right-4">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border 
                  ${
                    data().status === "Aktiv"
                      ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                      : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
                  }`}
        >
          {data().status}
        </span>
      </div>

      {/* 🔹 Titel */}
      <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4">
        Kundendaten
      </h2>

      {/* 🔹 Erste Zeile */}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-sm text-gray-700">
        <div>
          <span class="font-medium text-gray-800">Name:</span>
          <p>{data().name ?? <Skeleton w="24" />}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Tarif:</span>
          <p>{data().plan ?? <Skeleton w="20" />}</p>
        </div>
        <div class="col-span-2 md:col-span-2">
          <span class="font-medium text-gray-800">Aktiviert bis:</span>
          <p>{data().activeUntil ?? <Skeleton w="28" />}</p>
        </div>
      </div>

      {/* 🔹 Zweite Zeile */}
      <div class="grid grid-cols-2 mt-4 text-sm text-gray-700">
        <div>
          <span class="font-medium text-gray-800">Status:</span>
          <p>{data().status ?? <Skeleton w="16" />}</p>
        </div>
        <div class="text-right">
          <span class="font-medium text-gray-800">Letzter Login:</span>
          <p>{data().lastLogin ?? <Skeleton w="24" />}</p>
        </div>
      </div>

      {/* 🔹 Button */}
      <div class="mt-6 flex justify-end">
        <button
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          Profil bearbeiten
        </button>
      </div>
    </div>
  );
}
