// src/components/pages/dashboard/CustomerCard.jsx
import { createResource, Show } from "solid-js";

export default function CustomerCard(props) {
  const fetchCustomer = async () => {
    const res = await fetch("/api/dashboard/customer", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("load error");
    return res.json();
  };

  const [customer, { refetch }] = createResource(fetchCustomer);

  const data = () => customer() || {};
  const authenticated = () => data().isAuthenticated === true;

  return (
    <div class="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Customer Information</h2>

        <button
          class="bg-slate-800 text-white px-4 py-2 rounded disabled:opacity-40"
          disabled={!authenticated()}
          onClick={() => props.onEdit(data(), refetch)}
        >
          Edit customer
        </button>
      </div>

      {/* Status */}
      <div class="mb-4">
        <span
          class={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
            authenticated()
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {authenticated() ? "Active" : "Logged out"}
        </span>
      </div>

      {/* Content */}
      <div class="grid grid-cols-2 gap-4 text-sm">
        <Field label="First name" value={authenticated() && data().firstName} />
        <Field label="Last name" value={authenticated() && data().lastName} />
        <Field label="Company" value={authenticated() && data().company} />
        <Field label="Plan" value={authenticated() && data().plan} />
        <Field label="Active until" value={authenticated() && data().activeUntil} />
        <Field label="Last login" value={authenticated() && data().lastLogin} />
      </div>

      <Show when={customer.error}>
        <p class="mt-3 text-sm text-red-600">
          Customer data could not be loaded.
        </p>
      </Show>
    </div>
  );
}

function Field(props) {
  return (
    <div>
      <div class="font-medium">{props.label}</div>
      <div class="text-gray-500">{props.value || "—"}</div>
    </div>
  );
}
