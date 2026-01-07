import { createResource, createSignal, onMount } from "solid-js";
import { t } from "~/utils/i18n";

export default function CustomerCard(props) {
  // 🌍 Sprache bestimmen (Middleware → Prop → URL-Fallback)
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Kundendaten abrufen
  const fetchCustomer = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/customer", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No customer data");
      return await res.json();
    } catch {
      // ⚠️ Fallback für nicht eingeloggte User
      return {
        firstName: null,
        lastName: null,
        plan: null,
        status: t(lang(), "loggedOut", "system"),
        activeUntil: null,
        lastLogin: null,
      };
    }
  };

  const [customer] = createResource(fetchCustomer);
  const data = () => customer() || {};
  const displayValue = (val) => (val ? val : "—");

  // 🧩 Kombinierter Name
  const fullName = () => {
    if (data().firstName || data().lastName) {
      return `${data().firstName ?? ""} ${data().lastName ?? ""}`.trim();
    }
    return "—";
  };

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Login-Status oben rechts */}
      <div class="absolute top-4 right-10 md:right-14">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border 
            ${
              data().status === t(lang(), "statusActive", "system")
                ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
            }`}
        >
          {data().status ?? "—"}
        </span>
      </div>

      {/* 🔹 Überschrift */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t(lang(), "title", "customer")}
      </h2>

      {/* 🔹 Felder */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "firstName", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().firstName)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "lastName", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().lastName)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "plan", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().plan)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "activeUntil", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().activeUntil)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "status", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().status)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "lastLogin", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().lastLogin)}</p>
        </div>

        {/* 🟧 Bearbeiten-Button */}
        <div class="flex justify-end items-center sm:justify-end">
          <button
            data-signal="open-customer-modal"
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "editButton", "customer")}
          </button>
        </div>
      </div>
    </div>
  );
}
