const formularioNovedades = document.getElementById("formulario-novedades");

if (formularioNovedades) {
    const campoNombre = document.getElementById("novedades-nombre");
    const campoCorreo = document.getElementById("novedades-correo");
    const campoCelular = document.getElementById("novedades-celular");
    const campoTrayecto = document.getElementById("novedades-trayecto");
    const resultado = document.getElementById("resultado-novedades");


    function mostrarError(campo, mensaje) {
        const error = document.getElementById("error-" + campo.id);
        campo.setAttribute("aria-invalid", "true");
        error.textContent = mensaje;
    }


    function limpiarError(campo) {
        const error = document.getElementById("error-" + campo.id);
        campo.removeAttribute("aria-invalid");
        error.textContent = "";
    }


    function validarNombre() {
        const nombre = campoNombre.value.trim();

        if (nombre.length < 2 || nombre.length > 80) {
            return "Ingresá tu nombre completo (entre 2 y 80 caracteres).";
        }

        return "";
    }

    function validarCorreo() {
        const correo = campoCorreo.value.trim();
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correo)) {
            return "Ingresá un correo electrónico válido. Por ejemplo: nombre@correo.com";
        }

        return "";
    }

    function validarCelular() {
        const celular = campoCelular.value.trim();
        const formatoCelular = /^[0-9+()\s-]{6,20}$/;


        if (celular !== "" && !formatoCelular.test(celular)) {
            return "Ingresá un número válido. Usá solo números, espacios, + o -.";
        }

        return "";
    }

    function validarTrayecto() {
        if (campoTrayecto.value === "") {
            return "Seleccioná el trayecto que te interesa.";
        }

        return "";
    }

    const validaciones = [
        { campo: campoNombre, validar: validarNombre },
        { campo: campoCorreo, validar: validarCorreo },
        { campo: campoCelular, validar: validarCelular },
        { campo: campoTrayecto, validar: validarTrayecto }
    ];


    validaciones.forEach(function (item) {
        const evento = item.campo.tagName === "SELECT" ? "change" : "input";

        item.campo.addEventListener(evento, function () {
            if (item.campo.hasAttribute("aria-invalid") && item.validar() === "") {
                limpiarError(item.campo);
            }
        });
    });

    formularioNovedades.addEventListener("submit", function (evento) {
        evento.preventDefault();
        resultado.textContent = "";

        let primerCampoConError = null;

        validaciones.forEach(function (item) {
            const mensaje = item.validar();

            if (mensaje === "") {
                limpiarError(item.campo);
            } else {
                mostrarError(item.campo, mensaje);

                if (!primerCampoConError) {
                    primerCampoConError = item.campo;
                }
            }
        });

        if (primerCampoConError) {
            primerCampoConError.focus();
            resultado.textContent = "Revisá los campos marcados e intentá de nuevo.";
            return;
        }

        const nombre = campoNombre.value.trim();
        resultado.textContent =
            "Gracias, " + nombre + ". Esto es una demostración: " +
            "no se guardaron tus datos ni se enviará ningún correo.";
        formularioNovedades.reset();
    });
}


const botonesFiltro = document.querySelectorAll(".formacion-filtro");
const listaTrayectos = document.querySelectorAll(".formacion-trayecto");
const resumenFiltros = document.getElementById("filtros-resumen");

if (botonesFiltro.length > 0) {
    const aplicarFiltro = function (filtro) {
        let totalVisibles = 0;

        listaTrayectos.forEach(function (trayecto) {
            const cursos = trayecto.querySelectorAll(".formacion-curso");
            let visiblesEnTrayecto = 0;

            cursos.forEach(function (curso) {

                const coincide = filtro === "todos" || curso.dataset.estado === filtro;

                curso.hidden = !coincide;

                if (coincide) {
                    visiblesEnTrayecto++;
                }
            });

            trayecto.hidden = visiblesEnTrayecto === 0;

            trayecto.open = filtro !== "todos" && visiblesEnTrayecto > 0;

            totalVisibles += visiblesEnTrayecto;
        });

        botonesFiltro.forEach(function (boton) {
            boton.setAttribute("aria-pressed", String(boton.dataset.filtro === filtro));
        });

        if (totalVisibles === 0) {
            resumenFiltros.textContent = "No hay cursos que coincidan con este filtro.";
        } else if (totalVisibles === 1) {
            resumenFiltros.textContent = "Mostrando 1 curso.";
        } else {
            resumenFiltros.textContent = "Mostrando " + totalVisibles + " cursos.";
        }
    };

    botonesFiltro.forEach(function (boton) {
        boton.addEventListener("click", function () {
            aplicarFiltro(boton.dataset.filtro);
        });
    });

    aplicarFiltro("todos");
}