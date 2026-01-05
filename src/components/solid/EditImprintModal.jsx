import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditImprintModal() {
  const [showModal, setShowModal] = createSignal(false);
  const [form, setForm] = createSignal({
    company: "",
    contact: "",
    street: "",
    number: "",
    zip: "",
    city: "",
    phone: "",
    email: "",
    vat: "",
  });

  // 🌍 Sprache erkennen
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
      number: "Hausnummer",
      zip: "PLZ",
      city: "Ort",
      phone: "Telefon",
      email: "E-Mail",
      vat: "USt-ID",
      cancel: "Abbrechen",
      save: "Speichern",
      success: "Impressum erfolgreich gespeichert.",
      error: "Fehler beim Speichern.",
    },
    en: {
      title: "Edit Imprint",
      company: "Company",
      contact: "Contact Person",
      street: "Street",
      number: "Number",
      zip: "ZIP",
      city: "City",
      phone: "Phone",
      email: "Email",
      vat: "VAT ID",
      cancel: "Cancel",
      save: "Save",
      success: "Imprint saved successfully.",
      error: "Error saving imprint.",
    },
  }[lang];

  // 🧩 Öffnen des Modals (Signal aus Dashboard)
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-imprint-modal empfangen");
      setShowModal(true);
      loadImprint();
    };
    window.addEventListener("open-imprint-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-imprint-modal", openHandler));
  });

  // 🗂️ Daten abrufen
  const loadImprint = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No imprint data");
      const data = await res.json();
      setForm({
        company: data.company || "",
        contact: data.contact || "",
        street: data.street || "",
        number: data.number || "",
        zip: data.zip || "",
        city: data.city || "",
        phone: data.phone || "",
        email: data.email || "",
        vat: data.vat || "",
      });
    } catch (err) {
      console.warn("⚠️ Konnte Imprint-Daten nicht laden:", err);
    }
  };

  // ✏️ Feldaktualisierung
  const updateField = (key, value) => {
    setForm({ ...form(), [key]: value });
  };

  // 💾 Speichern in D1
  const handleSave = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form()),
      });
      if (!res.ok) throw new Error("API response not OK");
      alert(t.success);
      setShowModal(false);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert(t.error);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <ModalWrapper show={showModal()} onClose={handleClose}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">{t.title}</h2>

      {/* Formular */}
      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        <Field label={t.company} keyName="company" value={form().company} onInput={updateField} />
        <Field label={t.contact} keyName="contact" value={form().contact} onInput={updateField} />
        <Field label={t.street} keyName="street" value={form().street} onInput={updateField} />
        <Field label={t.number} keyName="number" value={form().number} onInput={updateField} />
        <Field label={t.zip} keyName="zip" value={form().zip} onInput={updateField} />
        <Field label={t.city} keyName="city" value={form().city} onInput={updateField} />
        <Field label={t.phone} keyName="phone" value={form().phone} onInput={updateField} />
        <Field label={t.email} keyName="email" value={form().email} onInput={updateField} />
        <Field label={t.vat} keyName="vat" value={form().vat} onInput={updateField} />
      </div>

      {/* Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
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

// 🔹 Reusable Field Component
function Field(props) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">{props.label}</label>
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(props.keyName, e.target.value)}
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
      />
    </div>
  );
}
