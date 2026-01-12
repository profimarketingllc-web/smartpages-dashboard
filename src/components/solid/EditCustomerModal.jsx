import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t } from "~/utils/i18n";

/**
 * 🧱 EditCustomerModal (SmartPages v5-ready)
 * -------------------------------------------------------
 * ✅ Proxy über Core Worker (/api/customer/update)
 * ✅ Sicher mit Cookies (credentials: "include")
 * ✅ Visuelles Feedback + Event zum Refresh der CustomerCard
 */

export default function EditCustomerModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [formData, setFormData] = createSignal({ firstName: "", lastName: "" });
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);

  const lang =
    props.lang ||
    (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

  // 🟢 Dashboard-Event zum Öffnen empfangen
  onMount(() => {
    const openHandler = () => {
      console.log("🟢 open-customer-modal empfangen");
      setShowModal(true);
      setError("");
      setSuccess(false);
    };
    window.addEventListener("open-customer-modal", openHandler);
    onCleanup(() => window.removeEventListener("open-customer-modal", openHandler));
  });

  const handleClose = () => {
    setShowModal(false);
    setError("");
    setSuccess(false);
  };

  const handleInput = (e) => setFormData({ ...formData(), [e.target.name]: e.target.value });

  // 💾 Daten speichern
  const handleSave = async () => {
    console.log("💾 Kundendaten speichern:", formData());
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("https://api.smartpages.online/api/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // sorgt dafür, dass das Session-Cookie (.smartpages.online) mitgesendet wird
        body: JSON.stringify(formData()),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Nicht eingeloggt");
        throw new Error(`API-Fehler (${res.status})`);
      }

      const result = await res.json();
      if (!result?.ok) throw new Error(result.error || "Unbekannter Fehler");

      console.log("✅ Kundendaten erfolgreich gespeichert");
      setSuccess(true);

      // 🔄 CustomerCard soll sofort aktualisiert werden:
      window.dispatchEvent(new Event("refresh-customer-data"));

      // ⏳ nach kurzer Pause schließen
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setError(err.message || "Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang, "editTitle", "customer")}
      </h2>

      {/* 🔸 Formular */}
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

        {/* ⚠️ Fehleranzeige */}
        {error() && (
          <p class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
            {error()}
          </p>
        )}

        {/* ✅ Erfolg */}
        {success() && (
          <p class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
            {t(lang, "savedMessage", "system") || "Gespeichert!"}
          </p>
        )}
      </div>

      {/* 🔘 Buttons */}
      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition"
          onClick={handleClose}
          disabled={loading()}
        >
          {t(lang, "cancelButton", "system")}
        </button>
        <button
          class={`px-5 py-2 rounded-lg text-sm font-medium shadow transition ${
            loading()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white hover:scale-105"
          }`}
          onClick={handleSave}
          disabled={loading()}
        >
          {loading()
            ? t(lang, "saving", "system") || "Speichern..."
            : t(lang, "saveButton", "system") || "Speichern"}
        </button>
      </div>
    </ModalWrapper>
  );
}
