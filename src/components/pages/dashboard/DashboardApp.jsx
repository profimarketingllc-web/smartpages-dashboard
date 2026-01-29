import { createSignal } from "solid-js";
import dashboardI18n from "~/utils/i18n/dashboard";

/* Cards */
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

/* Modals */
import EditCustomerModal from "./modals/EditCustomerModal.jsx";
import EditImprintModal from "./modals/EditImprintModal.jsx";
import EditPrivacyModal from "./modals/EditPrivacyModal.jsx";

export default function DashboardApp() {
  /* 🌍 Sprache – zentral, static-safe */
  const lang =
    typeof window !== "undefined"
      ? window.SMARTPAGES_LANG || "en"
      : "en";

  const t = dashboardI18n[lang];

  /* 🧠 Modal State */
  const [showCustomer, setShowCustomer] = createSignal(false);
  const [showImprint, setShowImprint] = createSignal(false);
  const [showPrivacy, setShowPrivacy] = createSignal(false);

  return (
    <div class="space-y-8">

      {/* ================= CARDS ================= */}

      <CustomerCard
        t={t.customer}
        system={t.system}
        onEdit={() => setShowCustomer(true)}
      />

      <ImprintCard
        t={t.imprint}
        system={t.system}
        onEdit={() => setShowImprint(true)}
      />

      <PrivacyCard
        t={t.privacy}
        system={t.system}
        onEdit={() => setShowPrivacy(true)}
      />

      {/* ================= MODALS ================= */}

      <EditCustomerModal
        show={showCustomer()}
        onClose={() => setShowCustomer(false)}
        t={t.customer}
        system={t.system}
      />

      <EditImprintModal
        show={showImprint()}
        onClose={() => setShowImprint(false)}
        t={t.imprint}
        system={t.system}
      />

      <EditPrivacyModal
        show={showPrivacy()}
        onClose={() => setShowPrivacy(false)}
        t={t.privacy}
        system={t.system}
      />
    </div>
  );
}
