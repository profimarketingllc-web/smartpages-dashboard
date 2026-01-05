import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditImprintModal(props) {
  // 🌍 Sprache automatisch erkennen
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
    },
  }[lang];

  // 🧩 Signale für Sichtbarkeit & Felder
  const [show, setShow] = createSignal(false);

  const [company, setCompany] = createSignal(props.data?.company || "");
  const [contact, setContact] = createSignal(props.data?.contact || "");
  const [street, setStreet] = createSignal(props.data?.street || "");
  const [number, setNumber] = createSignal(props.data?.number || "");
  const [zip, setZip] = createSignal(props.data?.zip || "");
  const [city, setCity] = createSignal(props.data?.city || "");
  const [phone, setPhone] = createSignal(props.data?.phone || "");
  const [email, setEmail] = createSignal(props.data?.email || "");
  const [vat, setVat] = createSignal(props.data?.vat || "");

  // 🔔 Modal-Event-System
  const openHandler = () => setShow(true);
  const closeHandler = () => setShow(false);

  onMount(() => {
    window.addEventListener("open-imprint-modal", openHandler);
  });

  onCleanup(() => {
    window.removeEventListener("open-imprint-modal", openHandler);
  });

  // 💾 Speichern
  const handleSave = async () => {
    try {
      await fetch("https://api.smartpages.online/api/imprint/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company(),
          contact: contact(),
          street: street(),
          number: number(),
          zip: zip(),
          city: city(),
          phone: phone(),
          email: email(),
          vat: vat(),
        }),
      });

      props.onSave?.({
        company: company(),
        contact: contact(),
        street: street(),
        number: number(),
        zip: zip(),
        city: city(),
        phone: phone(),
        email: email(),
        vat: vat(),
      });

      closeHandler();
    } catch (err) {
      console.error("❌ Fehler beim Speichern der Impressumsdaten:", err);
    }
  };

  // 🪟 Modal UI
  return (
    <ModalWrapper show={show()} onClose={closeHandler}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">{t.title}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.company}</label>
          <input
            type="text"
            value={company()}
            onInput={(e) => setCompany(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.contact}</label>
          <input
            type="text"
            value={contact()}
            onInput={(e) => setContact(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.street}</label>
          <input
            type="text"
            value={street()}
            onInput={(e) => setStreet(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.number}</label>
          <input
            type="text"
            value={number()}
            onInput={(e) => setNumber(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.zip}</label>
          <input
            type="text"
            value={zip()}
            onInput={(e) => setZip(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.city}</label>
          <input
            type="text"
            value={city()}
            onInput={(e) => setCity(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
          <input
            type="text"
            value={phone()}
            onInput={(e) => setPhone(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.vat}</label>
          <input
            type="text"
            value={vat()}
            onInput={(e) => setVat(e.target.value)}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={closeHandler}
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
