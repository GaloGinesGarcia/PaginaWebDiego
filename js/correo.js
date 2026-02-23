(function () {
    emailjs.init("d8aGSJLv7JC6fVDx5"); // TU PUBLIC KEY
})();

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    status.textContent = "Enviando mensaje...";
    status.style.color = "white";

    const templateParams = {
        from_email: document.getElementById("userEmail").value,
        reply_to: document.getElementById("userEmail").value,
        message: document.getElementById("userMessage").value,
    };

    emailjs
        .send(
            "service_twg5nzy",   // Service ID
            "template_gqi4rpb",  // Template ID
            templateParams
        )
        .then(() => {
            status.textContent = "✅ Mensaje enviado correctamente";
            status.style.color = "limegreen";
            form.reset();
        })
        .catch((error) => {
            status.textContent = "❌ Error al enviar el mensaje";
            status.style.color = "red";
            console.error("EmailJS error:", error);
        });
});