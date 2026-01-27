---
export const prerender = false;

import PageLayout from "~/layouts/PageLayout.astro";
import billingI18n from "~/utils/i18n/billing";

const lang = Astro.locals?.language || "de";
const t = billingI18n[lang];
---

<PageLayout title={t.title} sidebar header lang={lang}>
  <main class="max-w-5xl mx-auto px-4 mt-8 mb-24">

    <section class="mb-10">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2">
        {t.title}
      </h1>
      <p class="text-lg text-gray-600">
        {t.subtitle}
      </p>
    </section>

    <section
      class="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center"
    >
      <p class="text-gray-500 text-base">
        {t.comingSoon}
      </p>
    </section>

  </main>
</PageLayout>
