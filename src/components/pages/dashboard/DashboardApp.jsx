import { createSignal } from "solid-js";

import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

import CustomerModal from "./modals/CustomerModal.jsx";
import ImprintModal from "./modals/ImprintModal.jsx";
import PrivacyModal from "./modals/PrivacyModal.jsx";

export default function DashboardApp() {
  const [customerOpen, setCustomerOpen] = createSignal(false);
  const [imprintOpen, setImprintOpen] = createSignal(false);
  const [privacyOpen, setPrivacyOpen] = createSignal(false);

  return (
    <>
      {/* Cards */}
      <div class="space-y-6">
        <CustomerCard onEdit={() => setCustomerOpen(true)} />
        <ImprintCard onEdit={() => setImprintOpen(true)} />
        <PrivacyCard onEdit={() => setPrivacyOpen(true)} />
      </div>

      {/* Modals */}
      <CustomerModal
        show={customerOpen}
        onClose={() => setCustomerOpen(false)}
      />

      <ImprintModal
        show={imprintOpen}
        onClose={() => setImprintOpen(false)}
      />

      <PrivacyModal
        show={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
    </>
  );
}
