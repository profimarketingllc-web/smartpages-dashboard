import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧾 EditImprintModal (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Lädt & speichert Impressumsdaten
 * ✅ i18n je Section ("imprint", "system")
 * ✅ SSR-sicher
 * ✅ feuert refresh-imprint-data nach Save
 */

export default function EditImprintModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal("");

  const [form, setForm] = createSignal({
    company: "",
    contact: "",
    street: "",
    hs_no: "",
    zip: "",
    city: "",
    phone: "",
    email: "",
    vat: "",
    registerCourt: "",
    registerNumber: "",
  });

  // 🌍 Sprache (SSR-sicher)
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }

    const openHandler = () => {
      setMessage("");
      setShowModal(true);
      loadImprint();
    };

    window.addEventListener("open-imprint-modal", openHandler);
    onCleanup(() =>
      window.removeEventListener("open-imprint-modal", openHandler)
    );
  });

  // 🗂️ Daten laden
  const loadImprint = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/imprint", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!result?.ok || !result.data) {
        throw new Error("invalid_imprint_data");
      }

      const i = result.data;
      setForm({
        company: i.company_name || "",
        contact: i.contact_name || "",
        street: i.street || "",
        hs_no: i.hs_no || "",
        zip: i.postal_code || "",
        city: i.city || "",
        phone: i.phone || "",
        email: i.email || "",
        vat: i.tax_id || "",
        registerCourt: i.register_court || "",
        registerNumber: i.register_number || "",
      });
    } catch (err) {
      console.error("❌ Fehler beim Laden des Impressums:", err);
      setMessage(t(lang(), "loadError", "imprint"));
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Feld aktualisieren
  const updateField = (key, value) =>
    setForm({ ...form(), [key]: value });

  // 💾 Speichern
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          company_name: form().company,
          contact_name: form().contact,
          street: form().street,
          hs_no: form().hs_no,
          postal_code: form().zip,
          city: form().city,
          phone: form().phone,
          email: form().email,
          tax_id: form().vat,
          register_court: form().registerCourt,
          register_number: form().registerNumber,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!result?.ok) throw new Error("save_failed");

      setMessage(t(lang(), "saveSuccess", "imprint"));
      window.dispatchEvent(new Event("refresh-imprint-data"));
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang(), "saveError", "imprint"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "editTitle", "imprint")}
      </h2>

      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">
          {message()}
        </div>
      )}

      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {[
          ["company", true],
          ["contact", true],
          ["street", true],
          ["hs_no", true],
          ["zip", true],
          ["city", true],
          ["phone", false],
          ["email", true],
          ["vat", false],
          ["registerCourt", false],
          ["registerNumber", false],
        ].map(([key, required]) => (
          <Field
            key={key}
            label={`${t(lang(), key, "imprint")}${required ? " *" : ""}`}
            value={form()[key]}
            onInput={(val) => updateField(key, val)}
          />
        ))}
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          onClick={handleClose}
          disabled={loading()}
        >
          {t(lang(), "cancelButton", "system")}
        </button>

        <button
          class={`px-5 py-2 rounded-lg text-sm font-medium text-white ${
            loading()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] hover:scale-105"
          }`}
          onClick={handleSave}
          disabled={loading()}
        >
          {loading()
            ? t(lang(), "saving", "system")
            : t(lang(), "saveButton", "system")}
        </button>
      </div>
    </ModalWrapper>
  );
}

// 🔹 Feld-Komponente
function Field(props) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {props.label}
      </label>
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(e.target.value)}
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
      />
    </div>
  );
}
