/* Módulo de Capacitaciones - Lógica JavaScript (ITEC) */
const raizCapacitaciones = new URL("../", document.currentScript.src);

let todasCapacitaciones = [];
let filtroTipo = "todas";
let filtroArea = "todas";
let filtroEstado = "todos";
let filtroTexto = "";

const gridCapacitaciones = document.getElementById("grid-capacitaciones");
const estadoCapacitaciones = document.getElementById("estado-capacitaciones");

const inputBusquedaTexto = document.getElementById("busqueda-texto");
const selectFiltroArea = document.getElementById("filtro-area");
const selectFiltroEstado = document.getElementById("filtro-estado");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");
const botonesTabs = document.querySelectorAll(".tab-btn");

const modalDetalle = document.getElementById("modal-detalle");
const btnCerrarDetalle = document.getElementById("btn-cerrar-detalle");
const btnSecundarioDetalle = document.getElementById("btn-secundario-detalle");

const modalMedida = document.getElementById("modal-a-medida");
const btnAbrirMedida = document.getElementById("btn-abrir-medida");
const btnCerrarMedida = document.getElementById("btn-cerrar-medida");
const btnCancelarMedida = document.getElementById("btn-cancelar-medida");
const formAMedida = document.getElementById("form-a-medida");
const mensajeExitoMedida = document.getElementById("mensaje-exito-medida");

// Normalizador de texto para búsquedas (remueve tildes y convierte a minúsculas)
function normalizarTexto(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Relaciona cada estado de una capacitación con su clase visual.
function claseEstadoCapacitacion(estado) {
    const clases = {
        abierta: "badge-abierta",
        proximamente: "badge-proximamente",
        consultar: "badge-consultar",
        cerrada: "badge-cerrada",
        finalizado: "badge-finalizado"
    };

    return clases[estado] || "badge-consultar";
}

// Cargar datos JSON de capacitaciones
async function cargarCapacitaciones() {
    try {
        estadoCapacitaciones.textContent = "Cargando oferta de capacitaciones…";

        const respuesta = await fetch(
            new URL("datos/capacitaciones.json", raizCapacitaciones)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el listado de capacitaciones.");
        }

        todasCapacitaciones = await respuesta.json();
        aplicarFiltros();
    } catch (error) {
        console.error(error);
        estadoCapacitaciones.textContent =
            "No pudimos cargar la información de capacitaciones. Por favor, recargá la página.";
    }
}

// Filtrar lista según el estado actual de controles
function aplicarFiltros() {
    const textoBuscado = normalizarTexto(filtroTexto);

    const resultados = todasCapacitaciones.filter(item => {
        // 1. Filtro por Tipo (todas / abierta / empresa)
        if (filtroTipo !== "todas" && item.tipo !== filtroTipo) {
            return false;
        }

        // 2. Filtro por Área
        if (filtroArea !== "todas" && item.area !== filtroArea) {
            return false;
        }

        // 3. Filtro por Estado (abierta / proximamente)
        if (filtroEstado !== "todos" && item.estado !== filtroEstado) {
            return false;
        }

        // 4. Búsqueda por texto (Título, Descripción, Área o Audiencia)
        if (textoBuscado) {
            const contenido = normalizarTexto(
                `${item.titulo} ${item.descripcionCorta} ${item.areaNombre} ${item.audiencia}`
            );
            return contenido.includes(textoBuscado);
        }

        return true;
    });

    renderizarTarjetas(resultados);
}

// Renderizar tarjetas en el DOM
function renderizarTarjetas(lista) {
    gridCapacitaciones.replaceChildren();

    const cantidad = lista.length;

    if (cantidad === 0) {
        estadoCapacitaciones.textContent = "No se encontraron capacitaciones con los filtros seleccionados.";

        const contenedorVacio = document.createElement("div");
        contenedorVacio.className = "sin-resultados";
        contenedorVacio.innerHTML = `
            <h3>No encontramos propuestas para tu búsqueda</h3>
            <p>Probá cambiando los filtros o la palabra clave ingresada.</p>
        `;
        
        const btnRestablecer = document.createElement("button");
        btnRestablecer.type = "button";
        btnRestablecer.className = "boton";
        btnRestablecer.textContent = "Restablecer filtros";
        btnRestablecer.addEventListener("click", restablecerFiltros);
        contenedorVacio.appendChild(btnRestablecer);

        gridCapacitaciones.appendChild(contenedorVacio);
        return;
    }

    estadoCapacitaciones.textContent =
        `Mostrando ${cantidad} ${cantidad === 1 ? "propuesta" : "propuestas"}.`;

    const fragmento = document.createDocumentFragment();

    lista.forEach(item => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-capacitacion";

        const claseBadgeEstado = claseEstadoCapacitacion(item.estado);
        const etiquetaTipo = item.estadoEtiqueta;

        tarjeta.innerHTML = `
            <div class="tarjeta-header">
                <span class="badge badge-area">${item.areaNombre}</span>
                <span class="badge ${claseBadgeEstado}">${etiquetaTipo}</span>
            </div>
            <div class="tarjeta-body">
                <h3>${item.titulo}</h3>
                <p class="descripcion">${item.descripcionCorta}</p>
                <ul class="tarjeta-meta">
                    <li>
                        <strong>Modalidad:</strong>
                        <span>${item.modalidad}</span>
                    </li>
                    <li>
                        <strong>Duración:</strong>
                        <span>${item.duracion}</span>
                    </li>
                </ul>
            </div>
            <div class="tarjeta-footer">
                <button
                    type="button"
                    class="boton boton-detalle"
                    data-id="${item.id}"
                >
                    Ver detalles de la propuesta
                </button>
            </div>
        `;

        // Evento abrir modal de detalle
        const btnDetalle = tarjeta.querySelector(".boton-detalle");
        btnDetalle.addEventListener("click", () => abrirModalDetalle(item));

        fragmento.appendChild(tarjeta);
    });

    gridCapacitaciones.appendChild(fragmento);
}

