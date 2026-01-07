import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t } from "~/utils/i18n";

/**
 * EditCustomerModal.jsx
 * -------------------------------------------------------
 * ✅ Sprachfähig über zentrales i18n-System
 * ✅ SSR-kompatibel (nutzt Middleware oder URL)
 * ✅ Dynamisch via Dashboard-Events (open-customer-modal)
 * ✅ Einheitliches UI-Design mit ModalWrapper
 * ✅ Vorname / Nachname getrennt
 */

export default function EditCustomerModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    plan: "",
  });

  // 🌍 Sprache bestimmen
  const lang =
    props.lang ||
    (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

  // 🧭 Dashboard-Eventlistener für Öffnen
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-customer-modal empfangen");
      setShowModal(true);
    };
    window.addEventListener("open-customer-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-customer-modal", openHandler));
  });

  // 🧩 Steuerfunktionen
  const handleClose = () => setShowModal(false);
  const handleInput = (e) =>
    setFormData({
      ...formData(),
      [e.target.name]: e.target.value,
    });

  const handleSave = async () => {
    console.log("💾 Kundendaten speichern:", formData());
    try {
      const response = await fetch("https://api.smartpages.online/api/customer/update", {
        method: "POST", // oder PATCH, falls du das in deiner API so verwendest
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData()),
      });

      if (!response.ok) throw new Error("Failed to save customer data");

      console.log("✅ Kundendaten erfolgreich gespeichert");
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
    }
    setShowModal(false);
  };

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang, "editTitle", "customer") || "Kundendaten bearbeiten"}
      </h2>

      {/* 🧾 Formularfelder */}
      <div class="space-y-4">
        {/* Vorname */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang, "firstName", "customer")}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData().firstName}
            onInput={handleInput}
            placeholder={t(lang, "firstName", "customer")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        {/* Nachname */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang, "lastName", "customer")}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData().lastName}
            onInput={handleInput}
            placeholder={t(lang, "lastName", "customer")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        {/* Tarif / Plan */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang, "plan", "customer")}
          </label>
          <input
            type="text"
            name="plan"
            value={formData().plan}
            onInput={handleInput}
            placeholder={t(lang, "plan", "customer")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>
      </div>

      {/* 🟧 Footer */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
        >
          {t(lang, "cancelButton", "system")}
        </button>
        <button
          class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg text-sm font-medium shadow hover:scale-105 transition"
          onClick={handleSave}
        >
          {t(lang, "saveButton", "system")}
        </button>
      </div>
    </ModalWrapper>
  );
}
