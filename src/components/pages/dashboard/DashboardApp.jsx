// src/components/pages/dashboard/DashboardApp.jsx
import { createSignal } from "solid-js";

import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";

import CustomerModal from "./modals/CustomerModal.jsx";
import ImprintModal from "./modals/ImprintModal.jsx";

export default function DashboardApp() {
  const [showCustomerModal, setShowCustomerModal] = createSignal(false);
  const [showImprintModal, setShowImprintModal] = createSignal(false);

  return (
    <>
      <div class="space-y-6">
        <CustomerCard onEdit={() => setShowCustomerModal(true)} />
        <ImprintCard onEdit={() => setShowImprintModal(true)} />
      </div>

      {/* Modals */}
      <CustomerModal
        show={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />

      <ImprintModal
        show={showImprintModal}
        onClose={() => setShowImprintModal(false)}
      />
    </>
  );
}
