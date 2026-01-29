import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

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