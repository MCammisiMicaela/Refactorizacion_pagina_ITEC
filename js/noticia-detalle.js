const raizNoticiaDetalle = new URL("../", document.currentScript.src);

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

async function cargarDetalleNoticia() {
    const contenedor = document.getElementById("noticia-detalle");
    const estadoMensaje = document.getElementById("estado-noticia-detalle");
    const rutaTitulo = document.getElementById("ruta-noticia-titulo");

    if (!contenedor || !estadoMensaje) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idNoticia = parametros.get("id");

    if (!idNoticia) {
        mostrarError("No se especificó ninguna noticia.");
        return;
    }

    try {
        const respuesta = await fetch(
            new URL("datos/noticias.json", raizNoticiaDetalle)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la información de las noticias.");
        }

        const noticias = await respuesta.json();
        const noticia = noticias.find(n => n.id === idNoticia);

        if (!noticia) {
            mostrarError("La noticia solicitada no existe o fue removida.");
            return;
        }

        document.title = `${noticia.titulo} | ITEC El Molino`;
        if (rutaTitulo) {
            rutaTitulo.textContent = noticia.titulo;
        }

        renderizarNoticia(noticia, contenedor);
        estadoMensaje.textContent = "";

        cargarNoticiasRelacionadas(noticias, noticia.id);
    } catch (error) {
        console.error(error);
        mostrarError("Ocurrió un error al cargar el contenido de la noticia.");
    }
}

function mostrarError(mensajeText) {
    const estadoMensaje = document.getElementById("estado-noticia-detalle");
    const contenedor = document.getElementById("noticia-detalle");

    if (contenedor) contenedor.replaceChildren();

    if (estadoMensaje) {
        estadoMensaje.innerHTML = `
            <p>${mensajeText}</p>
            <p><a href="noticias.html" class="noticia-enlace">← Volver al listado de noticias</a></p>
        `;
    }
}

function renderizarNoticia(noticia, contenedor) {
    contenedor.replaceChildren();

    // Encabezado
    const cabecera = document.createElement("header");
    cabecera.className = "noticia-detalle-cabecera";

    const meta = document.createElement("div");
    meta.className = "noticia-detalle-meta";

    const categoria = document.createElement("span");
    categoria.className = "noticia-detalle-categoria";
    categoria.textContent = noticia.categoria;

    const fecha = document.createElement("time");
    fecha.className = "noticia-detalle-fecha";
    fecha.dateTime = noticia.fecha;

    const [anio, mes, dia] = noticia.fecha.split("-").map(Number);
    fecha.textContent = formatoFecha.format(new Date(anio, mes - 1, dia));

    meta.append(categoria, fecha);

    const titulo = document.createElement("h1");
    titulo.className = "noticia-detalle-titulo";
    titulo.textContent = noticia.titulo;

    const resumen = document.createElement("p");
    resumen.className = "noticia-detalle-resumen";
    resumen.textContent = noticia.resumen;

    cabecera.append(meta, titulo, resumen);
    contenedor.append(cabecera);

    // Imagen principal
    if (noticia.imagen) {
        const figura = document.createElement("figure");
        figura.className = "noticia-detalle-figura";

        const imagen = document.createElement("img");
        imagen.src = new URL(noticia.imagen, raizNoticiaDetalle).href;
        imagen.alt = "";
        imagen.className = "noticia-detalle-imagen";

        imagen.addEventListener("error", () => {
            figura.remove();
        });

        figura.append(imagen);
        contenedor.append(figura);
    }

    // Cuerpo con párrafos
    const cuerpo = document.createElement("div");
    cuerpo.className = "noticia-detalle-cuerpo";

    if (Array.isArray(noticia.contenido) && noticia.contenido.length > 0) {
        noticia.contenido.forEach(parrafoTexto => {
            const p = document.createElement("p");
            p.textContent = parrafoTexto;
            cuerpo.append(p);
        });
    } else {
        const p = document.createElement("p");
        p.textContent = noticia.resumen;
        cuerpo.append(p);
    }

    contenedor.append(cuerpo);

    // Fuente oficial de respaldo
    if (noticia.urlOficial) {
        const fuente = document.createElement("div");
        fuente.className = "noticia-detalle-fuente";

        const pFuente = document.createElement("p");
        pFuente.innerHTML = `Noticia publicada originalmente en el sitio web de ITEC. <a href="${noticia.urlOficial}" target="_blank" rel="noopener noreferrer">Ver nota original en el portal institucional ↗</a>`;

        fuente.append(pFuente);
        contenedor.append(fuente);
    }
}

function cargarNoticiasRelacionadas(todas, idActual) {
    const contenedorRelacionadas = document.getElementById(
        "contenedor-noticias-relacionadas"
    );

    if (!contenedorRelacionadas) return;

    const otras = todas
        .filter(n => n.id !== idActual)
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .slice(0, 3);

    contenedorRelacionadas.replaceChildren();

    if (otras.length === 0) {
        const sec = document.querySelector(".noticias-relacionadas");
        if (sec) sec.style.display = "none";
        return;
    }

    const fragmento = document.createDocumentFragment();

    otras.forEach(noticia => {
        const articulo = document.createElement("article");
        articulo.className = "noticia-tarjeta";

        if (noticia.imagen) {
            const imagen = document.createElement("img");
            imagen.src = new URL(noticia.imagen, raizNoticiaDetalle).href;
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
        enlace.innerHTML = `Leer noticia <span aria-hidden="true">→</span>`;

        contenido.append(categoria, fecha, titulo, resumen, enlace);
        articulo.append(contenido);
        fragmento.append(articulo);
    });

    contenedorRelacionadas.append(fragmento);
}

cargarDetalleNoticia();
