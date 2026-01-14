// src/pages/auth/redirect.ts
export async function onLoad() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const lang = url.searchParams.get("lang") || "de";

  const message = (txt: string) => {
    document.body.innerHTML = `<p style="font-family:sans-serif;text-align:center;margin-top:20vh;">${txt}</p>`;
  };

  if (!token) {
    message("❌ Kein Token gefunden.");
    return;
  }

  try {
    // 1️⃣ Verify
    const verifyRes = await fetch(`https://api.smartpages.online/api/auth/verify?token=${token}&lang=${lang}`);
    const verifyData = await verifyRes.json();

    if (!verifyData.ok || !verifyData.redirect) {
      message("⚠️ Token ungültig oder abgelaufen.");
      return;
    }

    // 2️⃣ Confirm
    const confirmRes = await fetch(`https://api.smartpages.online${verifyData.redirect}`, {
      credentials: "include",
    });
    const confirmData = await confirmRes.json();

    if (confirmData.ok && confirmData.redirect) {
      // 3️⃣ Redirect ins Dashboard
      window.location.href = confirmData.redirect;
    } else {
      message("⚠️ Fehler beim Bestätigen der Anmeldung.");
    }
  } catch (err) {
    message(`❌ Fehler: ${err.message}`);
  }
}

onLoad();
