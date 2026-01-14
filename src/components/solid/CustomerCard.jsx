import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t } from "~/utils/i18n";

export default function CustomerCard(props) {
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  const fetchCustomer = async () => {
    try {
      const res = await fetch("/api/customer/customer", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Nicht eingeloggt oder Session abgelaufen");
          return { status: t(lang(), "loggedOut", "system") };
        }
        throw new Error(`API-Fehler ${res.status}`);
      }

      const result = await res.json();

      // 🔧 FIX: Worker liefert { ok: true, data: {...} } statt { user: {...} }
      const u = result.data || result.user || null;
      if (!result.ok || !u) {
        return { status: t(lang(), "loggedOut", "system") };
      }

      return {
        firstName: u.first_name || "—",
        lastName: u.last_name || "—",
        plan: u.plan || "—",
        status:
          u.status === "active"
            ? t(lang(), "statusActive", "system")
            : t(lang(), "loggedOut", "system"),
        activeUntil: u.trial_end || "—",
        lastLogin: u.last_login || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Kundendaten:", err);
      return { status: t(lang(), "loggedOut", "system") };
    }
  };

  const [customer, { refetch }] = createResource(fetchCustomer);

  onMount(() => {
    const handler = () => {
      console.log("🔄 CustomerCard: Daten werden aktualisiert...");
      refetch();
    };
    window.addEventListener("refresh-customer-data", handler);
    onCleanup(() => window.removeEventListener("refresh-customer-data", handler));
  });

  const data = () => customer() || {};
  const displayValue = (val) => (val ? val : "—");

  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
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

      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        {t(lang(), "title", "customer")}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8">
        <div><span class="font-medium text-gray-800">{t(lang(), "firstName", "customer")}:</span><p class="text-gray-600">{displayValue(data().firstName)}</p></div>
        <div><span class="font-medium text-gray-800">{t(lang(), "lastName", "customer")}:</span><p class="text-gray-600">{displayValue(data().lastName)}</p></div>
        <div><span class="font-medium text-gray-800">{t(lang(), "status", "customer")}:</span><p class="text-gray-600">{displayValue(data().status)}</p></div>
        <div><span class="font-medium text-gray-800">{t(lang(), "plan", "customer")}:</span><p class="text-gray-600">{displayValue(data().plan)}</p></div>
        <div><span class="font-medium text-gray-800">{t(lang(), "activeUntil", "customer")}:</span><p class="text-gray-600">{displayValue(data().activeUntil)}</p></div>
        <div><span class="font-medium text-gray-800">{t(lang(), "lastLogin", "customer")}:</span><p class="text-gray-600">{displayValue(data().lastLogin)}</p></div>
      </div>

      <div class="flex justify-end items-center mt-6">
        <button
          data-signal="open-customer-modal"
          onClick={() => window.dispatchEvent(new Event("open-customer-modal"))}
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
        >
          {t(lang(), "button", "customer")}
        </button>
      </div>
    </div>
  );
}