// Restablecer filtros a su valor inicial
function restablecerFiltros() {
    filtroTipo = "todas";
    filtroArea = "todas";
    filtroEstado = "todos";
    filtroTexto = "";

    inputBusquedaTexto.value = "";
    selectFiltroArea.value = "todas";
    selectFiltroEstado.value = "todos";

    botonesTabs.forEach(btn => {
        const esTodas = btn.dataset.tipo === "todas";
        btn.classList.toggle("activo", esTodas);
        btn.setAttribute("aria-pressed", esTodas ? "true" : "false");
    });

    aplicarFiltros();
}

// Abrir y poblar el modal de detalles
function abrirModalDetalle(item) {
    document.getElementById("modal-detalle-titulo").textContent = item.titulo;

    const badgeArea = document.getElementById("modal-detalle-badge-area");
    badgeArea.textContent = item.areaNombre;

    const badgeEstado = document.getElementById("modal-detalle-badge-estado");
    badgeEstado.textContent = item.estadoEtiqueta;
    badgeEstado.className =
        `badge ${claseEstadoCapacitacion(item.estado)}`;

    document.getElementById("modal-detalle-modalidad").textContent = item.modalidad;
    document.getElementById("modal-detalle-duracion").textContent = item.duracion;
    document.getElementById("modal-detalle-horarios").textContent = item.horarios;
    document.getElementById("modal-detalle-inicio").textContent = item.inicio;
    document.getElementById("modal-detalle-descripcion").textContent = item.descripcionDetallada;
    document.getElementById("modal-detalle-audiencia").textContent = item.audiencia;

    const ulRequisitos = document.getElementById("modal-detalle-requisitos");
    ulRequisitos.replaceChildren();

    const requisitos = item.requisitos?.length
        ? item.requisitos
        : ["Consultá al instituto los requisitos específicos de esta propuesta."];

    requisitos.forEach(requisito => {
        const elemento = document.createElement("li");
        elemento.textContent = requisito;
        ulRequisitos.appendChild(elemento);
    });

    const ulTemario = document.getElementById("modal-detalle-temario");
    ulTemario.replaceChildren();

    const temario = item.temario?.length
        ? item.temario
        : ["Solicitá el programa y los contenidos correspondientes a la edición que te interesa."];

    temario.forEach(tema => {
        const elemento = document.createElement("li");
        elemento.textContent = tema;
        ulTemario.appendChild(elemento);
    });

    // Actualizar enlace de inscripción
    const btnInscripcion = document.getElementById("btn-inscripcion-modal");
    const parametrosConsulta = new URLSearchParams({
        capacitacion: item.titulo
    });

    btnInscripcion.href =
        `contacto.html?${parametrosConsulta.toString()}#consulta`;

    btnInscripcion.textContent = "Consultar esta capacitación";

    modalDetalle.showModal();
}

