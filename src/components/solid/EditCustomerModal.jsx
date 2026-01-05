import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditCustomerModal(props) {
  const [name, setName] = createSignal(props.data.name || "");

  const handleSave = async () => {
    try {
      // Optional: API Call zum Speichern
      await fetch("https://api.smartpages.online/api/customer/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name() }),
      });

      props.onSave({ name: name() });
      props.onClose();
    } catch (err) {
      console.error("❌ Fehler beim Speichern der Kundendaten:", err);
    }
  };

  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">Kundendaten bearbeiten</h2>

      {/* Nur Feld "Name" bleibt editierbar */}
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        {/* Tarif und Aktiv-Bis bleiben sichtbar, aber nicht bearbeitbar */}
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Tarif</label>
          <input
            type="text"
            value={props.data.plan || "—"}
            disabled
            class="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-1">Aktiv bis</label>
          <input
            type="text"
            value={props.data.activeUntil || "—"}
            disabled
            class="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={props.onClose}
        >
          Abbrechen
        </button>
        <button
          class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg text-sm font-medium shadow hover:scale-105 transition"
          onClick={handleSave}
        >
          Speichern
        </button>
      </div>
    </ModalWrapper>
  );
}
