import { createResource } from "solid-js";
import { t } from "~/utils/i18n/i18n";

export default function PrivacyCard(props) {
  const lang = props.lang || "en";

  const fetchPrivacy = async () => {
    const res = await fetch("/api/customer/privacy", {
      credentials: "include",
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json?.data || {};
  };

  const [privacy] = createResource(fetchPrivacy);
  const data = () => privacy() || {};

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          🔒 {t(lang, "dashboard", "privacy", "title")}
        </h2>

        <button
          onClick={props.onEdit}
          class="bg-[#E47E00] text-white px-4 py-2 rounded-lg"
        >
          {t(lang, "dashboard", "privacy", "edit")}
        </button>
      </div>

      <div class="text-sm text-gray-600">
        {data().email || "—"}
      </div>
    </div>
  );
}
