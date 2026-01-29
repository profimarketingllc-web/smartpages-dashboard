import { Show } from "solid-js";

export default function ModalWrapper(props) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="absolute inset-0 bg-black/40"
          onClick={props.onClose}
        />

        <div class="relative bg-white rounded-xl p-6 z-50 w-[400px]">
          <button
            class="absolute top-3 right-3"
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
