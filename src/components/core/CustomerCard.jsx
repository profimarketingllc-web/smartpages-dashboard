import { createSignal, onMount } from "solid-js";

export default function CustomerCard() {
  const [user, setUser] = createSignal({
    first_name: "",
    last_name: "",
    plan: "",
    status: "",
    active_until: "",
    last_login: "",
  });
  const [authenticated, setAuthenticated] = createSignal(false);

  // 🌍 Sprache erkennen
  const lang = window.location.pathname.startsWith("/de") ? "de" : "en";

  // 🗣️ Mehrsprachige Texte
  const t = {
    de: {
      title: "Kundendaten",
      name: "Name",
      plan: "Tarif",
      status: "Status",
      active_until: "Aktiv bis",
      last_login: "Letzter Login",
      button: "Profil bearbeiten",
      logged_in: "Angemeldet",
      logged_out: "Abgemeldet",
    },
    en: {
      title: "Customer Information",
      name: "Name",
      plan: "Plan",
      status: "Status",
      active_until: "Active until",
      last_login: "Last login",
      button: "Edit profile",
      logged_in: "Logged in",
      logged_out: "Logged out",
    },
  };
  const text = t[lang];

  // 🧩 Daten & Auth prüfen
  onMount(async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (data.ok && data.user) {
        setAuthenticated(true);
        setUser({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          plan: data.user.plan || "",
          status: data.user.status || "",
          active_until: data.user.trial_end || "—",
          last_login: data.user.last_login || "—",
        });
      }
    } catch (err) {
      console.warn("Kundendaten konnten nicht geladen werden:", err);
    }
  });

  // 💎 Platzhalter-Stil
  const Placeholder = () => (
    <span class="inline-block bg-gray-100 text-transparent rounded-full px-3 py-1 min-w-[100px] select-none">
      —
    </span>
  );

  return (
    <section class="max-w-6xl mx-auto bg-gray-50 border border-gray-200 shadow-lg rounded-3xl p-6 mt-0 transition-opacity duration-700">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div class="w-full">
          <h2 class="text-xl font-semibold mb-3 text-[#1E2A45]">{text.title}</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-2 text-sm text-gray-700">
            <p>
              <span class="font-semibold">{text.name}:</span>{" "}
              {authenticated()
                ? `${user().first_name} ${user().last_name}` || <Placeholder />
                : <Placeholder />}
            </p>
            <p>
              <span class="font-semibold">{text.plan}:</span>{" "}
              {authenticated() ? user().plan || <Placeholder /> : <Placeholder />}
            </p>
            <p>
              <span class="font-semibold">{text.status}:</span>{" "}
              {authenticated() ? user().status || <Placeholder /> : <Placeholder />}
            </p>
            <p>
              <span class="font-semibold">{text.active_until}:</span>{" "}
              {authenticated() ? user().active_until || <Placeholder /> : <Placeholder />}
            </p>
            <p>
              <span class="font-semibold">{text.last_login}:</span>{" "}
              {authenticated() ? user().last_login || <Placeholder /> : <Placeholder />}
            </p>
          </div>

          <div class="flex justify-center mt-4">
            <button
              class="px-5 py-2.5 rounded-xl font-medium text-white shadow-md 
                     bg-gradient-to-r from-[#F5B400] to-[#E47E00]
                     hover:from-[#E8A800] hover:to-[#D16B00]
                     focus:ring-2 focus:ring-offset-2 focus:ring-[#F5B400]
                     transition-all duration-200 disabled:opacity-60"
              disabled={!authenticated()}
            >
              {text.button}
            </button>
          </div>
        </div>

        {/* 🔵 Status Pill */}
        <div class="mt-4 md:mt-0 md:ml-6">
          <span
            class={`inline-block px-4 py-1 text-sm rounded-full border font-medium min-w-[110px] text-center ${
              authenticated()
                ? "bg-[#C8F3C1] text-[#1E2A45] border-[#B1E6AA]"
                : "bg-[#F3C1C1] text-[#1E2A45] border-[#E6AAAA]"
            }`}
          >
            {authenticated() ? text.logged_in : text.logged_out}
          </span>
        </div>
      </div>
    </section>
  );
}
