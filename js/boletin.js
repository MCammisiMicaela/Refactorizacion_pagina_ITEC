const formularioBoletin = document.getElementById("formulario-boletin");

if (formularioBoletin) {
    const nombre = document.getElementById("boletin-nombre");
    const correo = document.getElementById("boletin-correo");
    const resultado = document.getElementById("resultado-boletin");

    function mostrarErrorBoletin(campo, mensaje) {
        const error = document.getElementById(`error-${campo.id}`);

        error.textContent = mensaje;
        campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
    }

    [nombre, correo].forEach(campo => {
        campo.addEventListener("input", function () {
            resultado.textContent = "";

            if (campo.getAttribute("aria-invalid") === "true") {
                mostrarErrorBoletin(campo, "");
            }
        });
    });

    formularioBoletin.addEventListener("submit", function (evento) {
        evento.preventDefault();
        resultado.textContent = "";

        nombre.value = nombre.value.trim();
        correo.value = correo.value.trim();

        const errorNombre =
            nombre.value.length < 2 || nombre.value.length > 80
                ? "Ingresá un nombre de entre 2 y 80 caracteres."
                : "";

        const correoValido =
            correo.value !== "" &&
            correo.value.length <= 150 &&
            correo.validity.valid &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value);

        const errorCorreo = correoValido
            ? ""
            : "Ingresá un correo electrónico válido.";

        mostrarErrorBoletin(nombre, errorNombre);
        mostrarErrorBoletin(correo, errorCorreo);

        if (errorNombre || errorCorreo) {
            resultado.textContent =
                "Revisá los campos indicados para continuar.";

            if (errorNombre) {
                nombre.focus();
            } else {
                correo.focus();
            }

            return;
        }

        resultado.textContent =
            "Demostración completada: los campos tienen un formato válido. " +
            "No se registró ninguna suscripción ni se enviaron datos.";

        formularioBoletin.reset();
    });
}