import { createSignal, onMount } from "solid-js";

export default function AuthPopup() {
  const [visible, setVisible] = createSignal(true);

  onMount(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      {visible() && (
        <div
          class="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#E57373]
                 text-white text-center px-6 py-2.5 rounded-2xl shadow-md
                 text-sm font-semibold z-50 transition-all duration-500">
          Prüfe Anmeldung...
        </div>
      )}
    </>
  );
}
