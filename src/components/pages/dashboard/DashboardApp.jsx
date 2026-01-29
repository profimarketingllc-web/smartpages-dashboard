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
  // 🔐 Modal States (zentral!)
  const [showCustomer, setShowCustomer] = createSignal(false);
  const [showImprint, setShowImprint] = createSignal(false);
  const [showPrivacy, setShowPrivacy] = createSignal(false);

  return (
    <>
      {/* ================= CARDS ================= */}
      <div class="space-y-6">
        <CustomerCard onEdit={() => setShowCustomer(true)} />
        <ImprintCard onEdit={() => setShowImprint(true)} />
        <PrivacyCard onEdit={() => setShowPrivacy(true)} />
      </div>

      {/* ================= MODALS ================= */}
      <CustomerModal
        open={showCustomer()}
        onClose={() => setShowCustomer(false)}
      />

      <ImprintModal
        open={showImprint()}
        onClose={() => setShowImprint(false)}
      />

      <PrivacyModal
        open={showPrivacy()}
        onClose={() => setShowPrivacy(false)}
      />
    </>
  );
}
