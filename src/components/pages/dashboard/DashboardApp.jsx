import { createSignal, createMemo, onMount } from "solid-js";
import dashboardI18n from "~/utils/i18n/dashboard";

/* Cards */
import CustomerCard from "./CustomerCard.jsx";

/* Modals */
import CustomerModal from "./modals/CustomerModal.jsx";

export default function DashboardApp() {
  /* ----------------------------- */
  /* 🌍 Sprache (zentral)          */
  /* ----------------------------- */
  const [lang, setLang] = createSignal("en");

  onMount(() => {
    // Fallback ist bereits "en"
    if (window.SMARTPAGES_LANG) {
      setLang(window.SMARTPAGES_LANG);
    }

    window.addEventListener("smartpages:context-ready", (e) => {
      if (e.detail?.lang) {
        setLang(e.detail.lang);
      }
    });
  });

  const t = createMemo(() => dashboardI18n[lang()]);

  /* ----------------------------- */
  /* 👤 Customer State             */
  /* ----------------------------- */
  const [customer, setCustomer] = createSignal({
    first_name: "",
    last_name: "",
    company: "",
  });

  /* ----------------------------- */
  /* 🔔 Events                     */
  /* ----------------------------- */
  onMount(() => {
    window.addEventListener("customer-updated", (e) => {
      if (e.detail) {
        setCustomer(e.detail);
      }
    });
  });

  return (
    <>
      <div class="space-y-6">
        <CustomerCard
          t={t().customer}
          system={t().system}
          customer={customer}
        />
      </div>

      {/* 🔲 Modals */}
      <CustomerModal
        t={t().customer}
        system={t().system}
        customer={customer}
      />
    </>
  );
}
