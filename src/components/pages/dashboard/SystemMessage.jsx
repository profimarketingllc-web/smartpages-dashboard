import { createSignal, onMount } from "solid-js";
import { systemMessages } from "~/utils/i18n/SystemMessages";

export default function SystemMessage() {
  const [title, setTitle] = createSignal("");
  const [text, setText] = createSignal("");

  onMount(() => {
    const user = window.SMARTPAGES_USER || {};
    const lang =
      user.language && ["de", "en"].includes(user.language)
        ? user.language
        : "en";

    const dashboardMessages =
      window.SMARTPAGES_I18N?.dashboard?.messages;

    /* ---------------------------------- */
    /* 1️⃣ Begrüßung (IMMER)               */
    /* ---------------------------------- */
    let greeting = "Welcome";

    if (dashboardMessages) {
      greeting = dashboardMessages.neutralGreeting;

      if (user.first_name) {
        greeting = dashboardMessages.personalized(user.first_name);
      } else if (user.company) {
        greeting = dashboardMessages.businessGreeting(user.company);
      }
    }

    setTitle(greeting);

    /* ---------------------------------- */
    /* 2️⃣ System / Marketing Message     */
    /* ---------------------------------- */
    let infoText = "";

    if (systemMessages?.active && systemMessages.items?.length) {
      const item = systemMessages.items[0]; // bewusst: nur eine Message

      infoText =
        item.text?.[lang] ||
        item.text?.en ||
        "";
    }

    setText(infoText);
  });

  return (
    <section class="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-6 py-4 text-sm text-blue-900">
      <strong class="block mb-1 font-semibold">
        {title()}
      </strong>
      {text() && <span>{text()}</span>}
    </section>
  );
}
