const GOOGLE_CLIENT_ID = "REEMPLAZA_CON_TU_CLIENT_ID.apps.googleusercontent.com";
const RECIPIENT_EMAIL = "galogines1@gmail.com";

const form = document.getElementById("contactForm");
const userEmailInput = document.getElementById("userEmail");
const userMessageInput = document.getElementById("userMessage");
const googleLoginBtn = document.getElementById("googleLogin");
const formStatus = document.getElementById("formStatus");

let accessToken = "";
let googleAccountEmail = "";
let tokenClient = null;

function setStatus(message, ok = true) {
    formStatus.textContent = message;
    formStatus.style.color = ok ? "#8bffb5" : "#ff8f8f";
}

function encodeBase64Url(str) {
    const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function getGoogleUserEmail(token) {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        throw new Error("No se pudo obtener el email de Google.");
    }

    const data = await res.json();
    return data.email || "";
}

async function sendGmailMessage(token, fromEmail, message) {
    const subject = "Nuevo mensaje desde la web ZIGO DJ";
    const body = [
        `Correo de contacto: ${fromEmail}`,
        "",
        "Mensaje:",
        message,
        "",
        `Cuenta Google autenticada: ${googleAccountEmail || "No disponible"}`
    ].join("\n");

    const rawEmail = [
        `To: ${RECIPIENT_EMAIL}`,
        `Subject: ${subject}`,
        `Reply-To: ${fromEmail}`,
        "Content-Type: text/plain; charset=UTF-8",
        "MIME-Version: 1.0",
        "",
        body
    ].join("\n");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ raw: encodeBase64Url(rawEmail) })
    });

    if (!res.ok) {
        const errData = await res.text();
        throw new Error(errData || "No se pudo enviar el correo.");
    }
}

function initGoogleAuth() {
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
        setStatus("Google Auth no cargó. Recarga la página.", false);
        return;
    }

    tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
        callback: async (response) => {
            if (response.error || !response.access_token) {
                setStatus("No se pudo iniciar sesión con Google.", false);
                return;
            }

            accessToken = response.access_token;

            try {
                googleAccountEmail = await getGoogleUserEmail(accessToken);
                googleLoginBtn.textContent = `Conectado: ${googleAccountEmail}`;
                googleLoginBtn.classList.remove("btn-danger");
                googleLoginBtn.classList.add("btn-success");
                setStatus("Sesión de Google iniciada correctamente.");
            } catch (err) {
                setStatus(`Login parcial: ${err.message}`, false);
            }
        }
    });
}

googleLoginBtn.addEventListener("click", () => {
    if (!tokenClient) {
        setStatus("Google Auth todavía no está listo. Intenta de nuevo.", false);
        return;
    }

    tokenClient.requestAccessToken({ prompt: accessToken ? "" : "consent" });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromEmail = userEmailInput.value.trim();
    const message = userMessageInput.value.trim();

    if (!accessToken) {
        setStatus("Primero inicia sesión con Google.", false);
        return;
    }

    if (!fromEmail || !message) {
        setStatus("Completa correo y mensaje.", false);
        return;
    }

    try {
        setStatus("Enviando correo...");
        await sendGmailMessage(accessToken, fromEmail, message);
        setStatus(`Correo enviado a ${RECIPIENT_EMAIL}.`);
        form.reset();
    } catch (err) {
        setStatus(`Error al enviar: ${err.message}`, false);
    }
});

window.addEventListener("load", initGoogleAuth);
