import {
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import ModalWrapper from "./ModalWrapper";
import { t, useLang } from "~/utils/i18n/i18n";

export default function EditCustomerModal(props) {
  /* ----------------------------- */
  /* 🌍 Sprache                    */
  /* ----------------------------- */
  const [lang, setLang] = createSignal(props.lang || useLang("de"));

  /* ----------------------------- */
  /* 🧠 State                      */
  /* ----------------------------- */
  const [showModal, setShowModal] = createSignal(false);
  const [loading, setLoading] = createSignal(false);

  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [companyName, setCompanyName] = createSignal("");

  /* ----------------------------- */
  /* 🧭 Lifecycle                  */
  /* ----------------------------- */
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

  /* ----------------------------- */
  /* 📡 Fetch                      */
  /* ----------------------------- */
  const loadCustomer = async () => {
    try {
      const res = await fetch("/api/customer/customer", {
        credentials: "include",
      });
      const json = await res.json();
      const u = json?.data;

      if (!u) return;

      setFirstName(u.first_name || "");
      setLastName(u.last_name || "");
      setCompanyName(u.company_name || "");
    } catch {
      /* silent */
    }
  };

  /* ----------------------------- */
  /* 💾 Save                       */
  /* ----------------------------- */
  const save = async () => {
    setLoading(true);

    try {
      await fetch("/api/customer/customeredit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName(),
          lastName: lastName(),
          company_name: companyName(),
          is_business: companyName() ? 1 : 0,
        }),
      });

      window.dispatchEvent(new Event("refresh-customer-data"));
      setTimeout(() => setShowModal(false), 400);
    } catch {
      /* silent */
    }

    setLoading(false);
  };

  /* ----------------------------- */
  /* 🧱 Render                     */
  /* ----------------------------- */
  return (
    <ModalWrapper
      show={showModal()}
      onClose={() => setShowModal(false)}
      lang={lang()}
    >
      <h2 class="text-xl font-bold mb-4">
        {t(lang(), "dashboard", "customer", "editTitle")}
      </h2>

      <div class="space-y-3">
        <Field
          label={t(lang(), "dashboard", "customer", "company_name")}
          value={companyName()}
          onInput={setCompanyName}
        />

        <Field
          label={t(lang(), "dashboard", "customer", "firstName")}
          value={firstName()}
          onInput={setFirstName}
        />

        <Field
          label={t(lang(), "dashboard", "customer", "lastName")}
          value={lastName()}
          onInput={setLastName}
        />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="px-4 py-2 bg
