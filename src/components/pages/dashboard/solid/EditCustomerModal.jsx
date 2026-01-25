import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧱 EditCustomerModal (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Dashboard-spezifische i18n (page = "dashboard")
 * ✅ Lädt & speichert Kundendaten (GET + POST)
 * ✅ SSR-sicher
 */

export default function EditCustomerModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    company_name: "",
    is_business: 0,
  });
  const [loading, setLoading] = createSignal(false);
  const [dataLoaded, setDataLoaded] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);

  // 🌍 Sprache bestimmen
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }

    const openHandler = async () => {
      setShowModal(true);
      setError("");
      setSuccess(false);
      setDataLoaded(false);
      loadCustomerData();
    };

    window.addEventListener("open-customer-modal", openHandler);
    onCleanup(() =>
      window.removeEventListener("open-customer-modal", openHandler)
    );
  });

  // 🧠 Kundendaten laden
  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/customer/customer", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.ok || !json.data) throw new Error("no_customer_data");

      const data = json.data;
      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        company_name: data.company_name || "",
        is_business: data.is_business || 0,
      });

      setDataLoaded(true);
    } catch (err) {
      console.error("❌ Fehler beim Laden:", err);
      setError(
        t(lang(), "dashboard", "customer", "loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Eingabe
  const handleInput = (e) =>
    setFormData({ ...formData(), [e.target.name]: e.target.value });

  // 💾 Speichern
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        ...formData(),
        is_business: formData().company_name.trim() !== "" ? 1 : 0,
      };

      const res = await fetch("/api/customer/customeredit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const result = await res.json();
      if (!result?.ok) throw new Error("save_failed");

      setSuccess(true);
      window.dispatchEvent(new Event("refresh-customer-data"));
      setTimeout(() => setShowModal(false), 800);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setError(
        t(lang(), "dashboard", "system", "error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // 🧱 UI
  return (
    <ModalWrapper show={showModal()} onClose={handleClose} lang={lang()}>
      <h2 class="text-xl font-bold text-[#1E2A45] mb-4">
        {t(lang(), "dashboard", "customer", "editTitle")}
      </h2>

      {/* ❌ Fehler */}
      {error() && (
        <p class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error()}
        </p>
      )}

      {/* Formular */}
      <div class="space-y-4 mt-3">
        {/* Firma */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang(), "dashboard", "imprint", "company")}
          </label>
          <input
            type="text"
            name="company_name"
            value={formData().company_name}
            onInput={handleInput}
            placeholder={t(lang(), "dashboard", "imprint", "company")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        {/* Vorname */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang(), "dashboard", "customer", "firstName")} *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData().firstName}
            onInput={handleInput}
            placeholder={t(lang(), "dashboard", "customer", "firstName")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>

        {/* Nachname */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {t(lang(), "dashboard", "customer", "lastName")} *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData().lastName}
            onInput={handleInput}
            placeholder={t(lang(), "dashboard", "customer", "lastName")}
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E47E00]"
          />
        </div>
      </div>

      {/* ✅ Erfolg */}
      {success() && (
        <p class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2 mt-3">
          {t(lang(), "dashboard", "system", "success")}
        </p>
      )}

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
            loading() || !dataLoaded()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white hover:scale-105"
          }`}
          onClick={handleSave}
          disabled={loading() || !dataLoaded()}
        >
          {loading()
            ? t(lang(), "dashboard", "system", "saving")
            : t(lang(), "dashboard", "system", "saveButton")}
        </button>
      </div>
    </ModalWrapper>
  );
}
