const raizBusqueda = new URL("../", document.currentScript.src);
const parametrosBusqueda = new URLSearchParams(window.location.search);
const consultaBusqueda = (parametrosBusqueda.get("q") || "").trim().slice(0, 100);

const campoBusqueda = document.getElementById("busqueda-resultados");
const estadoBusqueda = document.getElementById("estado-busqueda");
const listaResultados = document.getElementById("resultados-busqueda");

campoBusqueda.value = consultaBusqueda;

// Quita tildes y diferencias de mayúsculas para comparar consultas.
function normalizarBusqueda(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Sincroniza la consulta con el buscador de la cabecera compartida.
function completarBuscadorCabecera() {
    const campo = document.getElementById("busqueda-general");

    if (campo) {
        campo.value = consultaBusqueda;
    }
}

document.addEventListener(
    "componentes-cargados",
    completarBuscadorCabecera
);

completarBuscadorCabecera();

// Busca en el índice local y presenta resultados o mensajes de estado.
async function buscarContenido() {
    if (!consultaBusqueda) {
        return;
    }

    estadoBusqueda.textContent = "Buscando información…";

    try {
        const respuesta = await fetch(
            new URL("datos/busqueda.json", raizBusqueda)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el índice de búsqueda.");
        }

        const contenidos = await respuesta.json();
        const palabras = normalizarBusqueda(consultaBusqueda).split(/\s+/);

        const encontrados = contenidos.filter(contenido => {
            const texto = normalizarBusqueda(
                `${contenido.titulo} ${contenido.descripcion} ${contenido.palabras}`
            );

            return palabras.every(palabra => texto.includes(palabra));
        });

        listaResultados.replaceChildren();

        if (encontrados.length === 0) {
            estadoBusqueda.textContent =
                `No encontramos resultados para “${consultaBusqueda}”. ` +
                "Probá con otras palabras o con una búsqueda más breve.";
            return;
        }

        const cantidad = encontrados.length;

        estadoBusqueda.textContent =
            `${cantidad} ${cantidad === 1 ? "resultado" : "resultados"} ` +
            `para “${consultaBusqueda}”.`;

        const fragmento = document.createDocumentFragment();

        encontrados.forEach(contenido => {
            const elemento = document.createElement("li");
            const titulo = document.createElement("h3");
            const enlace = document.createElement("a");
            const descripcion = document.createElement("p");

            elemento.className = "resultado-busqueda";
            enlace.href = new URL(contenido.url, raizBusqueda).href;
            enlace.textContent = contenido.titulo;
            descripcion.textContent = contenido.descripcion;

            titulo.append(enlace);
            elemento.append(titulo, descripcion);
            fragmento.append(elemento);
        });

        listaResultados.append(fragmento);
    } catch (error) {
        console.error(error);

        estadoBusqueda.textContent =
            "No pudimos cargar la búsqueda. Recargá la página para volver a intentar.";
    }
}

buscarContenido();