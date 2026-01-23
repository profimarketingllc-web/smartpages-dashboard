import { createSignal, onMount, onCleanup } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function CustomerCard(props) {
  const [lang, setLang] = createSignal(props.lang || "de");
  const [customer, setCustomer] = createSignal({
    firstName: "",
    lastName: "",
    company: "",
    plan: "—",
    status: t(lang(), "loggedOut", "system"),
    activeUntil: "—",
    lastLogin: "—",
    is_business: 0,
  });

  // 🧭 Basis-URL für alle Requests
  const API_BASE = "https://api.smartpages.online";

  onMount(() => {
    setLang(window.location.pathname.includes("/en/") ? "en" : "de");
  });

  const loadCustomer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/customer`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        console.warn("❌ Customer API Fehler:", res.status);
        return;
      }

      const result = await res.json();
      const u = result.data || result.user || null;

      if (!result.ok || !u) {
        console.warn("⚠️ Keine gültigen Kundendaten empfangen:", result);
        return;
      }

      setCustomer({
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        company: u.company_name || "",
        is_business: u.is_business || 0,
        plan: u.plan || "—",
        status:
          u.status === "active"
            ? t(lang(), "statusActive", "system")
            : t(lang(), "loggedOut", "system"),
        activeUntil: u.trial_end || "—",
        lastLogin: u.last_login || "—",
      });

      console.log("✅ Kundendaten geladen:", u);
    } catch (err) {
      console.error("❌ Fehler beim Laden der Kundendaten:", err);
    }
  };

  onMount(() => {
    const checkAndLoad = async () => {
      for (let i = 0; i < 5; i++) {
        try {
          const sessionRes = await fetch(`${API_BASE}/api/session/userinfo`, {
            credentials: "include",
          });
          const sessionData = await sessionRes.json();
          if (sessionData.ok && sessionData.user) {
            console.log("🟢 Session aktiv, lade Kundendaten...");
            await loadCustomer();
            return;
          }
        } catch (e) {
          console.warn("⏳ Session noch nicht aktiv, neuer Versuch...");
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      console.error("❌ Session konnte nicht bestätigt werden.");
    };

    checkAndLoad();

    const refreshHandler = () => {
      console.log("🔁 CustomerCard: Daten werden aktualisiert …");
      loadCustomer();
    };
    window.addEventListener("refresh-customer-data", refreshHandler);
    onCleanup(() =>
      window.removeEventListener("refresh-customer-data", refreshHandler)
    );
  });

  const data = () => customer();
  const displayValue = (val) => (val && val !== "" ? val : "—");

  const displayHeader = () => {
    const first = data().firstName || "";
    const last = data().lastName || "";
    const fullName = last ? `${first} ${last}` : first;

    if (data().is_business && data().company) {
      return (
        <div class="mt-2">
          <p class="text-lg font-semibold text-[#1E2A45] leading-tight">
            {data().company}
          </p>
          <p class="text-gray-500 text-sm">{fullName}</p>
        </div>
      );
    } else {
      return (
        <div class="mt-2">
          <p class="text-lg font-semibold text-[#1E2A45] leading-tight">
            {fullName || "—"}
          </p>
        </div>
      );
    }
  };

  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 transition-all duration-300">
      <div class="absolute top-4 right-10 md:right-14">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border transition-all duration-200
            ${
              data().status === t(lang(), "statusActive", "system")
                ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
            }`}
        >
          {data().status ?? "—"}
        </span>
      </div>

      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-2 text-center md:text-left">
        {t(lang(), "title", "customer")}
      </h2>

      {displayHeader()}

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 mt-5">
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "status", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().status)}</p>
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
            {t(lang(), "lastLogin", "customer")}:
          </span>
          <p class="text-gray-600">{displayValue(data().lastLogin)}</p>
        </div>
      </div>

      <div class="flex justify-end items-center mt-6">
        <button
          aria-label={t(lang(), "button", "customer")}
          onClick={() => window.dispatchEvent(new Event("open-customer-modal"))}
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          {t(lang(), "button", "customer")}
        </button>
      </div>
    </div>
  );
}
