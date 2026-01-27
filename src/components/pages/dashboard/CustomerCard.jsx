import { createResource, createSignal, onMount, onCleanup } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function CustomerCard(props) {
  /* -------------------------------- */
  /* 🌍 Sprache                        */
  /* -------------------------------- */
  const [lang, setLang] = createSignal(
    props.lang || useLang("de")
  );

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  /* -------------------------------- */
  /* 🔗 Kundendaten                    */
  /* -------------------------------- */
  const fetchCustomer = async () => {
    try {
      const res = await fetch("/api/customer/customer", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        return {
          status: t(lang(), "dashboard", "system", "loggedOut"),
        };
      }

      const result = await res.json();
      const u = result?.data || result?.user;

      if (!u) {
        return {
          status: t(lang(), "dashboard", "system", "loggedOut"),
        };
      }

      return {
        firstName: u.first_name || "",
        lastName: u.last_name || "",
        company: u.company_name || "",
        isBusiness: Boolean(u.is_business),
        plan: u.plan || "—",
        status:
          u.status === "active"
            ? t(lang(), "dashboard", "system", "statusActive")
            : t(lang(), "dashboard", "system", "loggedOut"),
        activeUntil: u.trial_end || "—",
        lastLogin: u.last_login || "—",
      };
    } catch {
      return {
        status: t(lang(), "dashboard", "system", "loggedOut"),
      };
    }
  };

  const [customer, { refetch }] = createResource(fetchCustomer);

  onMount(() => {
    const handler = () => refetch();
    window.addEventListener("refresh-customer-data", handler);
    onCleanup(() =>
      window.removeEventListener("refresh-customer-data", handler)
    );
  });

  const data = () => customer() || {};

  /* -------------------------------- */
  /* 🧱 JSX                            */
  /* -------------------------------- */
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">

      {/* Status */}
      <div class="absolute top-4 right-10 md:right-14">
        <span
          class={
            data().status === t(lang(), "dashboard", "system", "statusActive")
              ? "inline-block px-4 py-1 text-sm font-medium rounded-full border bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
              : "inline-block px-4 py-1 text-sm font-medium rounded-full border bg-[#F8D7DA] text-[#8B1A1A] border-[#E6A1A1]"
          }
        >
          {data().status ?? "—"}
        </span>
      </div>

      {/* Titel */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-2">
        {t(lang(), "dashboard", "customer", "title")}
      </h2>

      {/* Name / Firma */}
      <div class="mt-2">
        {data().isBusiness && data().company ? (
          <>
            <p class="text-lg font-semibold text-[#1E2A45]">
              {data().company}
            </p>
            <p class="text-gray-500 text-sm">
              {`${data().firstName} ${data().lastName}`.trim()}
            </p>
          </>
        ) : (
          <p class="text-lg font-semibold text-[#1E2A45]">
            {`${data().firstName} ${data().lastName}`.trim() || "—"}
          </p>
        )}
      </div>

      {/* Details */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-8 mt-5">
        <Info label="status" value={data().status} lang={lang()} />
        <Info label="plan" value={data().plan} lang={lang()} />
        <Info label="activeUntil" value={data().activeUntil} lang={lang()} />
        <Info label="lastLogin" value={data().lastLogin} lang={lang()} />
      </div>

      {/* Button */}
      <div class="flex justify-end mt-6">
        <button
          onClick={() =>
            window.dispatchEvent(new Event("open-customer-modal"))
          }
          class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-6 py-2.5 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          {t(lang(), "dashboard", "customer", "button")}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* 🧩 Subcomponent (parser-safe)     */
/* -------------------------------- */
function Info(props) {
  return (
    <div>
      <span class="font-medium text-gray-800">
        {t(props.lang, "dashboard", "customer", props.label)}:
      </span>
      <p class="text-gray-600">{props.value || "—"}</p>
    </div>
  );
}
