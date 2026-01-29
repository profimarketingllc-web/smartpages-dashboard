import { createSignal } from "solid-js";

import CustomerCard from "./CustomerCard";
import CustomerModal from "./modals/CustomerModal";

export default function DashboardApp() {
  // Modal-State
  const [showCustomerModal, setShowCustomerModal] = createSignal(false);

  return (
    <>
      {/* Cards */}
      <div class="space-y-6">
        <CustomerCard
          onEdit={() => setShowCustomerModal(true)}
        />
      </div>

      {/* Modals */}
      <CustomerModal
        show={showCustomerModal()}
        onClose={() => setShowCustomerModal(false)}
      />
    </>
  );
}
