import { createResource, createSignal, onMount, onCleanup, Show } from "solid-js";
import { t } from "~/utils/i18n";

export default function ImprintCard(props) {
  const [lang, setLang] = createSignal(
    props.lang ||
      (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de")
  );

  const [useCustom, setUseCustom] = createSignal(false);
  const [customText, setCustomText] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal("");

  onMount(() => {
    if (!props.lang && typeof window !== "undefined") {
      setLang(window.location.pathname.includes("/en/") ? "en" : "de");
    }
  });

  // 🔗 Daten abrufen (über Core Worker Proxy)
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

  onMount(() => {
    const handler = () => {
      console.log("🔄 ImprintCard: Daten werden aktualisiert...");
      refetch();
    };
    window.addEventListener("refresh-imprint-data", handler);
    onCleanup(() => window.removeEventListener("refresh-imprint-data", handler));
  });

  const data = () => imprint() || {};
  const displayValue = (val) => (val && val !== "" ? val : "—");

  // 🔄 Toggle-Änderung speichern
  const handleToggle = async (e) => {
    const newVal = e.currentTarget.checked;
    setUseCustom(newVal);
    setMessage("");
    try {
      await fetch("/api/customer/imprintedit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ use_custom_imprint: newVal }),
      });
      console.log("Toggle gespeichert:", newVal);
    } catch (err) {
      console.error("Fehler beim Speichern des Toggles:", err);
    }
  };

  // 💾 Custom-Text speichern
  const handleSave = async () => {
    if (!customText().trim()) {
      setMessage("Bitte gib deinen Impressumstext ein.");
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
      const result = await res.json();
      if (result.ok) {
        setMessage("✅ Dein Impressum wurde gespeichert.");
      } else {
        setMessage("❌ Fehler: " + result.error);
      }
    } catch (err) {
      console.error("Fehler beim Speichern:", err);
      setMessage("❌ Unerwarteter Fehler beim Speichern.");
    }
    setSaving(false);
  };

  // 🧱 Layout
  return (
    <div class="relative w-full text-sm text-gray-700 px-7 md:px-9 py-5 bg-white rounded-2xl shadow-md">
      {/* 🔹 Titel & Toggle */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl md:text-2xl font-extrabold text-[#1E2A45]">
          {t(lang(), "title", "imprint")}
        </h2>

        {/* 🔘 Toggle */}
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <span class="text-gray-600">
            {useCustom() ? "Eigenes Impressum" : "Standard-Template"}
          </span>
          <input
            type="checkbox"
            checked={useCustom()}
            onChange={handleToggle}
            class="w-5 h-5 accent-[#1E2A45]"
          />
        </label>
      </div>

      {/* Wenn Custom deaktiviert ist → alte Karte */}
      <Show when={!useCustom()}>
        {/* 🟧 Bearbeiten-Button */}
        <div class="absolute top-4 right-8">
          <button
            onClick={() => window.dispatchEvent(new Event("open-imprint-modal"))}
            class="bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition-all duration-200"
          >
            {t(lang(), "button", "imprint")}
          </button>
        </div>

        {/* Standard-Imprint-Daten */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "company", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().company)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "contact", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().contact)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "street", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().street)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "number", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().hs_no)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "zip", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().zip)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "city", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().city)}</p>
          </div>
        </div>

        {/* 📞 Reihe 4 – Drei Spalten */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mt-4">
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "phone", "imprint")}</span>
            <p class="text-gray-500">{displayValue(data().phone)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "email", "imprint")} *</span>
            <p class="text-gray-500">{displayValue(data().email)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "vat", "imprint")}</span>
            <p class="text-gray-500">{displayValue(data().vat)}</p>
          </div>
        </div>

        {/* ⚖️ Reihe 5 – Registerdaten */}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-4">
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "registerCourt", "imprint")}</span>
            <p class="text-gray-500">{displayValue(data().registerCourt)}</p>
          </div>
          <div>
            <span class="font-medium text-gray-800">{t(lang(), "registerNumber", "imprint")}</span>
            <p class="text-gray-500">{displayValue(data().registerNumber)}</p>
          </div>
        </div>
      </Show>

      {/* Wenn Custom aktiv → Textfeld */}
      <Show when={useCustom()}>
        <textarea
          class="w-full h-48 p-3 border rounded-lg text-sm text-gray-700 mt-4"
          placeholder="Hier kannst du dein eigenes Impressum eingeben..."
          value={customText()}
          onInput={(e) => setCustomText(e.currentTarget.value)}
        />
        <div class="flex justify-end mt-4">
          <button
            disabled={saving()}
            onClick={handleSave}
            class={`px-5 py-2.5 rounded-lg text-white ${
              saving() ? "bg-gray-400" : "bg-[#1E2A45] hover:bg-[#2C3B5A]"
            }`}
          >
            {saving() ? "Speichert..." : "Speichern"}
          </button>
        </div>
        <Show when={message()}>
          <p class="mt-3 text-right text-sm text-gray-600">{message()}</p>
        </Show>
      </Show>
    </div>
  );
}
