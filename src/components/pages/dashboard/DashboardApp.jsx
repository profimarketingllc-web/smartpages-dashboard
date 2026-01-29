import { createSignal } from "solid-js";

/* Card */
import CustomerCard from "./CustomerCard.jsx";

/* Modal */
import CustomerModal from "./modals/CustomerModal.jsx";

export default function DashboardApp() {
  const [showCustomer, setShowCustomer] = createSignal(false);

  return (
    <>
      {/* CARD */}
      <div class="space-y-6">
        <CustomerCard onEdit={() => setShowCustomer(true)} />
      </div>

      {/* MODAL */}
      <CustomerModal
        open={showCustomer()}
        onClose={() => setShowCustomer(false)}
      />
    </>
  );
}
