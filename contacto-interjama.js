document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("interjama-contact-form");
    const status = document.getElementById("interjama-form-status");
    const whatsappNumber = "5493885927238";

    if (!form) {
        return;
    }

    const clean = (value) => String(value || "").trim().replace(/\s+/g, " ");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(form);
        const nombre = clean(data.get("nombre"));
        const empresa = clean(data.get("empresa"));
        const tipo = clean(data.get("tipo"));
        const telefono = clean(data.get("telefono"));
        const mensaje = clean(data.get("mensaje"));

        if (!nombre || !tipo || !mensaje) {
            if (status) {
                status.textContent = "Complete nombre, tipo de consulta y detalle para preparar el mensaje.";
            }
            return;
        }

        const lines = [
            "Consulta desde www.interjama.com",
            "",
            `Nombre: ${nombre}`,
            empresa ? `Empresa / organismo: ${empresa}` : "Empresa / organismo: No informado",
            `Tipo de consulta: ${tipo}`,
            telefono ? `Teléfono de contacto: ${telefono}` : "Teléfono de contacto: No informado",
            "",
            "Detalle:",
            mensaje,
            "",
            "Zona operativa: Paso de Jama · Jujuy · Corredor Bioceánico"
        ];

        const url = "https://api.whatsapp.com/send?phone=" + whatsappNumber + "&text=" + encodeURIComponent(lines.join("\n")) + "&type=phone_number&app_absent=0";

        if (status) {
            status.textContent = "Mensaje preparado. Se abrirá WhatsApp para confirmar el envío.";
        }

        window.open(url, "_blank", "noopener,noreferrer");
    });
});
