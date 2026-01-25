import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🔒 EditPrivacyModal (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Lädt & speichert Datenschutzdaten
 * ✅ i18n je Section ("privacy", "system")
 * ✅ SSR-sicher
 * ✅ feuert refresh-privacy-data nach Save
 */

export default function EditPrivacyModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal("");

  const [form, setForm] = createSignal({
    privacy_contact: "",
    email: "",
    phone: "",
    address: "",
    country: "",
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
      loadPrivacy();
    };

    window.addEventListener("open-privacy-modal", openHandler);
    onCleanup(() =>
      window.removeEventListener("open-privacy-modal", openHandler)
    );
  });

  // 🗂️ Daten laden
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
      if (!result?.ok || !result.data) {
        throw new Error("invalid_privacy_data");
      }

      const p = result.data;
      setForm({
        privacy_contact: p.privacy_contact || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
        country: p.country || "",
      });
    } catch (err) {
      console.error("❌ Fehler beim Laden der Datenschutzerklärung:", err);
      setMessage(t(lang(), "loadError", "privacy"));
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
      if (!result?.ok) throw new Error("save_failed");

      setMessage(t(lang(), "saveSuccess", "privacy"));
      window.dispatchEvent(new Event("refresh-privacy-data"));
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang(), "saveError", "privacy"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "editTitle", "privacy")}
      </h2>

      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">
          {message()}
        </div>
      )}

      <div class="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
        {[
          ["privacy_contact", true],
          ["email", true],
          ["phone", false],
          ["address", true],
          ["country", false],
        ].map(([key, required]) => (
          <Field
            key={key}
            label={`${t(lang(), key, "privacy")}${required ? " *" : ""}`}
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

// 🔹 Eingabefeld
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
