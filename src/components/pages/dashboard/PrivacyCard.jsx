import { createResource, createSignal, Show } from "solid-js";

export default function PrivacyCard(props) {
  const { t, system } = props;

  /* ----------------------------- */
  /* 🧠 State                      */
  /* ----------------------------- */
  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  /* ----------------------------- */
  /* 📡 Fetch                      */
  /* ----------------------------- */
  const fetchPrivacy = async () => {
    try {
      const res = await fetch("/api/customer/privacy", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return {};

      const json = await res.json();
      const p = json?.data;
      if (!p) return {};

      setUseCustom(p.use_custom_privacy === 1);
      if (p.custom_html) setCustomText(p.custom_html);

      return {
        privacy_contact: p.privacy_contact,
        email: p.email,
        phone: p.phone,
        address: p.address,
        country: p.country,
      };
    } catch {
      return {};
    }
  };

  const [privacy] = createResource(fetchPrivacy);
  const data = () => privacy() || {};

  /* ----------------------------- */
  /* 🔄 Actions                    */
  /* ----------------------------- */
  const toggleCustom = async (checked) => {
    setUseCustom(checked);
    setMessage("");

    try {
      const res = await fetch("/api/customer/privacyedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_privacy: checked,
          custom_html: checked ? customText() : "",
        }),
      });

      const json = await res.json();
      setMessage(
        json.ok
          ? checked
            ? t.customEnabled
            : t.customDisabled
