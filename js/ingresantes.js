const formularioPreinscripcion = document.getElementById(
    "formulario-preinscripcion"
);
const selectorCarrera = document.getElementById("carrera-preinscripcion");
const campoTelefono = document.getElementById("telefono-preinscripcion");
const botonSimular = document.getElementById("simular-preinscripcion");
const estadoPreinscripcion = document.getElementById("estado-preinscripcion");

const carrerasDisponibles = new Map([
    ["desarrollo-software", "Desarrollo de Software"],
    ["gestion-industrial", "Gestión Industrial"],
    ["mantenimiento-industrial", "Mantenimiento Industrial"],
    ["logistica", "Logística"],
    ["energias-renovables", "Gestión de Energías Renovables"],
    ["seguridad-higiene", "Seguridad, Higiene y Medio Ambiente en el Trabajo"]
]);

const parametrosIngreso = new URLSearchParams(window.location.search);
const carreraIndicada = parametrosIngreso.get("carrera");

if (
    selectorCarrera &&
    carreraIndicada &&
    carrerasDisponibles.has(carreraIndicada)
) {
    selectorCarrera.value = carreraIndicada;
}

if (
    formularioPreinscripcion &&
    selectorCarrera &&
    campoTelefono &&
    botonSimular &&
    estadoPreinscripcion
) {
    campoTelefono.addEventListener("input", () => {
        campoTelefono.setCustomValidity("");
    });

    botonSimular.addEventListener("click", () => {
        estadoPreinscripcion.textContent = "";
        campoTelefono.setCustomValidity("");

        const telefono = campoTelefono.value.trim();
        const telefonoValido = /^[+\d\s().-]{6,30}$/;

        if (telefono && !telefonoValido.test(telefono)) {
            campoTelefono.setCustomValidity(
                "Ingresá un teléfono válido o dejá el campo vacío."
            );
        }

        if (!formularioPreinscripcion.checkValidity()) {
            formularioPreinscripcion.reportValidity();
            estadoPreinscripcion.textContent =
                "Revisá los campos obligatorios antes de continuar.";
            return;
        }

        const nombreCarrera =
            carrerasDisponibles.get(selectorCarrera.value);

        estadoPreinscripcion.textContent =
            `Simulación completada para ${nombreCarrera}. ` +
            "Tus datos no se enviaron ni se guardaron. " +
            "Para iniciar una inscripción real, consultá al ITEC.";
    });
}