import { createSignal, onMount } from "solid-js";

export default function ImprintCard() {
  const [imprint, setImprint] = createSignal({});
  const [authenticated, setAuthenticated] = createSignal(false);

  // Sprache erkennen (basierend auf URL)
  const lang = window.location.pathname.startsWith("/de") ? "de" : "en";

  const t = {
    de: {
      title: "Impressumsangaben",
      company: "Unternehmen",
      contact: "Ansprechpartner",
      address_addon: "Zusatz",
      street: "Straße & Nr.",
      city: "PLZ / Ort",
      email: "E-Mail",
      vat: "USt-ID",
      button: "Impressum bearbeiten",
    },
    en: {
      title: "Imprint Information",
      company: "Company Name",
      contact: "Contact Person",
      address_addon: "Address Addon",
      street: "Street & No.",
      city: "ZIP / City",
      email: "Email",
      vat: "VAT-ID",
      button: "Edit Imprint",
    },
  };
  const text = t[lang];

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

        const imprintRes = await fetch("https://api.smartpages.online/api/imprint/get", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        const imprintData = await imprintRes.json();

        if (imprintData.ok && imprintData.imprint) {
          setImprint(imprintData.imprint);
        }
      }
    } catch (err) {
      console.warn("Impressumsdaten konnten nicht geladen werden:", err);
    }
  });

  const Placeholder = () => (
    <span class="inline-block bg-gray-100 text-transparent rounded-full px-3 py-1 min-w-[100px] select-none">
      —
    </span>
  );

  return (
    <section class="max-w-6xl mx-auto bg-gray-50 border border-gray-200 shadow-lg rounded-3xl p-6 mt-4 transition-opacity duration-700">
      <h2 class="text-xl font-semibold mb-3 text-[#1E2A45]">{text.title}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-gray-700">
        <p>
          <span class="font-semibold">{text.company}:</span>{" "}
          {authenticated() ? imprint().company_name || <Placeholder /> : <Placeholder />}
        </p>
        <p>
          <span class="font-semibold">{text.contact}:</span>{" "}
          {authenticated() ? imprint().contact_name || <Placeholder /> : <Placeholder />}
        </p>
        <p class="md:col-span-2">
          <span class="font-semibold">{text.address_addon}:</span>{" "}
          {authenticated() ? imprint().address_addon || <Placeholder /> : <Placeholder />}
        </p>
        <p>
          <span class="font-semibold">{text.street}:</span>{" "}
          {authenticated() ? imprint().street || <Placeholder /> : <Placeholder />}
        </p>
        <p>
          <span class="font-semibold">{text.city}:</span>{" "}
          {authenticated()
            ? `${imprint().zip || ""} ${imprint().city || ""}`
            : <Placeholder />}
        </p>
        <p>
          <span class="font-semibold">{text.email}:</span>{" "}
          {authenticated() ? imprint().support_email || <Placeholder /> : <Placeholder />}
        </p>
        <p>
          <span class="font-semibold">{text.vat}:</span>{" "}
          {authenticated() ? imprint().vat_id || <Placeholder /> : <Placeholder />}
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
    </section>
  );
}
