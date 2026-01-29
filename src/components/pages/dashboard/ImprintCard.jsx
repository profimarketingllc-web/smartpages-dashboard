import { createResource } from "solid-js";
import { t } from "~/utils/i18n/i18n";

export default function ImprintCard(props) {
  const lang = props.lang || "en";

  const fetchImprint = async () => {
    const res = await fetch("/api/customer/imprint", {
      credentials: "include",
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json?.data || {};
  };

  const [imprint] = createResource(fetchImprint);
  const data = () => imprint() || {};

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          🧾 {t(lang, "dashboard", "imprint", "title")}
        </h2>

        <button
          onClick={props.onEdit}
          class="bg-[#F5B400] text-white px-4 py-2 rounded-lg"
        >
          {t(lang, "dashboard", "imprint", "edit")}
        </button>
      </div>

      <div class="text-sm text-gray-600">
        {data().company_name || "—"}
      </div>
    </div>
  );
}
