import { createSignal, createResource, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

export default function PrivacyCard(props) {
  // 🌍 Sprachlogik (SSR-kompatibel)
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  const [useCustomPrivacy, setUseCustomPrivacy] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Datenschutz-Daten abrufen
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (!result?.ok || !result.data) return {};

      const p = result.data;
      setUseCustomPrivacy(p.use_custom_privacy === 1);
      if (p.custom_html) setCustomText(p.custom_html);

      return {
        company: p.company_name || "—",
        contact: p.contact_name || "—",
        street: p.street || "—",
        hs_no: p.hs_no || "—",
        postal_code: p.postal_code || "—",
        city: p.city || "—",
        country: p.country || "—",
        phone: p.phone || "—",
        email: p.email || "—",
      };
    } catch (err) {
      console.error("❌ Fehler beim Laden der Datenschutzerklärung:", err);
      return {};
    }
  };

  const [privacy, { refetch }] = createResource(fetchPrivacy);
  const data = () => privacy() || {};
  const display = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle speichern
  const handleToggle = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustomPrivacy(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          use_custom_privacy: active,
          privacy_template: "",
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      if (json.ok) {
        setMessage(
          active
            ? t(lang(), "dashboard", "privacy", "customEnabled")
            : t(lang(), "dashboard", "privacy", "customDisabled")
        );
        window.dispatchEvent(new Event("refresh-privacy-data"));
      } else {
        setMessage(
          t(lang(), "dashboard", "privacy", "updateError")
        );
      }
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
      setMessage(
        t(lang(), "dashboard", "privacy", "unexpectedError")
      );
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(
        t(lang(), "dashboard", "privacy", "emptyText")
      );
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          use_custom_privacy: true,
          custom_html: customText(),
        }),
      });

      const result = await res.json();
      setMessage(
        result.ok
          ? t(lang(), "dashboard", "privacy", "saveSuccess")
          : t(lang(), "dashboard", "privacy", "saveError")
      );
    } catch {
      setMessage(
        t(lang(), "dashboard", "privacy", "unexpectedError")
      );
    }
    setSaving(false);
  };

  // 🧱 Layout
  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 relative">
      {/* 🔹 Titel + Button */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t
