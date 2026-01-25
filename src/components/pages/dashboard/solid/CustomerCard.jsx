import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧠 CustomerCard (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Dashboard-spezifische i18n (page = "dashboard")
 * ✅ Einheitliches API-Verhalten (/api/customer/customer)
 * ✅ Sauberer Fetch-Flow mit Session-Cookie
 * ✅ Kompatibel mit Cloudflare + SSR
 */

export default function CustomerCard(props) {
  // 🌍 Sprache erkennen
  const [lang, setLang] = createSignal(
    props.lang || useLang(typeof window !== "undefined" ? "de" : "de")
  );

  // 🧭 Sprache beim Mounten prüfen
  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Kundendaten abrufen
  const fetchCustomer = async () => {
    try {
      const res = await fetch("/api/customer/customer", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("⚠️ Nicht eingeloggt oder Session abgelaufen");
          return {
            status: t(lang(), "dashboard", "system", "loggedOut"),
          };
        }
        throw new Error(`API-Fehler ${res.status}`);
      }

      const result = await res.json();
      const u = result.data || result.user || null;

      if (!result.ok || !u) {
        return {
          status: t(lang(), "dashboard", "system", "loggedOut"),
        };
      }

      return {
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        company: u.company_name || "",
        is_business: u.is_business || 0,
        plan: u.plan || "—",
        status:
          u.status === "active"
            ? t(lang(), "dashboard", "system", "statusActive")
            : t(lang(), "dashboard", "system", "loggedOut"),
        activeUntil: u.trial_end || "—",
        lastLogin: u.last_login || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Kundendaten:", err);
      return {
        status: t(lang(), "dashboard", "system", "loggedOut"),
      };
    }
  };

  // 🗂️ Resource + automatisches Refetching
  const [customer, { refetch }] = createResource(fetchCustomer);

  onMount(() => {
    if (typeof window === "undefined") return;
    const handler = () => {
      console.log("🔁 CustomerCard: Daten werden aktualisiert …");
      refetch();
    };
    window.addEventListener("refresh-customer-data", handler);
    onCleanup(() =>
      window.removeEventListener("refresh-customer-data", handler)
    );
  });

  // 🧩 Helper
  const data = () => customer() || {};
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

  // 🧱 UI Rendering
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 transition-all duration-300">
      {/* 🟢 Statusanzeige */}
      <div class="absolute top-4 right-10 md:right-14">
        <span
          class={`inline-block px-4 py-1 text-sm font-medium rounded-full border transition-all duration-200
            ${
              data().status ===
              t(lang(), "dashboard", "system", "statusActive")
                ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                : "bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
            }`}
        >
          {data().status ?? "—"}
        </span>
      </div>

      {/* 🔹 Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-2 text-center md:text-left">
        {t(lang(), "dashboard", "customer", "title")}
      </h2>

      {/* 👤 Name / Firma */}
      {displayHeader()}

      {/* 📋 Details */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 mt-5">
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "dashboard", "customer", "status")}:
          </span>
          <p class="text-gray-600">{displayValue(data().status)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "dashboard", "customer", "plan")}:
          </span>
          <p class="text-gray-600">{displayValue(data().plan)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "dashboard", "customer", "activeUntil")}:
          </span>
          <p class="text-gray-600">{displayValue(data().activeUntil)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">
            {t(lang(), "dashboard", "customer", "lastLogin")}:
          </span>
          <p class="text-gray-600">{displayValue(data().lastLogin)}</p>
        </div>
      </div>

      {/* 🟠 Bearbeiten-Button */}
      <div class="flex justify-end items-center mt-6">
        <button
          aria-label={t(lang(), "dashboard", "customer", "button")}
          onClick={() =>
            window.dispatchEvent(new Event("open-customer-modal"))
          }
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-transform duration-200"
        >
          {t(lang(), "dashboard", "customer", "button")}
        </button>
      </div>
    </div>
  );
}
