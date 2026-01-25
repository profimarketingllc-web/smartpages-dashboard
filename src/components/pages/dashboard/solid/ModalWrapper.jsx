import { Show, createMemo } from "solid-js";
import { t } from "~/utils/i18n/i18n";

/**
 * ModalWrapper – zentraler Modal-Container für alle Dialoge
 * ---------------------------------------------------------
 * ✅ nutzt globale i18n-Übersetzungen
 * ✅ SSR-sicher (verwendet props.lang, fällt auf "de" zurück)
 * ✅ unterstützt Signals und normale Booleans (Solid-idiomatisch)
 * ✅ universell für alle Modals (Imprint, Customer, etc.)
 */

export default function ModalWrapper(props) {
  // 🌍 Sprache aus Props oder Middleware (SSR-sicher)
  const lang = props.lang || (typeof window !== "undefined" && window.location.pathname.includes("/en/") ? "en" : "de");

  // 🔠 Übersetzungen zentral aus i18n
  const closeLabel = t(lang, "closeButton", "system") || (lang === "de" ? "Schließen" : "Close");

  // 🧠 Signal-kompatible Sichtbarkeit
  const isVisible = createMemo(() => {
    try {
      return typeof props.show === "function" ? props.show() : !!props.show;
    } catch {
      return false;
    }
  });

  // 🎨 Layout
  return (
    <Show when={isVisible()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        {/* 🔹 Halbtransparenter Hintergrund */}
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={props.onClose}
        ></div>

        {/* 🔹 Modal-Inhalt */}
        <div
          class="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-50 animate-fadeIn"
          style="animation: fadeIn 0.25s ease-in-out;"
        >
          {/* ❌ Schließen-Button */}
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            onClick={props.onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>

          {/* 📦 Modal Content */}
          <div>{props.children}</div>
        </div>
      </div>

      {/* ✨ Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Show>
  );
}

