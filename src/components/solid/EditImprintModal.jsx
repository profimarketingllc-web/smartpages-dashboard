import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditImprintModal(props) {
  const [form, setForm] = createSignal({
    company: props.data.company || "",
    contact: props.data.contact || "",
    street: props.data.address || "",
    housenumber: props.data.housenumber || "",
    zip: props.data.zip || "",
    city: props.data.city || "",
    phone: props.data.phone || "",
    email: props.data.email || "",
    vat: props.data.vat || "",
  });

  const updateField = (key, value) => {
    setForm({ ...form(), [key]: value });
  };

  const handleSave = async () => {
    try {
      await fetch("https://api.smartpages.online/api/imprint/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form()),
      });
      props.onSave(form());
      props.onClose();
    } catch (err) {
      console.error("❌ Fehler beim Speichern der Impressumsdaten:", err);
    }
  };

  return (
    <ModalWrapper show={props.show} onClose={props.onClose}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">Impressum bearbeiten</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Firma</label>
          <input
            type="text"
            value={form().company}
            onInput={(e) => updateField("company", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ansprechpartner</label>
          <input
            type="text"
            value={form().contact}
            onInput={(e) => updateField("contact", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Straße</label>
          <input
            type="text"
            value={form().street}
            onInput={(e) => updateField("street", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hausnummer</label>
          <input
            type="text"
            value={form().housenumber}
            onInput={(e) => updateField("housenumber", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">PLZ</label>
          <input
            type="text"
            value={form().zip}
            onInput={(e) => updateField("zip", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ort</label>
          <input
            type="text"
            value={form().city}
            onInput={(e) => updateField("city", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <input
            type="text"
            value={form().phone}
            onInput={(e) => updateField("phone", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
          <input
            type="email"
            value={form().email}
            onInput={(e) => updateField("email", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">USt-ID</label>
          <input
            type="text"
            value={form().vat}
            onInput={(e) => updateField("vat", e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
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
