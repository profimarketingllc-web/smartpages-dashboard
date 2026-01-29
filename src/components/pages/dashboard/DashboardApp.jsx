import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

export default function DashboardApp() {
  return (
    <div class="space-y-6">
      <CustomerCard />
      <ImprintCard />
      <PrivacyCard />
    </div>
  );
}
