import { createSignal } from "solid-js";

import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

import CustomerModal from "./modals/CustomerModal.jsx";
import ImprintModal from "./modals/ImprintModal.jsx";
import PrivacyModal from "./modals/PrivacyModal.jsx";

export default function DashboardApp() {
  const [openModal, setOpenModal] = createSignal(null);

  const close = () => setOpenModal(null);

  return (
    <>
      {/* CARDS */}
      <div class="space-y-6">
        <CustomerCard onEdit={() => setOpenModal("customer")} />
        <ImprintCard onEdit={() => setOpenModal("imprint")} />
        <PrivacyCard onEdit={() => setOpenModal("privacy")} />
      </div>

      {/* MODALS */}
      <CustomerModal
        open={openModal() === "customer"}
        onClose={close}
      />

      <ImprintModal
        open={openModal() === "imprint"}
        onClose={close}
      />

      <PrivacyModal
        open={openModal() === "privacy"}
        onClose={close}
      />
    </>
  );
}
