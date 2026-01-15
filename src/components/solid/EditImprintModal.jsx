import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t } from "~/utils/i18n";

/**
 * 🧾 EditImprintModal (SmartPages v5-ready)
 * -------------------------------------------------------
 * ✅ nutzt Core Worker Proxy (/api/customer/imprint & /update)
 * ✅ sendet Session-Cookie (.smartpages.online)
 * ✅ feuert refresh-imprint-data nach erfolgreichem Save
 * ✅ i18n-kompatibel + einheitlicher Stil
 */

export default function EditImprintModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
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
        number: i.hs_no || "",
        zip: i.postal_code || "",
        city: i.city || "",
        phone: i.phone || "",
        email: i.support_email || "",
        vat: i.vat_id || "",
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
          address_addon: form().number,
          zip: form().zip,
          city: form().city,
          phone: form().phone,
          support_email: form().email,
          vat_id: form().vat,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!result?.ok) throw new Error(result?.error || "unknown");

      setMessage(t(lang, "saveSuccess", "imprint"));
      console.log("✅ Imprint erfolgreich gespeichert");

      // 🔁 Card neu laden
      window.dispatchEvent(new Event("refresh-imprint-data"));
      setTimeout(() => setShowModal(false), 600);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang, "saveError", "imprint"));
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
          ["company", "company"],
          ["contact", "contact"],
          ["street", "street"],
          ["number", "number"],
          ["zip", "zip"],
          ["city", "city"],
          ["phone", "phone"],
          ["email", "email"],
          ["vat", "vat"],
        ].map(([key, labelKey]) => (
          <Field
            label={t(lang, labelKey, "imprint")}
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
            ? t(lang, "saving", "system")
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
