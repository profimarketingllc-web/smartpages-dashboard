import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditCustomerModal(props) {
  const [form, setForm] = createSignal({
    name: props.data?.name || "",
    plan: props.data?.plan || "",
    activeUntil: props.data?.activeUntil || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form(), [key]: value });
  };

  const saveData = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/customer/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form()),
      });
      if (!res.ok) throw new Error("Update failed");
      props.onSave?.(await res.json());
      props.onClose();
    } catch (err) {
      alert("Fehler beim Speichern der Kundendaten.");
    }
  };

  return (
    <ModalWrapper show={props.show} onClose={props.onClose} title="Kundendaten bearbeiten">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={form().name}
            onInput={(e) => handleChange("name", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Tarif</label>
          <input
            value={form().plan}
            onInput={(e) => handleChange("plan", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Aktiv bis</label>
          <input
            type="date"
            value={form().activeUntil}
            onInput={(e) => handleChange("activeUntil", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            onClick={props.onClose}
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Abbrechen
          </button>
          <button
            onClick={saveData}
            class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg shadow-md hover:scale-105"
          >
            Speichern
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
