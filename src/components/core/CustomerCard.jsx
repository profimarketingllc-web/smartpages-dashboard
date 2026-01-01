import { createSignal, onMount } from "solid-js";

export function CustomerCard() {
  const [loading, setLoading] = createSignal(true);
  const [user, setUser] = createSignal(null);
  const [authorized, setAuthorized] = createSignal(false);

  onMount(async () => {
    try {
      const res = await fetch("https://api.smartpages.online/api/user/profile", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("unauthorized");

      const data = await res.json();
      if (data.ok && data.user) {
        setUser(data.user);
        setAuthorized(true);
      }
    } catch (err) {
      console.warn("⚠️ Nicht autorisiert:", err.message);
      setAuthorized(false);
    } finally {
      setLoading(false);
      document.getElementById("loader").classList.add("hidden");
      document.getElementById("dashboard-content").classList.remove("hidden");
    }
  });

  return (
    <div class="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3">
      <Show when={!loading()} fallback={<p>Lade Kundendaten...</p>}>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">
            Willkommen zurück,{" "}
            {authorized() && user()?.first_name
              ? `${user().first_name} ${user().last_name || ""}`
              : "Gast"}{" "}
            👋
          </h2>
          <span
            class={`px-4 py-1 rounded-full text-sm font-semibold ${
              authorized() ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
            }`}
          >
            {authorized() ? "Eingeloggt" : "Abgemeldet"}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-x-6 text-sm mt-2">
          <p>
            <strong>Name:</strong>{" "}
            {user()?.first_name || user()?.last_name
              ? `${user().first_name || ""} ${user().last_name || ""}`
              : "—"}
          </p>
          <p>
            <strong>Status:</strong> {user()?.status || "inactive"}
          </p>
          <p>
            <strong>Plan:</strong> {user()?.plan || "—"}
          </p>
          <p>
            <strong>Aktiv bis:</strong>{" "}
            {user()?.trial_end ? new Date(user().trial_end).toLocaleDateString("de-DE") : "—"}
          </p>
          <p>
            <strong>Letztes Login:</strong>{" "}
            {user()?.last_login
              ? new Date(user().last_login).toLocaleString("de-DE")
              : "—"}
          </p>
        </div>

        <div class="mt-4">
          <button class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition-transform">
            Kundendaten bearbeiten
          </button>
        </div>
      </Show>
    </div>
  );
}
