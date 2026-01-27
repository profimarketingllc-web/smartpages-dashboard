import { Show } from "solid-js";
import { UserProvider, useUser } from "@/components/context/UserContext";

/* Cards */
import CustomerCard from "./CustomerCard.jsx";
import ImprintCard from "./ImprintCard.jsx";
import PrivacyCard from "./PrivacyCard.jsx";

/* Modals */
import EditCustomerModal from "./modals/EditCustomerModal.jsx";
import EditImprintModal from "./modals/EditImprintModal.jsx";
import EditPrivacyModal from "./modals/EditPrivacyModal.jsx";

/* -------------------------------------------------- */
/* Inner Dashboard (has access to UserContext)        */
/* -------------------------------------------------- */
function DashboardContent() {
  const { user } = useUser();

  return (
    <>
      {/* ---------------- Cards ---------------- */}
      <CustomerCard />
      <ImprintCard />
      <PrivacyCard />

      {/* ---------------- Modals ---------------- */}
      <EditCustomerModal />
      <EditImprintModal />
      <EditPrivacyModal />

      {/* ---------------- Safety ---------------- */}
      <Show when={!user.loggedIn}>
        <div class="text-center text-gray-500 py-10">
          Du bist nicht eingeloggt.
        </div>
      </Show>
    </>
  );
}

/* -------------------------------------------------- */
/* Root Export                                        */
/* -------------------------------------------------- */
export default function DashboardRoot() {
  return (
    <UserProvider>
      <DashboardContent />
    </UserProvider>
  );
}
