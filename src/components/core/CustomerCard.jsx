---
/**
 * CustomerCard.astro
 * ------------------
 * Zeigt Kundendaten im Dashboard an.
 * - Kompaktes Padding
 * - Einheitliche Platzhalter („—“ statt Skeleton)
 * - Ruhiger, konsistenter Stil zur ImpressumCard
 */

const { customer } = Astro.props;

function displayValue(value) {
  return value && value.trim() !== "" ? value : "—";
}
---

<section class="dashboard-card bg-white rounded-2xl shadow-sm p-5 md:p-6">
  <h2 class="text-xl font-semibold text-smart-text mb-4">Kundendaten</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-smart-text">
    <div>
      <strong>Name:</strong> {displayValue(customer?.name)}
    </div>
    <div>
      <strong>Tarif:</strong> {displayValue(customer?.tariff)}
    </div>
    <div>
      <strong>aktiviert bis:</strong> {displayValue(customer?.activeUntil)}
    </div>

    <div>
      <strong>Status:</strong> {displayValue(customer?.status)}
    </div>
    <div>
      <strong>letzter Login:</strong> {displayValue(customer?.lastLogin)}
    </div>
  </div>

  <div class="flex justify-end items-center mt-5">
    <span
      class={`text-xs font-semibold px-3 py-1.5 rounded-full ${
        customer?.status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-700"
      }`}
    >
      {displayValue(customer?.statusText)}
    </span>

    <a
      href="/dashboard/profile"
      class="ml-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white font-semibold text-sm px-5 py-2 shadow-[0_0_15px_rgba(228,126,0,0.25)] hover:shadow-[0_0_25px_rgba(228,126,0,0.35)] transition-all duration-300"
    >
      Profil bearbeiten
    </a>
  </div>
</section>

<style>
  .dashboard-card {
    padding-top: 1rem;
    padding-bottom: 1.25rem;
  }

  @media (min-width: 768px) {
    .dashboard-card {
      padding-top: 1.25rem;
      padding-bottom: 1.5rem;
    }
  }
</style>
