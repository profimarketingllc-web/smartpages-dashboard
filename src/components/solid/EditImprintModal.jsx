import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t } from "~/utils/i18n";

/**
 * 🧾 EditImprintModal (SmartPages v5.3)
 * -------------------------------------------------------
 * ✅ nutzt Core Worker Proxy (/api/customer/imprint & /update)
 * ✅ sendet Session-Cookie (.smartpages.online)
 * ✅ feuert refresh-imprint-data nach erfolgreichem Save
 * ✅ enthält hs_no, register_court & register_number
 * ✅ Pflichtfelder klar markiert (*)
 */

export default function EditImprintModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
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
  const [message, setMessage] = createSignal(null);

  // 🌍 Sprache bestimmen
  const lang =
    props.lang ||
    (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

  // 🧭 Modal öffnen (vom Dashboard-Button getriggert)
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-imprint-modal empfangen");
      setMessage(null);
      setShowModal(true);
      loadImprint();
    };
    window.addEventListener("open-imprint-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-imprint-modal", openHandler));
  });

  // 🗂️ Aktuelle Imprint-Daten laden (über Core Worker)
  const loadImprint = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/imprintedit", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("API response not OK");

      const result = await res.json();
      if (!result?.ok || !result.data) throw new Error("Invalid imprint data");

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
      console.warn("⚠️ Konnte Imprint-Daten nicht laden:", err);
      setMessage(t(lang, "loadError", "imprint"));
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Eingaben aktualisieren
  const updateField = (key, value) => setForm({ ...form(), [key]: value });

  // 💾 Änderungen speichern
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("https://api.smartpages.online/api/customer/imprint/update", {
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
      if (!result?.ok) throw new Error(result?.error || "unknown");

      setMessage(t(lang, "success", "imprint"));
      console.log("✅ Imprint erfolgreich gespeichert");

      // 🔁 Card neu laden
      window.dispatchEvent(new Event("refresh-imprint-data"));
      setTimeout(() => setShowModal(false), 600);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang, "error", "imprint"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang, "editTitle", "imprint")}
      </h2>

      {/* 🟡 Statusmeldung */}
      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">{message()}</div>
      )}

      {/* Formular */}
      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {[
          ["company", "company", true],
          ["contact", "contact", true],
          ["street", "street", true],
          ["hs_no", "number", true],
          ["zip", "zip", true],
          ["city", "city", true],
          ["phone", "phone", false],
          ["email", "email", true],
          ["vat", "vat", false],
          ["registerCourt", "registerCourt", false],
          ["registerNumber", "registerNumber", false],
        ].map(([key, labelKey, required]) => (
          <Field
            label={`${t(lang, labelKey, "imprint")}${required ? " *" : ""}`}
            keyName={key}
            value={form()[key]}
            onInput={updateField}
          />
        ))}
      </div>

      {/* Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
          disabled={loading()}
        >
          {t(lang, "cancelButton", "system")}
        </button>
        <button
          class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg text-sm font-medium shadow hover:scale-105 transition"
          onClick={handleSave}
          disabled={loading()}
        >
          {loading()
            ? t(lang, "loading", "system")
            : t(lang, "saveButton", "system")}
        </button>
      </div>
    </ModalWrapper>
  );
}

// 🔹 Reusable Input Field
function Field(props) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {props.label}
      </label>
      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(props.keyName, e.target.value)}
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
      />
    </div>
  );
}
