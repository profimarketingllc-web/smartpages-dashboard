import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🔒 EditPrivacyModal (SmartPages v5.8)
 * -------------------------------------------------------
 * ✅ i18n-System integriert (~/utils/i18n/i18n)
 * ✅ SSR-sicher
 * ✅ lädt / speichert korrekt via API
 * ✅ feuert refresh-privacy-data nach Save
 */

export default function EditPrivacyModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [form, setForm] = createSignal({
    privacy_contact: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [message, setMessage] = createSignal(null);

  // 🌍 SSR-kompatible Sprache
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }

    const openHandler = () => {
      console.log("🟢 open-privacy-modal empfangen");
      setMessage(null);
      setShowModal(true);
      loadPrivacy();
    };
    window.addEventListener("open-privacy-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-privacy-modal", openHandler));
  });

  // 🗂️ Datenschutz-Daten laden
  const loadPrivacy = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/privacy", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!result?.ok || !result.data) throw new Error("Invalid privacy data");

      const i = result.data;
      setForm({
        privacy_contact: i.privacy_contact || "",
        email: i.email || "",
        phone: i.phone || "",
        address: i.address || "",
        country: i.country || "",
      });
      console.log("📥 Privacy-Daten erfolgreich geladen:", i);
    } catch (err) {
      console.warn("⚠️ Fehler beim Laden der Privacy-Daten:", err);
      setMessage(t(lang(), "loadError", "privacy") || "Fehler beim Laden der Daten.");
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

      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          privacy_contact: form().privacy_contact,
          email: form().email,
          phone: form().phone,
          address: form().address,
          country: form().country,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!result?.ok) throw new Error(result?.error || "unknown");

      console.log("✅ Privacy erfolgreich gespeichert");
      setMessage(t(lang(), "saveSuccess", "privacy") || "Gespeichert.");

      // 🔁 Card aktualisieren
      window.dispatchEvent(new Event("refresh-privacy-data"));
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang(), "saveError", "privacy") || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "editTitle", "privacy") ||
          "Datenschutzerklärung bearbeiten"}
      </h2>

      {/* 🟡 Statusmeldung */}
      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">{message()}</div>
      )}

      {/* Formularfelder */}
      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {[
          ["privacy_contact", true],
          ["email", true],
          ["phone", false],
          ["address", true],
          ["country", false],
        ].map(([key, required]) => (
          <Field
            label={`${t(lang(), key, "privacy")}${required ? " *" : ""}`}
            keyName={key}
            value={form()[key]}
            onInput={updateField}
          />
        ))}
      </div>

      {/* 🔘 Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
          disabled={loading()}
        >
          {t(lang(), "cancelButton", "system")}
        </button>
        <button
          class={`px-5 py-2 rounded-lg text-sm font-medium shadow transition-transform duration-200 will-change-transform ${
            loading()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white hover:scale-105"
          }`}
          onClick={handleSave}
          disabled={loading()}
        >
          {loading()
            ? t(lang(), "saving", "system") || "Speichert..."
            : t(lang(), "saveButton", "system") || "Speichern"}
        </button>
      </div>
    </ModalWrapper>
  );
}

// 🔹 Wiederverwendbares Eingabefeld
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

