/* Cards */
import SystemMessage from "./SystemMessage.jsx";
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

/* Modals */
import EditCustomerModal from "./modals/EditCustomerModal.jsx";
import EditImprintModal from "./modals/EditImprintModal.jsx";
import EditPrivacyModal from "./modals/EditPrivacyModal.jsx";

export default function DashboardRoot() {
  return (
    <>
      {/* ---------------- System Message ---------------- */}
      <SystemMessage />

      {/* ---------------- Cards ---------------- */}
      <CustomerCard />
      <ImprintCard />
      <PrivacyCard />

      {/* ---------------- Modals ---------------- */}
      <EditCustomerModal />
      <EditImprintModal />
      <EditPrivacyModal />
    </>
  );
}
