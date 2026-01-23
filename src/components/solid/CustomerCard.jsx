import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function CustomerCard(props) {
  const [lang, setLang] = createSignal(props.lang || "de");
  const [sessionReady, setSessionReady] = createSignal(false);

  onMount(() => {
    setLang(window.location.pathname.includes("/en/") ? "en" : "de");

    // ⏳ Session prüfen und Event abfeuern
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session/userinfo", { credentials: "include" });
        const data = await res.json();
        if (data.ok && data.user) {
          window.__SESSION_INFO__ = data.user;
          window.dispatchEvent(new CustomEvent("session-info-ready", { detail: data.user }));
          setSessionReady(true);
        }
      } catch (err) {
        console.warn("⚠️ Session-Check fehlgeschlagen:", err);
      }
    };

    checkSession();
  });

  // 🔗 Kundendaten abrufen
  const fetchCustomer = async () => {
    try {
      const res = await fetch("/api/customer", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        if (res.status === 401) return { status: t(lang(), "loggedOut", "system") };
        throw new Error(`API-Fehler ${res.status}`);
      }

      const result = await res.json();
      const u = result.data || result.user || null;

      if (!result.ok || !u) return { status: t(lang(), "loggedOut", "system") };

      return {
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        company: u.company_name || "",
        is_business: u.is_business || 0,
        plan: u.plan || "—",
        status: u.status === "active"
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

  const [customer, { refetch }] = createResource(sessionReady, fetchCustomer);

  onMount(() => {
    if (typeof window === "undefined") return;

    // Re-Fetch bei Session-Refresh
    const handler = () => {
      console.log("🔁 CustomerCard: Daten werden aktualisiert …");
      refetch();
    };
    window.addEventListener("refresh-customer-data", handler);
    onCleanup(() => window.removeEventListener("refresh-customer-data", handler));

    // Laden, wenn Session bereit
    window.addEventListener("session-info-ready", () => {
      setSessionReady(true);
      refetch();
    });
  });

  const data = () => customer() || {};
  const displayValue = (val) => (val && val !== "" ? val : "—");

  const displayHeader = () => {
    const first = data().firstName || "";
    const last = data().lastName || "";
    const fullName = last ? `${first} ${last}` : first;

    if (data().is_business && data().company) {
      return (
        <div class="mt-2">
          <p class="text-lg font-semibold text-[#1E2A45] leading-tight">{data().company}</p>
          <p class="text-gray-500 text-sm">{fullName}</p>
        </div>
      );
    } else {
      return (
        <div class="mt-2">
          <p class="text-lg font-semibold text-[#1E2A45] leading-tight">{fullName || "—"}</p>
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
          <span class="font-medium text-gray-800">{t(lang(), "status", "customer")}:</span>
          <p class="text-gray-600">{displayValue(data().status)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang(), "plan", "customer")}:</span>
          <p class="text-gray-600">{displayValue(data().plan)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang(), "activeUntil", "customer")}:</span>
          <p class="text-gray-600">{displayValue(data().activeUntil)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">{t(lang(), "lastLogin", "customer")}:</span>
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
