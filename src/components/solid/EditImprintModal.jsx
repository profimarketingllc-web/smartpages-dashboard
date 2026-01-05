import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditImprintModal(props) {
  const lang =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? "en"
      : "de";

  const t = {
    de: {
      title: "Impressum bearbeiten",
      company: "Firma",
      contact: "Ansprechpartner",
      street: "Straße",
      housenumber: "Hausnummer",
      zip: "PLZ",
      city: "Ort",
      phone: "Telefon",
      email: "E-Mail",
      vat: "USt-ID",
      cancel: "Abbrechen",
      save: "Speichern",
    },
    en: {
      title: "Edit Imprint",
      company: "Company",
      contact: "Contact Person",
      street: "Street",
      housenumber: "House Number",
      zip: "ZIP",
      city: "City",
      phone: "Phone",
      email: "Email",
      vat: "VAT ID",
      cancel: "Cancel",
      save: "Save",
    },
  }[lang];

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
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">{t.title}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["company", t.company],
          ["contact", t.contact],
          ["street", t.street],
          ["housenumber", t.housenumber],
          ["zip", t.zip],
          ["city", t.city],
          ["phone", t.phone],
          ["email", t.email],
          ["vat", t.vat],
        ].map(([key, label]) => (
          <div class={key === "vat" ? "sm:col-span-2" : ""}>
            <label class="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type={key === "email" ? "email" : "text"}
              value={form()[key]}
              onInput={(e) => updateField(key, e.target.value)}
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
            />
          </div>
        ))}
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={props.onClose}
        >
          {t.cancel}
        </button>
        <button
          class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg text-sm font-medium shadow hover:scale-105 transition"
          onClick={handleSave}
        >
          {t.save}
        </button>
      </div>
    </ModalWrapper>
  );
}
