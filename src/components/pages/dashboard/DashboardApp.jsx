import { createSignal } from "solid-js";
import CustomerCard from "./CustomerCard.jsx";
import CustomerModal from "./modals/CustomerModal.jsx";

export default function DashboardApp() {
  const [showCustomer, setShowCustomer] = createSignal(false);

  return (
    <>
      <CustomerCard onEdit={() => setShowCustomer(true)} />

      <CustomerModal
        open={showCustomer()}
        onClose={() => setShowCustomer(false)}
      />
    </>
  );
}
