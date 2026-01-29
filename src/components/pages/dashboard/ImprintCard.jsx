import { createResource, createSignal, Show } from "solid-js";

/**
 * 🧾 ImprintCard (Dashboard)
 * -------------------------------------------------------
 * ✅ i18n via Props
 * ✅ Static-safe
 * ✅ Solid-only
 */

export default function ImprintCard(props) {
  const { t, system } = props;

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  // 📡 Daten laden
  const fetchImprint = async () => {
    try {
      const res = await fetch("/api/customer/imprint", {
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
        company: i.company_name,
        contact: i.contact_name,
        street: i.street,
        hs_no: i.hs_no,
        zip: i.postal_code,
        city: i.city,
        country: i.country,
        phone: i.phone,
        email: i.email,
        vat: i.tax_id,
        registerCourt: i.register_court,
        registerNumber: i.register_number,
      };
    } catch (err) {
      console.error("Imprint load error:", err);
      return {};
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = (
