import { Show } from "solid-js";

export default function ModalWrapper(props) {
  const lang =
    typeof window !== "undefined" && window.location.pathname.startsWith("/en")
      ? "en"
      : "de";

  const closeLabel = lang === "de" ? "Schließen" : "Close";

  return (
    <Show when={props.show()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity"
          onClick={props.onClose}
        ></div>

        <div
          class="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-50 animate-fadeIn"
          style="animation: fadeIn 0.25s ease-in-out;"
        >
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            onClick={props.onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>

          <div>{props.children}</div>
        </div>
      </div>

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
