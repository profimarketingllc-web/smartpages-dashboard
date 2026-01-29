import { createSignal } from "solid-js";
import ModalWrapper from "./ModalWrapper";

export default function PrivacyModal(props) {
  const [form, setForm] = createSignal({
    privacy_contact: "",
    email: "",
    street: "",
    house_number: "",
    zip: "",
    city: "",
    country: "",
  });

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <ModalWrapper open={props.open} onClose={props.onClose}>
      <h3 class="text-lg font-semibold mb-4">Edit privacy policy</h3>

      <div class="space-y-4 text-sm">
        <div>
          <label class="font-medium">Privacy contact</label>
          <input
            class="w-full mt-1 border rounded px-3 py-2"
            value={form().privacy_contact}
            onInput={update("privacy_contact")}
          />
        </div>

        <div>
          <label class="font-medium">Email</label>
          <input
            type="email"
            class="w-full mt-1 border rounded px-3 py-2"
            value={form().email}
            onInput={update("email")}
          />
        </div>

        {/* Adresse */}
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-medium">Street</label>
            <input
              class="w-full mt-1 border rounded px-3 py-2"
              value={form().street}
              onInput={update("street")}
            />
          </div>

          <div>
            <label class="font-medium">House number</label>
            <input
              class="w-full mt-1 border rounded px-3 py-2"
              value={form().house_number}
              onInput={update("house_number")}
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-medium">ZIP</label>
            <input
              class="w-full mt-1 border rounded px-3 py-2"
              value={form().zip}
              onInput={update("zip")}
            />
          </div>

          <div>
            <label class="font-medium">City</label>
            <input
              class="w-full mt-1 border rounded px-3 py-2"
              value={form().city}
              onInput={update("city")}
            />
          </div>
        </div>

        <div>
          <label class="font-medium">Country</label>
          <input
            class="w-full mt-1 border rounded px-3 py-2"
            value={form().country}
            onInput={update("country")}
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 text-sm"
          onClick={props.onClose}
        >
          Cancel
        </button>

        <button
          class="bg-[#1E2A45] text-white px-4 py-2 rounded text-sm"
          onClick={() => {
            // save kommt später
            props.onClose();
          }}
        >
          Save
        </button>
      </div>
    </ModalWrapper>
  );
}
