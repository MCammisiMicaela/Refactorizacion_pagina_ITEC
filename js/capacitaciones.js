/* ==========================================================================
   Módulo de Capacitaciones - Lógica JavaScript (ITEC)
   ========================================================================== */

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
        `Mostrando ${cantidad} ${cantidad === 1 ? "capacitación disponible" : "capacitaciones disponibles"}.`;

    const fragmento = document.createDocumentFragment();

    lista.forEach(item => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-capacitacion";

        // Badges de Área y Estado
        const claseBadgeEstado = item.estado === "abierta"
            ? "badge-abierta"
            : item.estado === "proximamente"
            ? "badge-proximamente"
            : "badge-empresa";

        const etiquetaTipo = item.tipo === "empresa" ? "Para Empresas" : item.estadoEtiqueta;

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
                        <span class="tarjeta-meta-icono">📍</span>
                        <span><strong>Modalidad:</strong> ${item.modalidad}</span>
                    </li>
                    <li>
                        <span class="tarjeta-meta-icono">⏱️</span>
                        <span><strong>Duración:</strong> ${item.duracion}</span>
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
        btn.setAttribute("aria-selected", esTodas ? "true" : "false");
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
    badgeEstado.className = `badge ${
        item.estado === "abierta" ? "badge-abierta" : "badge-proximamente"
    }`;

    document.getElementById("modal-detalle-modalidad").textContent = item.modalidad;
    document.getElementById("modal-detalle-duracion").textContent = item.duracion;
    document.getElementById("modal-detalle-horarios").textContent = item.horarios;
    document.getElementById("modal-detalle-inicio").textContent = item.inicio;
    document.getElementById("modal-detalle-descripcion").textContent = item.descripcionDetallada;
    document.getElementById("modal-detalle-audiencia").textContent = item.audiencia;

    // Lista de Requisitos
    const ulRequisitos = document.getElementById("modal-detalle-requisitos");
    ulRequisitos.replaceChildren();
    (item.requisitos || []).forEach(req => {
        const li = document.createElement("li");
        li.textContent = req;
        ulRequisitos.appendChild(li);
    });

    // Lista de Temario
    const ulTemario = document.getElementById("modal-detalle-temario");
    ulTemario.replaceChildren();
    (item.temario || []).forEach(tema => {
        const li = document.createElement("li");
        li.textContent = tema;
        ulTemario.appendChild(li);
    });

    // Actualizar enlace de inscripción
    const btnInscripcion = document.getElementById("btn-inscripcion-modal");
    btnInscripcion.href = `contacto.html?asunto=${encodeURIComponent("Consulta por " + item.titulo)}`;

    modalDetalle.showModal();
}

// Configuración de Eventos UI
function inicializarEventos() {
    // Pestañas (Tabs)
    botonesTabs.forEach(btn => {
        btn.addEventListener("click", () => {
            botonesTabs.forEach(b => {
                b.classList.remove("activo");
                b.setAttribute("aria-selected", "false");
            });

            btn.classList.add("activo");
            btn.setAttribute("aria-selected", "true");

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

    // Envío del Formulario A Medida
    if (formAMedida) {
        formAMedida.addEventListener("submit", (e) => {
            e.preventDefault();
            mensajeExitoMedida.style.display = "block";
            formAMedida.style.display = "none";

            setTimeout(() => {
                modalMedida.close();
            }, 3000);
        });
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    inicializarEventos();
    cargarCapacitaciones();
});
