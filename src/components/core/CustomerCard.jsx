import { createSignal, onMount, Show } from "solid-js";

export default function CustomerCard() {
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [authorized, setAuthorized] = createSignal(false);

  // 🔹 Datenabruf vom Worker
  onMount(async () => {
    try {
      const response = await fetch("https://api.smartpages.online/api/user/profile", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.ok && data.user) {
        setUser(data.user);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      console.error("Fehler beim Laden des Benutzerprofils:", err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  });

  // 🔹 Anzeigeformat für Datum
  const formatDate = (dateStr) => {
    if (!dateStr) return "–";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "–";
    }
  };

  return (
    <div class="p-4 md:p-6">
      <Show when={!loading()} fallback={<p class="text-center text-gray-600 font-medium">Anmeldung wird geprüft...</p>}>
        <Show
          when={authorized() && user()}
          fallback={
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-xl font-semibold text-gray-800">
                  Willkommen zurück, Gast 👋
                </h2>
                <p class="text-sm text-gray-600 mt-1">
                  Status: <span class="text-gray-400">inactive</span>
                </p>
              </div>
              <div>
                <span class="bg-red-200 text-red-800 px-4 py-1.5 rounded-full text-sm font-medium">
                  Abgemeldet
                </span>
              </div>
            </div>
          }
        >
          {(user) => (
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 class="text-xl font-semibold text-gray-800">
                  Willkommen zurück, {user().first_name || "Gast"}{" "}
                  {user().last_name || ""} 👋
                </h2>
                <div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-sm text-gray-700">
                  <p>
                    <span class="font-medium text-gray-800">Plan:</span>{" "}
                    {user().plan || "Trial"}
                  </p>
                  <p>
                    <span class="font-medium text-gray-800">Status:</span>{" "}
                    {user().status || "inactive"}
                  </p>
                  <p>
                    <span class="font-medium text-gray-800">Aktiv bis:</span>{" "}
                    {formatDate(user().trial_end)}
                  </p>
                  <p>
                    <span class="font-medium text-gray-800">Letztes Login:</span>{" "}
                    {formatDate(user().last_login)}
                  </p>
                </div>
              </div>
              <div class="mt-4 md:mt-0 flex items-center gap-3">
                <span
                  class={`${
                    user().status === "active"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  } px-4 py-1.5 rounded-full text-sm font-medium`}
                >
                  {user().status === "active" ? "Eingeloggt" : "Abgemeldet"}
                </span>
                <button
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-medium shadow hover:opacity-90 transition"
                >
                  Kundendaten bearbeiten
                </button>
              </div>
            </div>
          )}
        </Show>
      </Show>
    </div>
  );
}
