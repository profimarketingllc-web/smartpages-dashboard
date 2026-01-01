import { createSignal, onMount, Show } from "solid-js";

/**
 * CustomerCard.jsx
 * ---------------
 * Vollständiges Replacement für die Dashboard-Kundenkarte.
 * Zeigt dynamisch den Status (angemeldet / abgemeldet) an
 * und lädt automatisch Kundendaten, falls Token vorhanden ist.
 * Funktioniert auch als Fallback ohne gültige Session.
 */

export default function CustomerCard() {
  // Lokale States für Benutzer- und Authentifizierungsstatus
  const [user, setUser] = createSignal(null);
  const [status, setStatus] = createSignal("checking"); // "checking" | "unauthorized" | "active"

  // Prüft Authentifizierung über Core Worker
  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/start", {
        credentials: "include",
      });

      // Kein gültiger Token vorhanden
      if (res.status === 401) {
        setStatus("unauthorized");
        return;
      }

      // Gültige Antwort
      const data = await res.json();

      if (res.ok && data.ok && data.user) {
        setUser(data.user);
        setStatus("active");
      } else {
        setStatus("unauthorized");
      }
    } catch (err) {
      console.warn("Auth check failed:", err);
      setStatus("unauthorized");
    }
  }

  // Läuft beim Laden der Komponente automatisch
  onMount(checkAuth);

  return (
    <div class="p-6 flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-300">
      {/* Status: Prüfen */}
      <Show when={status() === "checking"}>
        <div class="flex items-center gap-3 text-gray-500">
          <div class="animate-spin h-6 w-6 border-2 border-blue-400 rounded-full border-t-transparent" />
          <span>Prüfe Anmeldestatus…</span>
        </div>
      </Show>

      {/* Status: Nicht angemeldet */}
      <Show when={status() === "unauthorized"}>
        <div class="flex justify-between w-full items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Willkommen, Gast 👋
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Du bist aktuell nicht angemeldet.
            </p>
          </div>
          <span class="px-4 py-1 rounded-full bg-red-100 text-red-700 font-medium text-sm shadow-sm">
            Abgemeldet
          </span>
        </div>
      </Show>

      {/* Status: Angemeldet */}
      <Show when={status() === "active" && user()}>
        <div class="flex justify-between w-full items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Willkommen zurück, {user().first_name} {user().last_name} 👋
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Status:{" "}
              <strong class="text-green-700">
                {user().status || "active"}
              </strong>{" "}
              · Aktiv bis:{" "}
              <strong>
                {user().trial_end
                  ? new Date(user().trial_end).toLocaleDateString("de-DE")
                  : "—"}
              </strong>
            </p>
          </div>
          <span class="px-4 py-1 rounded-full bg-green-100 text-green-700 font-medium text-sm shadow-sm">
            Angemeldet
          </span>
        </div>
      </Show>
    </div>
  );
}
