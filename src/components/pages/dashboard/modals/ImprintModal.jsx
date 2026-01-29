import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧾 EditImprintModal (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Einheitliches Design (wie vorher)
 * ✅ Korrekte i18n-Nutzung (dashboard / imprint / system)
 * ✅ Buttons + Footer wieder da
 * ✅ Kein undefined mehr
 */

export default function EditImprintModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal(null);

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

  // 🌍 Sprache
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }

    const openHandler = () => {
      setMessage(null);
      setShowModal(true);
      loadImprint();
    };

    window.addEventListener("open-imprint-modal", openHandler);
    onCleanup(() =>
      window.removeEventListener("open-imprint-modal", openHandler)
    );
  });

  // 🔄 Daten laden
  const loadImprint = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/imprint", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("load_failed");
      const result = await res.json();
      if (!result?.ok || !result.data) throw new Error("invalid_data");

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
    } catch {
      setMessage(t(lang(), "dashboard", "imprint", "loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Feld ändern
  const updateField = (key, value) =>
    setForm({ ...form(), [key]: value });

  // 💾 Speichern
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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

      const json = await res.json();
      if (!json.ok) throw new Error();

      setMessage(t(lang(), "dashboard", "imprint", "saveSuccess"));
      window.dispatchEvent(new Event("refresh-imprint-data"));
      setTimeout(() => setShowModal(false), 800);
    } catch {
      setMessage(t(lang(), "dashboard", "imprint", "saveError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      {/* 🧾 Titel */}
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "dashboard", "imprint", "editTitle")}
      </h2>

      {/* 🟡 Status */}
      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">
          {message()}
        </div>
      )}

      {/* 📋 Formular */}
      <div class="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
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
            keyName={key}
            required={required}
            value={form()[key]}
            label={`${t(lang(), "dashboard", "imprint", key)}${
              required ? " *" : ""
            }`}
            onInput={updateField}
          />
        ))}
      </div>

      {/* 🔘 Footer Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
          disabled={loading()}
        >
          {t(lang(), "dashboard", "system", "cancelButton")}
        </button>

        <button
          class={`px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform duration-200 ${
            loading()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white hover:scale-105"
          }`}
          onClick={handleSave}
          disabled={loading()}
        >
          {loading()
            ? t(lang(), "dashboard", "system", "saving")
            : t(lang(), "dashboard", "system", "saveButton")}
        </button>
      </div>
    </ModalWrapper>
  );
}

/* 🔹 Feld-Komponente */
function Field(props) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {props.label}
      </label>
      <input
        type="text"
        value={props.value}
        onInput={(e) =>
          props.onInput(props.keyName, e.target.value)
        }
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
      />
    </div>
  );
}
