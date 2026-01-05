import { createSignal, createResource, Show } from "solid-js";
import EditImprintModal from "./EditImprintModal";

export default function ImprintCard() {
  // 🔹 Daten aus API laden
  const fetchImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      return await res.json();
    } catch {
      return {
        company: "—",
        contact: "—",
        address: "—",
        housenumber: "—",
        zip: "—",
        city: "—",
        email: "—",
        phone: "—",
        vat: "—",
      };
    }
  };

  const [imprint, { mutate }] = createResource(fetchImprint);
  const [showModal, setShowModal] = createSignal(false);

  const data = () => imprint() || {};
  const displayValue = (val) => (val ? val : "—");

  // 🔹 Aktualisierung der lokalen Daten nach dem Speichern im Modal
  const handleSave = (updatedData) => {
    mutate({ ...data(), ...updatedData });
  };

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5">
      {/* 🔹 Überschrift */}
      <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45] mb-5 text-center md:text-left">
        Impressumsdaten
      </h2>

      {/* 🔹 Grid bleibt identisch */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
        <div>
          <span class="font-medium text-gray-800">Firma:</span>
          <p class="text-gray-500">{displayValue(data().company)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ansprechpartner:</span>
          <p class="text-gray-500">{displayValue(data().contact)}</p>
        </div>

        {/* 🔸 Button öffnet Modal */}
        <div class="flex justify-end lg:justify-start items-start">
          <button
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
            onClick={() => setShowModal(true)}
          >
            Impressum bearbeiten
          </button>
        </div>

        <div>
          <span class="font-medium text-gray-800">Straße:</span>
          <p class="text-gray-500">{displayValue(data().address)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Hausnummer:</span>
          <p class="text-gray-500">{displayValue(data().housenumber)}</p>
        </div>

        <div></div>

        <div>
          <span class="font-medium text-gray-800">PLZ:</span>
          <p class="text-gray-500">{displayValue(data().zip)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">Ort:</span>
          <p class="text-gray-500">{displayValue(data().city)}</p>
        </div>

        <div></div>

        <div>
          <span class="font-medium text-gray-800">Telefon:</span>
          <p class="text-gray-500">{displayValue(data().phone)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">E-Mail:</span>
          <p class="text-gray-500">{displayValue(data().email)}</p>
        </div>
        <div>
          <span class="font-medium text-gray-800">USt-ID:</span>
          <p class="text-gray-500">{displayValue(data().vat)}</p>
        </div>
      </div>

      {/* 🔸 Modal-Komponente (funktional, kein Design-Eingriff) */}
      <Show when={showModal()}>
        <EditImprintModal
          show={showModal}
          onClose={() => setShowModal(false)}
          data={data()}
          onSave={handleSave}
        />
      </Show>
    </div>
  );
}
