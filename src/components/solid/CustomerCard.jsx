---
import PageLayout from "~/layouts/PageLayout.astro";
import "~/styles/global.css";
import CustomerCard from "@/components/solid/CustomerCard.jsx";
import ImprintCard from "@/components/solid/ImprintCard.jsx";
import ProductGrid from "@/components/ui/ProductGrid.astro"; // Marketing cards (SmartProfile etc.)

// Server-side session (optional)
let authenticated = false;
try {
  const cookie = Astro.request.headers.get("cookie") || "";
  if (cookie.includes("session=")) {
    const res = await fetch("https://api.smartpages.online/api/session", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookie,
      },
      credentials: "include",
    });
    const data = await res.json();
    authenticated = data?.ok && data?.authenticated;
  }
} catch (err) {
  console.warn("Session check failed:", err);
}
---

<PageLayout title="Dashboard – SmartPages" sidebar={true} header={true}>
  <main class="pb-12">
    <!-- 💬 Welcome Message -->
    <div class="max-w-6xl mx-auto flex justify-end mt-3 mb-2">
      <div
        class="bg-[#4E6BFF] text-white font-medium px-6 py-2.5 rounded-2xl shadow-md text-sm
               hover:scale-[1.02] transition-all duration-300"
      >
        Welcome to the SmartCenter 👋
      </div>
    </div>

    <!-- 🧭 Customer Data -->
    <section class="max-w-6xl mx-auto bg-gray-50 border border-gray-200 shadow-lg rounded-3xl p-6">
      <CustomerCard />
    </section>

    <!-- 🧾 Imprint Data -->
    <section class="max-w-6xl mx-auto bg-gray-50 border border-gray-200 shadow-lg rounded-3xl p-6 mt-4">
      <ImprintCard />
    </section>

    <!-- 🧱 Product Grid (Marketing section) -->
    <ProductGrid />
  </main>
</PageLayout>

<style>
main {
  scroll-margin-top: 1.5rem;
}

section {
  margin-top: 1.25rem !important;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}

section h2 {
  line-height: 1.2;
}

section p {
  line-height: 1.4;
}

.grid p {
  margin-bottom: 0.25rem;
}
</style>
