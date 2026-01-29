import { createSignal, createMemo } from "solid-js";
import dashboardI18n from "~/utils/i18n/dashboard";

/* Cards */
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

export default function DashboardApp() {
  // 🔒 Fallback-Sprache (static-safe, client-only)
  const [lang] = createSignal(
    typeof window !== "undefined"
      ? window.SMARTPAGES_LANG || "en"
      : "en"
  );

  // 🔤 Aktive i18n-Texte
  const t = createMemo(() => dashboardI18n[lang()]);

  return (
    <div class="space-y-6">
      <CustomerCard
        t={t().customer}
        system={t().system}
      />

      <ImprintCard
        t={t().imprint}
        system={t().system}
      />

      <PrivacyCard
        t={t().privacy}
        system={t().system}
      />
    </div>
  );
}