// Registra los controles de filtros y los comportamientos de ambos modales.
function inicializarEventos() {
    // Pestañas (Tabs)
    botonesTabs.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesTabs.forEach(b => {
                b.classList.remove("activo");
                b.setAttribute("aria-pressed", "false");
            });

            btn.classList.add("activo");
            btn.setAttribute("aria-pressed", "true");

            filtroTipo = btn.dataset.tipo;
            aplicarFiltros();
        });
    });

    // Buscador por texto
    inputBusquedaTexto.addEventListener("input", (e) => {
        filtroTexto = e.target.value;
        aplicarFiltros();
    });

    // Select por Área
    selectFiltroArea.addEventListener("change", (e) => {
        filtroArea = e.target.value;
        aplicarFiltros();
    });

    // Select por Estado
    selectFiltroEstado.addEventListener("change", (e) => {
        filtroEstado = e.target.value;
        aplicarFiltros();
    });

    // Botón Limpiar Filtros
    btnLimpiarFiltros.addEventListener("click", restablecerFiltros);

    // Cierre Modal Detalle
    if (btnCerrarDetalle) {
        btnCerrarDetalle.addEventListener("click", () => modalDetalle.close());
    }
    if (btnSecundarioDetalle) {
        btnSecundarioDetalle.addEventListener("click", () => modalDetalle.close());
    }
    if (modalDetalle) {
        modalDetalle.addEventListener("click", (e) => {
            if (e.target === modalDetalle) {
                modalDetalle.close();
            }
        });
    }

    // Modal Solicitud a Medida
    if (btnAbrirMedida) {
        btnAbrirMedida.addEventListener("click", () => {
            mensajeExitoMedida.style.display = "none";
            formAMedida.style.display = "flex";
            formAMedida.reset();
            modalMedida.showModal();
        });
    }
    if (btnCerrarMedida) {
        btnCerrarMedida.addEventListener("click", () => modalMedida.close());
    }
    if (btnCancelarMedida) {
        btnCancelarMedida.addEventListener("click", () => modalMedida.close());
    }
    if (modalMedida) {
        modalMedida.addEventListener("click", (e) => {
            if (e.target === modalMedida) {
                modalMedida.close();
            }
        });
    }

    if (formAMedida) {
        formAMedida.addEventListener("submit", (evento) => {
            evento.preventDefault();

            if (!formAMedida.reportValidity()) {
                return;
            }

            const datos = new FormData(formAMedida);

            const obtenerTexto = (nombre) =>
                String(datos.get(nombre) || "").trim();

            const empresa = obtenerTexto("empresa");
            const contacto = obtenerTexto("contacto");
            const email = obtenerTexto("email");
            const telefono = obtenerTexto("telefono");
            const tematica = obtenerTexto("tematica");
            const detalles = obtenerTexto("detalles");

            if (!empresa || !contacto || !email || !tematica) {
                mensajeExitoMedida.textContent =
                    "Completá los campos obligatorios. No ingreses solamente espacios.";

                mensajeExitoMedida.style.display = "block";
                return;
            }

            const telefonoValido =
                telefono === "" || /^[+0-9()\s.-]{6,30}$/.test(telefono);

            if (!telefonoValido) {
                mensajeExitoMedida.textContent =
                    "Ingresá un teléfono válido o dejá el campo vacío.";

                mensajeExitoMedida.style.display = "block";
                return;
            }

            const asunto = `Consulta de capacitación para empresas: ${tematica}`;

            const cuerpo =
                `Empresa u organización: ${empresa}\n` +
                `Persona de contacto: ${contacto}\n` +
                `Correo electrónico: ${email}\n` +
                `Teléfono: ${telefono || "No informado"}\n` +
                `Temática de interés: ${tematica}\n\n` +
                `Detalles de la consulta:\n${detalles || "Sin detalles adicionales."}`;

            const enlaceCorreo =
                "mailto:info@itec-elmolino.edu.ar" +
                `?subject=${encodeURIComponent(asunto)}` +
                `&body=${encodeURIComponent(cuerpo)}`;

            mensajeExitoMedida.textContent =
                "Intentamos abrir tu aplicación de correo con la consulta preparada. " +
                "Revisá el mensaje y presioná Enviar allí. " +
                "Si no se abre, podés escribir a info@itec-elmolino.edu.ar.";

            mensajeExitoMedida.style.display = "block";

            window.location.href = enlaceCorreo;
        });
    }
}

// Prepara la interfaz y carga la oferta una vez disponible el documento.
document.addEventListener("DOMContentLoaded", () => {
    inicializarEventos();
    cargarCapacitaciones();
});
