import SystemMessage from "./SystemMessage.jsx";
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

import EditCustomerModal from "./modals/EditCustomerModal.jsx";
import EditImprintModal from "./modals/EditImprintModal.jsx";
import EditPrivacyModal from "./modals/EditPrivacyModal.jsx";

export default function DashboardRoot() {
  return (
    <>
      {/* ---------------- Dashboard Grid ---------------- */}
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CustomerCard – breit */}
        <div class="lg:col-span-8">
          <CustomerCard />
        </div>

        {/* SystemMessage – schmal rechts */}
        <div class="lg:col-span-4">
          <SystemMessage />
        </div>

        {/* ImprintCard – volle Breite */}
        <div class="lg:col-span-12">
          <ImprintCard />
        </div>

        {/* PrivacyCard – volle Breite */}
        <div class="lg:col-span-12">
          <PrivacyCard />
        </div>
      </div>

      {/* ---------------- Modals ---------------- */}
      <EditCustomerModal />
      <EditImprintModal />
      <EditPrivacyModal />
    </>
  );
}
