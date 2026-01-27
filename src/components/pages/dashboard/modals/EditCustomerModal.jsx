import { createSignal, onMount, onCleanup } from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

export default function EditCustomerModal(props) {
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  const [form, setForm] = createSignal({
    firstName: "",
    lastName: "",
    company_name: "",
  });

  onMount(() => {
    setLang(window.location.pathname.includes("/en/") ? "en" : "de");

    const openHandler = () => {
      setShowModal(true);
      loadCustomer();
    };

    window.addEventListener("open-customer-modal", openHandler);
    onCleanup(() =>
      window.removeEventListener("open-customer-modal", openHandler)
    );
  });

  const loadCustomer = async () => {
    const res = await fetch("/api/customer/customer", { credentials: "include" });
    const json = await res.json();
    if (json?.data) {
      setForm({
        firstName: json.data.first_name || "",
        lastName: json.data.last_name || "",
        company_name: json.data.company_name || "",
      });
    }
  };

  const save = async () => {
    setLoading(true);
    await fetch("/api/customer/customeredit", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form(),
        is_business: form().company_name ? 1 : 0,
      }),
    });
    window.dispatchEvent(new Event("refresh-customer-data"));
    setTimeout(() => setShowModal(false), 500);
    setLoading(false);
  };

  return (
    <ModalWrapper show={showModal()} onClose={() => setShowModal(false)} lang={lang()}>
      <h2 class="text-xl font-bold mb-4">
        {t(lang(), "dashboard", "customer", "editTitle")}
      </h2>

      <div class="space-y-3">
        {["company_name", "firstName", "lastName"].map((key) => (
          <div>
            <label class="block text-sm font-medium mb-1">
              {t(lang(), "dashboard", "customer", key)}
            </label>
            <input
              value={form()[key]}
              onInput={(e) => setForm({ ...form(), [key]: e.target.value })}
              class="w-full border rounded-lg px-3 py-2"
            />
          </div>
        ))}
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-200 rounded-lg"
          onClick={() => setShowModal(false)}
        >
          {t(lang(), "dashboard", "system", "cancelButton")}
        </button>
        <button
          onClick={save}
          disabled={loading()}
          class="px-5 py-2 bg-gradient-to-r from-[#F5B400] to-[#E47E00] text-white rounded-lg"
        >
          {loading()
            ? t(lang(), "dashboard", "system", "saving")
            : t(lang(), "dashboard", "system", "saveButton")}
        </button>
      </div>
    </ModalWrapper>
  );
}
