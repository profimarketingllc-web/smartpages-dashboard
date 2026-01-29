import { Show } from "solid-js";

export default function CustomerCard(props) {
  const { t, system, customer } = props;

  return (
    <section class="bg-white rounded-xl p-6 shadow space-y-4">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold">
          👤 {t.title}
        </h2>

        <button
          onClick={() =>
            <button
             onClick={props.onEdit}
             class="bg-[#1E2A45] text-white px-4 py-2 rounded-lg"
              >
             {props.t.button}
            </button>

          }
          class="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm"
        >
          {t.button}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium">{t.firstName}</span>
          <p>{customer().first_name || "—"}</p>
        </div>

        <div>
          <span class="font-medium">{t.lastName}</span>
          <p>{customer().last_name || "—"}</p>
        </div>

        <div>
          <span class="font-medium">{t.company}</span>
          <p>{customer().company || "—"}</p>
        </div>
      </div>
    </section>
  );
}
