import { Show, createMemo } from "solid-js";

export default function ModalWrapper(props) {
  const visible = createMemo(() =>
    typeof props.show === "function" ? props.show() : !!props.show
  );

  return (
    <Show when={visible()}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div
          class="absolute inset-0 bg-black/40"
          onClick={props.onClose}
        />

        <div class="relative bg-white rounded-2xl p-6 w-[90%] max-w-md z-50">
          <button
            class="absolute top-3 right-3 text-gray-400"
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
