import { Show } from "solid-js";

export default function ModalWrapper(props) {
  return (
    <Show when={props.show}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          class="absolute inset-0 bg-black/40"
          onClick={props.onClose}
        />

        {/* Modal */}
        <div class="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-10">
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
