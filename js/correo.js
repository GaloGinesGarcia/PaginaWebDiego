const RECIPIENT_EMAIL = "galogines1@gmail.com";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

const form = document.getElementById("contactForm");
const userEmailInput = document.getElementById("userEmail");
const userMessageInput = document.getElementById("userMessage");
const formStatus = document.getElementById("formStatus");

function setStatus(message, ok = true) {
    formStatus.textContent = message;
    formStatus.style.color = ok ? "#8bffb5" : "#ff8f8f";
}

async function sendContactEmail(fromEmail, message) {
    const payload = {
        _subject: "Nuevo mensaje desde la web ZIGO DJ",
        _captcha: "false",
        email: fromEmail,
        message,
        _template: "table"
    };

    const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === "false") {
        throw new Error(data.message || "No se pudo enviar el correo.");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromEmail = userEmailInput.value.trim();
    const message = userMessageInput.value.trim();

    if (!fromEmail || !message) {
        setStatus("Completa correo y mensaje.", false);
        return;
    }

    try {
        setStatus("Enviando correo...");
        await sendContactEmail(fromEmail, message);
        setStatus(`Correo enviado a ${RECIPIENT_EMAIL}.`);
        form.reset();
    } catch (err) {
        setStatus(`Error al enviar: ${err.message}`, false);
    }
});
