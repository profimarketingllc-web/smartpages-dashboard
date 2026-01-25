import { createResource, createSignal, onMount, Show } from "solid-js";
import { t, useLang } from "~/utils/i18n/i18n";

/**
 * 🧾 ImprintCard (Dashboard)
 * -------------------------------------------------------
 * ✅ i18n-ready
 * ✅ Toggle für eigenes Impressum
 * ✅ Modal-Button
 * ✅ Sauberes Dashboard-Layout
 */

export default function ImprintCard(props) {
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
      console.error("❌ Fehler beim Laden des Impressums:", err);
      return {};
    }
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};
  const display = (v) => (v && v !== "" ? v : "—");

  // 🔄 Toggle
  const handleToggle = async (e) => {
    const active = e.currentTarget.checked;
    setUseCustom(active);
    setMessage("");

    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: active,
          custom_html: active ? customText() : "",
        }),
      });

      const json = await res.json();
      setMessage(
        json.ok
          ? active
            ? t(lang(), "dashboard", "imprint", "customEnabled") + " ✨"
            : t(lang(), "dashboard", "imprint", "customDisabled")
          : t(lang(), "dashboard", "imprint", "updateError")
      );

      if (json.ok) {
        window.dispatchEvent(new Event("refresh-imprint-data"));
      }
    } catch {
      setMessage(t(lang(), "dashboard", "imprint", "unexpectedError"));
    }
  };

  // 💾 Custom speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage(t(lang(), "dashboard", "imprint", "emptyText"));
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_custom_imprint: true,
          custom_html: customText(),
        }),
      });

      const json = await res.json();
      setMessage(
        json.ok
          ? t(lang(), "dashboard", "imprint", "saveSuccess") + " ✅"
          : t(lang(), "dashboard", "imprint", "saveError")
      );
    } catch {
      setMessage(t(lang(), "dashboard", "imprint", "unexpectedError"));
    }
    setSaving(false);
  };

  // 📋 Felddefinition (wichtig!)
  const fields = [
    "company",
    "contact",
    "street",
    "hs_no",
    "zip",
    "city",
    "country",
    "phone",
    "email",
    "vat",
    "registerCourt",
    "registerNumber",
  ];

  return (
    <div class="w-full text-sm text-gray-700 px-7 md:px-9 py-4 md:py-5 relative">
      {/* 🔹 Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          🧾 {t(lang(), "dashboard", "imprint", "title")}
        </h2>

        <Show when={!useCustom()}>
          <button
            onClick={() =>
              window.dispatchEvent(new Event("open-imprint-modal"))
            }
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "dashboard", "imprint", "button")}
          </button>
        </Show>
      </div>

      {/* ⚙️ Toggle */}
      <div class="mb-6 flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-lg border border-gray-300">
        <input
          id="toggle-imprint"
          type="checkbox"
          checked={useCustom()}
          onChange={handleToggle}
          class="w-5 h-5 accent-black cursor-pointer"
        />
        <label
          for="toggle-imprint"
          class="text-gray-800 text-sm font-medium cursor-pointer"
        >
          {t(lang(), "dashboard", "imprint", "useOwnImprint")}
        </label>
      </div>

      {/* ✍️ Eigener Text */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700"
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end mt-3">
          <button
            disabled={saving()}
            onClick={handleSave}
            class={`px-5 py-2.5 rounded-lg text-white ${
              saving()
                ? "bg-gray-400"
                : "bg-[#1E2A45] hover:bg-[#2C3B5A]"
            }`}
          >
            {saving()
              ? t(lang(), "dashboard", "system", "saving")
              : t(lang(), "dashboard", "system", "saveButton")}
          </button>
        </div>
      </Show>

      {/* 📄 Standard-Impressum */}
      <Show when={!useCustom()}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
          {fields.map((key) => (
            <div>
              <span class="font-medium text-gray-800">
                {t(lang(), "dashboard", "imprint", key)}
              </span>
              <p class="text-gray-500">{display(data()[key])}</p>
            </div>
          ))}
        </div>
      </Show>

      {/* 🟡 Status */}
      <Show when={message()}>
        <p class="mt-3 text-sm text-gray-600">{message()}</p>
      </Show>
    </div>
  );
}
