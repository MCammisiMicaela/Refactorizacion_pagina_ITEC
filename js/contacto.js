const formulario = document.getElementById("formulario-contacto");
const resultado = document.getElementById("resultado-formulario");

const carrerasConsulta = new Map([
    ["desarrollo-software", "Desarrollo de Software"],
    ["gestion-industrial", "Gestión Industrial"],
    ["mantenimiento-industrial", "Mantenimiento Industrial"],
    ["logistica", "Logística"],
    [
        "energias-renovables",
        "Gestión de Energías Renovables, Uso Racional y Eficiencia Energética"
    ],
    [
        "seguridad-higiene",
        "Seguridad, Higiene y Medio Ambiente en el Trabajo"
    ]
]);

function mostrarError(campo, mensaje) {
    const entrada = document.getElementById(campo);
    const contenedorError = document.getElementById(`error-${campo}`);

    contenedorError.textContent = mensaje;
    entrada.setAttribute("aria-invalid", String(Boolean(mensaje)));

    const descripciones = new Set(
        (entrada.getAttribute("aria-describedby") || "")
            .split(/\s+/)
            .filter(Boolean)
    );

    if (mensaje) {
        descripciones.add(contenedorError.id);
    } else {
        descripciones.delete(contenedorError.id);
    }

    if (descripciones.size > 0) {
        entrada.setAttribute(
            "aria-describedby",
            [...descripciones].join(" ")
        );
    } else {
        entrada.removeAttribute("aria-describedby");
    }
}

function completarConsultaDeCarrera() {
    const parametros = new URLSearchParams(window.location.search);
    const identificador = parametros.get("carrera");
    const carrera = carrerasConsulta.get(identificador);

    if (!carrera || !formulario) {
        return;
    }

    const campoMensaje = document.getElementById("mensaje");
    const campoMotivo = document.getElementById("motivo");

    if (!campoMotivo.value) {
        campoMotivo.value = "Inscripciones";
    }

    if (!campoMensaje.value.trim()) {
        campoMensaje.value = identificador === "energias-renovables"
            ? `Hola, quisiera consultar por próximas convocatorias para la Tecnicatura Superior en ${carrera}.`
            : `Hola, quisiera recibir información sobre la inscripción a la Tecnicatura Superior en ${carrera}.`;
    }
}

if (formulario && resultado) {
    const campos = [
        "nombre",
        "correo",
        "telefono",
        "motivo",
        "mensaje",
        "aceptacion"
    ];

    campos.forEach(id => {
        const entrada = document.getElementById(id);

        const evento = entrada.matches(
            'select, input[type="checkbox"]'
        )
            ? "change"
            : "input";

        entrada.addEventListener(evento, () => {
            resultado.textContent = "";

            if (entrada.getAttribute("aria-invalid") === "true") {
                mostrarError(id, "");
            }
        });
    });

    formulario.addEventListener("submit", evento => {
        evento.preventDefault();
        resultado.textContent = "";

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const motivo = document.getElementById("motivo").value;
        const mensaje = document.getElementById("mensaje").value.trim();
        const aceptacion = document.getElementById("aceptacion").checked;

        let primerCampoConError = null;

        function validarCampo(id, mensajeError) {
            mostrarError(id, mensajeError);

            if (mensajeError && !primerCampoConError) {
                primerCampoConError = document.getElementById(id);
            }
        }

        validarCampo(
            "nombre",
            nombre.length >= 3 && nombre.length <= 100
                ? ""
                : "Ingresá tu nombre y apellido, entre 3 y 100 caracteres."
        );

        const correoValido =
            correo.length <= 150 &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        validarCampo(
            "correo",
            correoValido
                ? ""
                : "Ingresá un correo electrónico válido."
        );

        const digitosTelefono = telefono.replace(/\D/g, "");

        const telefonoValido =
            telefono === "" ||
            (
                telefono.length <= 30 &&
                /^\+?[\d\s().-]+$/.test(telefono) &&
                digitosTelefono.length >= 6 &&
                digitosTelefono.length <= 15
            );

        validarCampo(
            "telefono",
            telefonoValido
                ? ""
                : "Ingresá un teléfono con entre 6 y 15 dígitos o dejá el campo vacío."
        );

        validarCampo(
            "motivo",
            motivo ? "" : "Seleccioná un motivo de consulta."
        );

        validarCampo(
            "mensaje",
            mensaje.length >= 10 && mensaje.length <= 2000
                ? ""
                : "Escribí una consulta de entre 10 y 2000 caracteres."
        );

        validarCampo(
            "aceptacion",
            aceptacion
                ? ""
                : "Debés aceptar el uso de tus datos para responder la consulta."
        );

        if (primerCampoConError) {
            resultado.textContent =
                "Revisá los campos indicados antes de continuar.";

            primerCampoConError.focus();
            return;
        }

        const asunto = `Consulta ITEC: ${motivo}`;

        const cuerpo = [
            `Nombre y apellido: ${nombre}`,
            `Correo: ${correo}`,
            `Teléfono: ${telefono || "No informado"}`,
            `Motivo: ${motivo}`,
            "",
            "Mensaje:",
            mensaje
        ].join("\n");

        const enlaceCorreo =
            "mailto:info@itec-elmolino.edu.ar" +
            `?subject=${encodeURIComponent(asunto)}` +
            `&body=${encodeURIComponent(cuerpo)}`;

        resultado.textContent =
            "La consulta está preparada. Se intentará abrir tu aplicación " +
            "de correo: revisá el mensaje y presioná Enviar allí. " +
            "Si no se abre, podés escribir a info@itec-elmolino.edu.ar.";

        window.location.href = enlaceCorreo;
    });

    completarConsultaDeCarrera();
}

const botonCopiar = document.getElementById("copiar");
const estadoCopiado = document.getElementById("copiado");

if (botonCopiar && estadoCopiado) {
    const direccion =
        "Rivadavia 1390, 1er piso, Esperanza, Santa Fe.";

    botonCopiar.addEventListener("click", async () => {
        estadoCopiado.textContent = "";
        botonCopiar.disabled = true;

        try {
            if (!navigator.clipboard?.writeText) {
                throw new Error("El navegador no permite copiar automáticamente.");
            }

            await navigator.clipboard.writeText(direccion);

            estadoCopiado.textContent =
                "Dirección copiada al portapapeles.";
        } catch {
            estadoCopiado.textContent =
                `No pudimos copiar automáticamente. Podés seleccionar y copiar esta dirección: ${direccion}`;
        } finally {
            botonCopiar.disabled = false;
        }
    });
}