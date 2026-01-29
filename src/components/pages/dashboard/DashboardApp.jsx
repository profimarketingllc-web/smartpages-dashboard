import { createSignal, createMemo } from "solid-js";
import dashboardI18n from "~/utils/i18n/dashboard";

/* Card */
import CustomerCard from "./CustomerCard.jsx";

export default function DashboardApp() {
  // 🔒 Fallback-Sprache (static-safe)
  const [lang] = createSignal(
    typeof window !== "undefined"
      ? window.SMARTPAGES_LANG || "en"
      : "en"
  );

  // 🔤 Texte für das Dashboard
  const t = createMemo(() => dashboardI18n[lang()]);

  return (
    <div class="space-y-6">
      <CustomerCard
        t={t().customer}
        system={t().system}
      />
    </div>
  );
}
