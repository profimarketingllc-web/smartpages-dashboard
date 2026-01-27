import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🔒 EditPrivacyModal (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Seitenbasierte i18n (dashboard / privacy)
 * ✅ Saubere Feldlabels
 * ✅ Footer-Buttons wieder da
 * ✅ Einheitlich zum ImprintModal
 */

export default function EditPrivacyModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal(null);

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
      setMessage(null);
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

      const json = await res.json();
      if (!json?.ok || !json.data) throw new Error("invalid_data");

      const p = json.data;
      setForm({
        privacy_contact: p.privacy_contact || "",
        email: p.email || "",
        phone: p.phone || "",
        address: p.address || "",
        country: p.country || "",
      });
    } catch (err) {
      console.error("❌ Fehler beim Laden:", err);
      setMessage(t(lang(), "dashboard", "privacy", "loadError"));
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Eingabe aktualisieren
  const updateField = (key, value) =>
    setForm({ ...form(), [key]: value });

  // 💾 Speichern
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          privacy_contact: form().privacy_contact,
          email: form().email,
          phone: form().phone,
          address: form().address,
          country: form().country,
        }),
      });

      const json = await res.json();
      if (!json?.ok) throw new Error("save_failed");

      setMessage(t(lang(), "dashboard", "privacy", "saveSuccess"));
      window.dispatchEvent(new Event("refresh-privacy-data"));
      setTimeout(() => setShowModal(false), 700);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(t(lang(), "dashboard", "privacy", "saveError"));
    } finally {
      setLoading(false);
    }
  };

  // ❌ Modal schließen
  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "dashboard", "privacy", "editTitle")}
      </h2>

      {/* 🟡 Statusmeldung */}
      {message() && (
        <div class="text-sm mb-3 text-[#E47E00] font-medium">
          {message()}
        </div>
      )}

      {/* Formular */}
      <div class="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
        {[
          ["privacy_contact", true],
          ["email", true],
          ["phone", false],
          ["address", true],
          ["country", false],
        ].map(([key, required]) => (
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {t(lang(), "dashboard", "privacy", key)}
              {required ? " *" : ""}
            </label>
            <input
              type="text"
              value={form()[key]}
              onInput={(e) =>
                updateField(key, e.currentTarget.value)
              }
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
            />
          </div>
        ))}
      </div>

      {/* 🔘 Buttons */}
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
