import { createSignal } from "solid-js";

/* Cards */
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

/* Modals */
import CustomerModal from "./modals/CustomerModal.jsx";
import ImprintModal from "./modals/ImprintModal.jsx";
import PrivacyModal from "./modals/PrivacyModal.jsx";

export default function DashboardApp() {
  const lang =
    typeof window !== "undefined"
      ? window.SMARTPAGES_LANG || "en"
      : "en";

  const [showCustomer, setShowCustomer] = createSignal(false);
  const [showImprint, setShowImprint] = createSignal(false);
  const [showPrivacy, setShowPrivacy] = createSignal(false);

  return (
    <>
      {/* CARDS */}
      <div class="space-y-6">
        <CustomerCard
          lang={lang}
          onEdit={() => setShowCustomer(true)}
        />

        <ImprintCard
          lang={lang}
          onEdit={() => setShowImprint(true)}
        />

        <PrivacyCard
          lang={lang}
          onEdit={() => setShowPrivacy(true)}
        />
      </div>

      {/* MODALS */}
      <CustomerModal
        lang={lang}
        show={showCustomer}
        onClose={() => setShowCustomer(false)}
      />

      <ImprintModal
        lang={lang}
        show={showImprint}
        onClose={() => setShowImprint(false)}
      />

      <PrivacyModal
        lang={lang}
        show={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </>
  );
}
