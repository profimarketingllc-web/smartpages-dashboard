import { createSignal, createMemo } from "solid-js";
import dashboardI18n from "~/utils/i18n/dashboard";

import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

export default function DashboardApp() {
  // 🔒 Sprache: static-safe + client-aware
  const [lang] = createSignal(
    typeof window !== "undefined"
      ? window.SMARTPAGES_LANG || "en"
      : "en"
  );

  // 📚 i18n Bundle
  const i18n = createMemo(() => dashboardI18n[lang()]);

  return (
    <div class="space-y-6">
      <CustomerCard
        t={i18n().customer}
        system={i18n().system}
      />

      <ImprintCard
        t={i18n().imprint}
        system={i18n().system}
      />

      <PrivacyCard
        t={i18n().privacy}
        system={i18n().system}
      />
    </div>
  );
}
