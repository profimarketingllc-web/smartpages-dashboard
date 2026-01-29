import { createSignal } from "solid-js";
import CustomerModal from "./modals/CustomerModal";

export default function CustomerCard() {
  const [showModal, setShowModal] = createSignal(false);

  return (
    <>
      <div class="bg-white rounded-2xl p-6 shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Customer Information</h2>

          <button
            class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
            onClick={() => setShowModal(true)}
          >
            Edit customer
          </button>
        </div>

        {/* Platzhalter */}
        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>First name</strong>
            <div>—</div>
          </div>
          <div>
            <strong>Last name</strong>
            <div>—</div>
          </div>
          <div>
            <strong>Company</strong>
            <div>—</div>
          </div>
        </div>
      </div>

      {/* ✅ Modal wird NUR angezeigt, wenn showModal true */}
      <CustomerModal
        show={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
