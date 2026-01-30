import SystemMessage from "./SystemMessage.jsx";
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

import CustomerModal from "./modals/CustomerModal.jsx";
import ImprintModal from "./modals/ImprintModal.jsx";
import PrivacyModal from "./modals/PrivacyModal.jsx";

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
      <CustomerModal />
      <ImprintModal />
      <PrivacyModal />
    </>
  );
}
