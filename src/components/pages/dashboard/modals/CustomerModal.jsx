// src/components/pages/dashboard/modals/CustomerModal.jsx
import { createSignal, createEffect } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function CustomerModal(props) {
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [company, setCompany] = createSignal("");
  const [saving, setSaving] = createSignal(false);

  createEffect(() => {
    if (props.data) {
      setFirstName(props.data.firstName || "");
      setLastName(props.data.lastName || "");
      setCompany(props.data.company || "");
    }
  });

  const save = async () => {
    setSaving(true);
    await fetch("/api/dashboard/customer", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName(),
        lastName: lastName(),
        company: company(),
      }),
    });
    setSaving(false);
    props.onSaved();
    props.onClose();
  };

  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-bold mb-4">Edit customer</h3>

      <div class="space-y-3">
        <Input label="First name" value={firstName()} onInput={setFirstName} />
        <Input label="Last name" value={lastName()} onInput={setLastName} />
        <Input label="Company" value={company()} onInput={setCompany} />
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button class="px-4 py-2" onClick={props.onClose}>
          Cancel
        </button>
        <button
          class="bg-slate-800 text-white px-4 py-2 rounded"
          disabled={saving()}
          onClick={save}
        >
          {saving() ? "Saving…" : "Save"}
        </button>
      </div>
    </ModalWrapper>
  );
}

function Input(props) {
  return (
    <div>
      <label class="block text-sm font-medium mb-1">{props.label}</label>
      <input
        class="w-full border rounded px-3 py-2 text-sm"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
      />
    </div>
  );
}
