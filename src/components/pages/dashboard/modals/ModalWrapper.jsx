import { Show } from "solid-js";

export default function ModalWrapper(props) {
  return (
    <Show when={props.open === true}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          class="absolute inset-0 bg-black/40"
          onClick={props.onClose}
        />

        {/* Modal */}
        <div class="relative bg-white rounded-xl p-6 z-50 w-[420px] shadow-lg">
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={props.onClose}
          >
            ✕
          </button>

          {props.children}
        </div>
      </div>
    </Show>
  );
}
