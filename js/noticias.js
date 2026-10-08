const raizNoticias = new URL("../", document.currentScript.src);

const estado = {
    todasLasNoticias: [],
    noticiasFiltradas: [],
    busqueda: "",
    categoria: "todas",
    anio: "todos",
    paginaActual: 1,
    noticiasPorPagina: 6
};

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

// Normaliza texto para que la búsqueda no distinga tildes ni mayúsculas.
function normalizarTexto(texto = "") {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Carga las noticias y conecta filtros, selector de años y renderizado.
async function inicializarNoticias() {
    const contenedor = document.getElementById("contenedor-noticias");
    const estadoMensaje = document.getElementById("estado-noticias");

    if (!contenedor || !estadoMensaje) {
        return;
    }

    try {
        const respuesta = await fetch(
            new URL("datos/noticias.json", raizNoticias)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el listado de noticias.");
        }

        const noticias = await respuesta.json();
        estado.todasLasNoticias = noticias;

        poblarSelectorAnios(noticias);
        configurarEventos();
        aplicarFiltros();
    } catch (error) {
        console.error(error);
        estadoMensaje.textContent =
            "Ocurrió un error al cargar las noticias. Por favor, intentá nuevamente más tarde.";
    }
}

// Completa el selector con los años presentes en las noticias.
function poblarSelectorAnios(noticias) {
    const selectorAnio = document.getElementById("filtro-anio");
    if (!selectorAnio) return;

    const aniosSet = new Set();
    noticias.forEach(n => {
        if (n.fecha) {
            const anio = n.fecha.split("-")[0];
            if (anio) aniosSet.add(anio);
        }
    });

    const aniosOrdenados = Array.from(aniosSet).sort((a, b) => b - a);

    aniosOrdenados.forEach(anio => {
        const opcion = document.createElement("option");
        opcion.value = anio;
        opcion.textContent = anio;
        selectorAnio.append(opcion);
    });
}

// Conecta los controles de búsqueda, categoría, año y limpieza de filtros.
function configurarEventos() {
    const inputBusqueda = document.getElementById("busqueda-noticias");
    const selectCategoria = document.getElementById("filtro-categoria");
    const selectAnio = document.getElementById("filtro-anio");
    const botonLimpiar = document.getElementById("limpiar-filtros");

    if (inputBusqueda) {
        inputBusqueda.addEventListener("input", (e) => {
            estado.busqueda = normalizarTexto(e.target.value);
            estado.paginaActual = 1;
            aplicarFiltros();
        });
    }

    if (selectCategoria) {
        selectCategoria.addEventListener("change", (e) => {
            estado.categoria = e.target.value;
            estado.paginaActual = 1;
            aplicarFiltros();
        });
    }

    if (selectAnio) {
        selectAnio.addEventListener("change", (e) => {
            estado.anio = e.target.value;
            estado.paginaActual = 1;
            aplicarFiltros();
        });
    }

    if (botonLimpiar) {
        botonLimpiar.addEventListener("click", () => {
            if (inputBusqueda) inputBusqueda.value = "";
            if (selectCategoria) selectCategoria.value = "todas";
            if (selectAnio) selectAnio.value = "todos";

            estado.busqueda = "";
            estado.categoria = "todas";
            estado.anio = "todos";
            estado.paginaActual = 1;

            aplicarFiltros();
        });
    }
}

// Calcula las noticias coincidentes, las ordena y actualiza la vista.
function aplicarFiltros() {
    estado.noticiasFiltradas = estado.todasLasNoticias.filter(noticia => {
        const textoNoticia = normalizarTexto([
            noticia.titulo,
            noticia.resumen,
            ...(Array.isArray(noticia.contenido) ? noticia.contenido : [])
        ].join(" "));

        const coincideBusqueda =
            !estado.busqueda || textoNoticia.includes(estado.busqueda);

        const coincideCategoria =
            estado.categoria === "todas" || noticia.categoria === estado.categoria;

        const coincideAnio =
            estado.anio === "todos" || (noticia.fecha && noticia.fecha.startsWith(estado.anio));

        return coincideBusqueda && coincideCategoria && coincideAnio;
    });

    estado.noticiasFiltradas.sort((a, b) => b.fecha.localeCompare(a.fecha));

    renderizar();
}

// Renderiza la página actual de resultados y su control de paginación.
function renderizar() {
    const contenedor = document.getElementById("contenedor-noticias");
    const estadoMensaje = document.getElementById("estado-noticias");
    const contenedorPaginacion = document.getElementById("paginacion-noticias");

    if (!contenedor || !estadoMensaje || !contenedorPaginacion) return;

    contenedor.replaceChildren();

    if (estado.noticiasFiltradas.length === 0) {
        estadoMensaje.textContent =
            "No se encontraron noticias que coincidan con los criterios de búsqueda.";
        contenedorPaginacion.replaceChildren();
        return;
    }

    estadoMensaje.textContent = "";

    const totalPaginas = Math.ceil(
        estado.noticiasFiltradas.length / estado.noticiasPorPagina
    );

    if (estado.paginaActual > totalPaginas) {
        estado.paginaActual = 1;
    }

    const inicio = (estado.paginaActual - 1) * estado.noticiasPorPagina;
    const fin = inicio + estado.noticiasPorPagina;
    const paginaNoticias = estado.noticiasFiltradas.slice(inicio, fin);

    const fragmento = document.createDocumentFragment();

    paginaNoticias.forEach(noticia => {
        const articulo = document.createElement("article");
        articulo.className = "noticia-tarjeta";

        if (noticia.imagen) {
            const imagen = document.createElement("img");
            imagen.src = new URL(noticia.imagen, raizNoticias).href;
            imagen.alt = "";
            imagen.className = "noticia-imagen";
            imagen.loading = "lazy";
            imagen.width = 640;
            imagen.height = 400;

            imagen.addEventListener("error", () => {
                imagen.remove();
            });

            articulo.append(imagen);
        }

        const contenido = document.createElement("div");
        contenido.className = "noticia-contenido";

        const categoria = document.createElement("p");
        categoria.className = "noticia-categoria";
        categoria.textContent = noticia.categoria;

        const fecha = document.createElement("time");
        fecha.className = "noticia-fecha";
        fecha.dateTime = noticia.fecha;

        const [anio, mes, dia] = noticia.fecha.split("-").map(Number);
        fecha.textContent = formatoFecha.format(new Date(anio, mes - 1, dia));

        const titulo = document.createElement("h3");
        titulo.textContent = noticia.titulo;

        const resumen = document.createElement("p");
        resumen.className = "noticia-resumen";
        resumen.textContent = noticia.resumen;

        const enlace = document.createElement("a");
        enlace.className = "noticia-enlace";
        enlace.href = `noticia.html?id=${encodeURIComponent(noticia.id)}`;
        enlace.innerHTML = `Leer noticia completa <span aria-hidden="true">→</span>`;
        enlace.setAttribute(
            "aria-label",
            `Leer noticia completa: ${noticia.titulo}`
        );

        contenido.append(categoria, fecha, titulo, resumen, enlace);
        articulo.append(contenido);
        fragmento.append(articulo);
    });

    contenedor.append(fragmento);

    renderizarPaginacion(totalPaginas, contenedorPaginacion);
}

// Genera controles anterior, numéricos y siguiente según la página actual.
function renderizarPaginacion(totalPaginas, contenedorPaginacion) {
    contenedorPaginacion.replaceChildren();

    if (totalPaginas <= 1) {
        return;
    }

    const fragmento = document.createDocumentFragment();

    // Botón Anterior
    const botonAnterior = document.createElement("button");
    botonAnterior.type = "button";
    botonAnterior.className = "paginacion-boton";
    botonAnterior.textContent = "« Anterior";
    botonAnterior.disabled = estado.paginaActual === 1;
    botonAnterior.addEventListener("click", () => {
        if (estado.paginaActual > 1) {
            estado.paginaActual--;
            renderizar();
            desplazarAlInicio();
        }
    });
    fragmento.append(botonAnterior);

    // Botones numéricos
    for (let i = 1; i <= totalPaginas; i++) {
        const botonPagina = document.createElement("button");
        botonPagina.type = "button";
        botonPagina.className = "paginacion-boton";
        if (i === estado.paginaActual) {
            botonPagina.classList.add("paginacion-boton--activo");
            botonPagina.setAttribute("aria-current", "page");
        }
        botonPagina.textContent = i;
        botonPagina.addEventListener("click", () => {
            estado.paginaActual = i;
            renderizar();
            desplazarAlInicio();
        });
        fragmento.append(botonPagina);
    }

    // Botón Siguiente
    const botonSiguiente = document.createElement("button");
    botonSiguiente.type = "button";
    botonSiguiente.className = "paginacion-boton";
    botonSiguiente.textContent = "Siguiente »";
    botonSiguiente.disabled = estado.paginaActual === totalPaginas;
    botonSiguiente.addEventListener("click", () => {
        if (estado.paginaActual < totalPaginas) {
            estado.paginaActual++;
            renderizar();
            desplazarAlInicio();
        }
    });
    fragmento.append(botonSiguiente);

    contenedorPaginacion.append(fragmento);
}

// Lleva el foco visual al inicio del contenido después de cambiar de página.
function desplazarAlInicio() {
    const puntoEnfoque = document.getElementById("contenido");
    if (puntoEnfoque) {
        puntoEnfoque.scrollIntoView({ behavior: "smooth" });
    }
}

inicializarNoticias();
