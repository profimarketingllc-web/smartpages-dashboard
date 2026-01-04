---
/**
 * ImprintCard.astro
 * -----------------
 * Zeigt Impressumsdaten im Dashboard.
 * - Kompaktes, einheitliches Padding
 * - Struktur parallel zur CustomerCard
 */

const { imprint } = Astro.props;

function displayValue(value) {
  return value && value.trim() !== "" ? value : "—";
}
---

<section class="dashboard-card bg-white rounded-2xl shadow-sm p-5 md:p-6">
  <h2 class="text-xl font-semibold text-smart-text mb-4">Impressumsdaten</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-smart-text">
    <div>
      <strong>Firma:</strong> {displayValue(imprint?.company)}
    </div>
    <div>
      <strong>Ansprechpartner:</strong> {displayValue(imprint?.contactPerson)}
    </div>

    <div>
      <strong>Straße:</strong> {displayValue(imprint?.street)}
    </div>
    <div>
      <strong>Hausnummer:</strong> {displayValue(imprint?.houseNumber)}
    </div>

    <div>
      <strong>PLZ:</strong> {displayValue(imprint?.zip)}
    </div>
    <div>
      <strong>Ort:</strong> {displayValue(imprint?.city)}
    </div>

    <div>
      <strong>Telefon:</strong> {displayValue(imprint?.phone)}
    </div>
    <div>
      <strong>E-Mail:</strong> {displayValue(imprint?.email)}
    </div>
    <div>
      <strong>USt-ID:</strong> {displayValue(imprint?.vatId)}
    </div>
  </div>

  <div class="flex justify-end items-center mt-5">
    <a
      href="/dashboard/imprint"
      class="ml-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white font-semibold text-sm px-5 py-2 shadow-[0_0_15px_rgba(228,126,0,0.25)] hover:shadow-[0_0_25px_rgba(228,126,0,0.35)] transition-all duration-300"
    >
      Impressum bearbeiten
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
