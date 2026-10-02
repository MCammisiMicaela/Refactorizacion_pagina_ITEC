const formulario = document.getElementById("formulario-contacto");
const resultado = document.getElementById("resultado-formulario");

function mostrarError(campo, mensaje) {
    const entrada = document.getElementById(campo);
    const contenedorError = document.getElementById(`error-${campo}`);

    contenedorError.textContent = mensaje;
    entrada.setAttribute("aria-invalid", mensaje ? "true" : "false");

    if (mensaje) {
        entrada.setAttribute("aria-describedby", `error-${campo}`);
    } else {
        entrada.removeAttribute("aria-describedby");
    }
}

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    resultado.textContent = "";

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const motivo = document.getElementById("motivo").value;
    const mensaje = document.getElementById("mensaje").value.trim();
    const aceptacion = document.getElementById("aceptacion").checked;

    let hayErrores = false;
    let primerCampoConError = null;

    function validarCampo(campo, mensajeError) {
        mostrarError(campo, mensajeError);

        if (mensajeError) {
            hayErrores = true;

            if (!primerCampoConError) {
                primerCampoConError = document.getElementById(campo);
            }
        }
    }

    validarCampo(
        "nombre",
        nombre.length < 3
            ? "Ingresá tu nombre y apellido."
            : ""
    );

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    validarCampo(
        "correo",
        correoValido ? "" : "Ingresá un correo electrónico válido."
    );

    const telefonoValido =
        telefono === "" || /^[+\d\s().-]{6,30}$/.test(telefono);

    validarCampo(
        "telefono",
        telefonoValido
            ? ""
            : "Ingresá un teléfono válido o dejá el campo vacío."
    );

    validarCampo(
        "motivo",
        motivo ? "" : "Seleccioná un motivo de consulta."
    );

    validarCampo(
        "mensaje",
        mensaje.length >= 10
            ? ""
            : "Escribí tu consulta."
    );

    validarCampo(
        "aceptacion",
        aceptacion
            ? ""
            : "Debés aceptar el uso de tus datos para responder la consulta."
    );

    if (hayErrores) {
        primerCampoConError.focus();
        return;
    }

    const asunto = `Consulta ITEC: ${motivo}`;

    const cuerpo =
        `Nombre y apellido: ${nombre}\n` +
        `Correo: ${correo}\n` +
        `Teléfono: ${telefono || "No informado"}\n` +
        `Motivo: ${motivo}\n\n` +
        `Mensaje:\n${mensaje}`;

    const enlaceCorreo =
        `mailto:info@itec.edu.ar` +
        `?subject=${encodeURIComponent(asunto)}` +
        `&body=${encodeURIComponent(cuerpo)}`;

    resultado.textContent =
        "Se abrirá tu aplicación de correo. Revisá el mensaje y presioná Enviar allí para completar la consulta.";

    window.location.href = enlaceCorreo;
});