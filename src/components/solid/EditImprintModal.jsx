import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t } from "~/utils/i18n";

/**
 * EditImprintModal.jsx
 * -------------------------------------------------------
 * ✅ nutzt globale i18n-Übersetzungen
 * ✅ SSR-sicher (Middleware-kompatibel)
 * ✅ reagiert auf Dashboard-Signale (open-imprint-modal)
 * ✅ einheitlicher Stil & API-Verhalten
 */

export default function EditImprintModal(props) {
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

  // 🌍 Sprache über Props oder URL (Fallback)
  const lang =
    props.lang ||
    (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

  // 🧭 Eventlistener für Modal öffnen
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-imprint-modal empfangen");
      setShowModal(true);
      loadImprint();
    };
    window.addEventListener("open-imprint-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-imprint-modal", openHandler));
  });

  // 🗂️ API: Imprint laden
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

  // ✏️ Feldänderung
  const updateField = (key, value) => setForm({ ...form(), [key]: value });

  // 💾 Speichern
  const handleSave = async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/imprint", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form()),
      });

      if (!res.ok) throw new Error("API error");

      alert(t(lang, "success", "imprint"));
      setShowModal(false);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      alert(t(lang, "error", "imprint"));
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang, "editTitle", "imprint")}
      </h2>

      {/* Formular */}
      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {["company", "contact", "street", "number", "zip", "city", "phone", "email", "vat"].map(
          (key) => (
            <Field
              label={t(lang, key, "imprint")}
              keyName={key}
              value={form()[key]}
              onInput={updateField}
            />
          )
        )}
      </div>

      {/* Buttons */}
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

// 🔹 Reusable Input Field
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
