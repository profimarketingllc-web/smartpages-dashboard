import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function EditCustomerModal() {
  const [showModal, setShowModal] = createSignal(false);

  // 🔍 Sprache erkennen
  const lang =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? "en"
      : "de";

  // 🌐 Übersetzungen
  const t = {
    de: {
      title: "Kundendaten bearbeiten",
      name: "Name",
      cancel: "Abbrechen",
      save: "Speichern",
    },
    en: {
      title: "Edit Customer Data",
      name: "Name",
      cancel: "Cancel",
      save: "Save",
    },
  }[lang];

  // 🧭 Eventlistener für Dashboard-Signale
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-customer-modal empfangen");
      setShowModal(true);
    };
    window.addEventListener("open-customer-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-customer-modal", openHandler));
  });

  const handleClose = () => setShowModal(false);
  const handleSave = () => {
    console.log("💾 Kundendaten gespeichert!");
    setShowModal(false);
  };

  return (
    <ModalWrapper show={showModal()} onClose={handleClose}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">{t.title}</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
          <input
            type="text"
            placeholder={t.name}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>
      </div>

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
