const raizInicio = new URL("../", document.currentScript.src);

async function cargarNoticiasDestacadas() {
    const contenedor = document.getElementById("noticias-destacadas");
    const estado = document.getElementById("estado-noticias");

    if (!contenedor || !estado) {
        return;
    }

    const formatoFecha = new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    try {
        const respuesta = await fetch(
            new URL("datos/noticias.json", raizInicio)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las noticias.");
        }

        const noticias = await respuesta.json();

        const destacadas = noticias
            .sort((a, b) => b.fecha.localeCompare(a.fecha))
            .slice(0, 3);

        contenedor.replaceChildren();

        if (destacadas.length === 0) {
            estado.textContent = "Todavía no hay noticias publicadas.";
            return;
        }

        const fragmento = document.createDocumentFragment();

        destacadas.forEach(noticia => {
            const articulo = document.createElement("article");
            articulo.className = "noticia-tarjeta";

            if (noticia.imagen) {
                const imagen = document.createElement("img");

                imagen.src = new URL(noticia.imagen, raizInicio).href;
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

            fecha.textContent = formatoFecha.format(
                new Date(anio, mes - 1, dia)
            );

            const titulo = document.createElement("h3");
            titulo.textContent = noticia.titulo;

            const resumen = document.createElement("p");
            resumen.className = "noticia-resumen";
            resumen.textContent = noticia.resumen;

            const enlace = document.createElement("a");
            enlace.className = "noticia-enlace";
            enlace.href = new URL(`paginas/noticia.html?id=${encodeURIComponent(noticia.id)}`, raizInicio).href;
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
        estado.textContent = "";
    } catch (error) {
        console.error(error);

        estado.textContent =
            "No pudimos cargar las noticias. Podés consultarlas en el sitio oficial.";
    }
}

cargarNoticiasDestacadas();