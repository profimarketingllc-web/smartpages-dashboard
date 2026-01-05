import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditImprintModal(props) {
  const [form, setForm] = createSignal({
    company: props.data?.company || "",
    contact: props.data?.contact || "",
    address: props.data?.address || "",
    zip: props.data?.zip || "",
    city: props.data?.city || "",
    email: props.data?.email || "",
    phone: props.data?.phone || "",
    vat: props.data?.vat || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form(), [key]: value });
  };

  const saveData = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form()),
      });
      if (!res.ok) throw new Error("Update failed");
      props.onSave?.(await res.json());
      props.onClose();
    } catch (err) {
      alert("Fehler beim Speichern der Impressumsdaten.");
    }
  };

  return (
    <ModalWrapper show={props.show} onClose={props.onClose} title="Impressum bearbeiten">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Firma</label>
          <input
            value={form().company}
            onInput={(e) => handleChange("company", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ansprechpartner</label>
          <input
            value={form().contact}
            onInput={(e) => handleChange("contact", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            value={form().address}
            onInput={(e) => handleChange("address", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">PLZ</label>
          <input
            value={form().zip}
            onInput={(e) => handleChange("zip", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Ort</label>
          <input
            value={form().city}
            onInput={(e) => handleChange("city", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">E-Mail</label>
          <input
            value={form().email}
            onInput={(e) => handleChange("email", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            value={form().phone}
            onInput={(e) => handleChange("phone", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">USt-ID</label>
          <input
            value={form().vat}
            onInput={(e) => handleChange("vat", e.target.value)}
            class="w-full mt-1 p-2 border rounded-lg"
          />
        </div>
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
    </ModalWrapper>
  );
}
