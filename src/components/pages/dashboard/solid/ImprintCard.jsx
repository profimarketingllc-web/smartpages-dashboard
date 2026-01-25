import { createResource, createSignal, onMount, onCleanup, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧠 ImprintCard (SmartPages v5.9)
 * -------------------------------------------------------
 * ✅ Dashboard-spezifische i18n (page = "dashboard")
 * ✅ Einheitliches API-Verhalten (/api/customer/imprint)
 * ✅ Sauberer Save-Flow (D1 / R2 via Worker)
 * ✅ Kompatibel mit Cloudflare + SSR
 */

export default function ImprintCard(props) {
  // 🌍 Sprachlogik (SSR-kompatibel)
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Daten abrufen
  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return {};

      const result = await res.json();
      if (!result?.ok || !result.data) return {};

      const i = result.data;
      setUseCustom(i.use_custom_imprint === 1);
      if (i.custom_html) setCustomText(i.custom_html);

      return {
        company: i.company_name || "—",
        contact: i.contact_name || "—",
        street: i.street || "—",
        hs_no: i.hs_no || "—",
        zip: i.postal_code || "—",
        city: i.city || "—",
        phone: i.phone || "—",
        email: i.email || "—",
        vat: i.tax_id || "—",
        registerCourt: i.register_court || "—",
        registerNumber: i.register_number || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden des Impressums:", err);
      return {};
    }
  };

  const [imprint, { refetch }] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const displayValue = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const newVal = e.currentTarget.checked;
    setUseCustom(newVal);
    setMessage("");

    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: newVal,
          imprint_template: "",
          custom_html: newVal ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setMessage(
          newVal
            ? t(lang(), "dashboard", "imprint", "customEnabled")
            : t(lang(), "dashboard", "imprint", "customDisabled")
        );
        window.dispatchEvent(new Event("refresh-imprint-data"));
      } else {
        setMessage(t(lang(),
