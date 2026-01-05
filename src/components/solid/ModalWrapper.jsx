import { Show } from "solid-js";

export default function ModalWrapper(props) {
  const { show, onClose, title, children } = props;

  return (
    <Show when={show()}>
      <div
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ✕
          </button>
          {title && (
            <h3 class="text-xl font-bold text-[#1E2A45] mb-4">{title}</h3>
          )}
          <div>{children}</div>
        </div>
      </div>
    </Show>
  );
}
