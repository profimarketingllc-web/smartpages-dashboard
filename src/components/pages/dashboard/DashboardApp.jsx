// src/components/pages/dashboard/DashboardApp.jsx
import { createSignal } from "solid-js";
import CustomerCard from "./CustomerCard";
import CustomerModal from "./modals/CustomerModal";

export default function DashboardApp() {
  const [showCustomer, setShowCustomer] = createSignal(false);
  const [customerData, setCustomerData] = createSignal(null);
  let refetchCustomer;

  return (
    <>
      <CustomerCard
        onEdit={(data, refetch) => {
          setCustomerData(data);
          refetchCustomer = refetch;
          setShowCustomer(true);
        }}
      />

      <CustomerModal
        open={showCustomer()}
        data={customerData()}
        onClose={() => setShowCustomer(false)}
        onSaved={() => refetchCustomer && refetchCustomer()}
      />
    </>
  );
}
