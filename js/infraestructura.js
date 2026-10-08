const visorImagen = document.getElementById("visor-imagen");
const visorFoto = document.getElementById("visor-foto");
const visorTitulo = document.getElementById("visor-titulo");
const visorDescripcion = document.getElementById("visor-descripcion");
const cerrarVisor = document.getElementById("cerrar-visor");

let elementoAnterior = null;

// Abre el visor modal con la imagen seleccionada y guarda el foco de retorno.
function abrirImagen(imagen, titulo, origen) {
    elementoAnterior = origen;

    visorFoto.src = imagen.currentSrc || imagen.src;
    visorFoto.alt = imagen.alt;
    visorTitulo.textContent = titulo;
    visorDescripcion.textContent = imagen.alt;

    visorImagen.showModal();
    document.documentElement.classList.add("visor-abierto");
}

// Convierte las imágenes de los espacios en controles para abrir el visor.
document.querySelectorAll(".espacio-imagen").forEach((imagen) => {
    const tarjeta = imagen.closest(".espacio-tarjeta");
    const titulo = tarjeta?.querySelector("h3")?.textContent.trim()
        || "Imagen del espacio";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "espacio-imagen-boton";
    boton.setAttribute("aria-label", `Ampliar imagen: ${titulo}`);
    boton.setAttribute("aria-haspopup", "dialog");

    imagen.before(boton);
    boton.append(imagen);

    boton.addEventListener("click", () => {
        abrirImagen(imagen, titulo, boton);
    });
});

// Intercepta los enlaces a fotografías y los muestra ampliados en el visor.
document.querySelectorAll(".infraestructura-foto > a").forEach((enlace) => {
    const imagen = enlace.querySelector("img");

    if (!imagen) {
        return;
    }

    const titulo = enlace.closest("figure")
        ?.querySelector("figcaption strong")
        ?.textContent.trim() || "Fotografía ampliada";

    enlace.setAttribute("aria-haspopup", "dialog");

    enlace.addEventListener("click", (evento) => {
        if (
            evento.ctrlKey ||
            evento.metaKey ||
            evento.shiftKey ||
            evento.altKey
        ) {
            return;
        }

        evento.preventDefault();
        abrirImagen(imagen, titulo, enlace);
    });
});

// Cierra el visor y restaura el foco al elemento que lo abrió.
cerrarVisor.addEventListener("click", () => {
    visorImagen.close();
});

visorImagen.addEventListener("click", (evento) => {
    if (evento.target !== visorImagen) {
        return;
    }

    const limites = visorImagen.getBoundingClientRect();

    const fueraDelVisor =
        evento.clientX < limites.left ||
        evento.clientX > limites.right ||
        evento.clientY < limites.top ||
        evento.clientY > limites.bottom;

    if (fueraDelVisor) {
        visorImagen.close();
    }
});

visorImagen.addEventListener("close", () => {
    document.documentElement.classList.remove("visor-abierto");

    visorFoto.removeAttribute("src");
    visorFoto.alt = "";

    if (elementoAnterior?.isConnected) {
        elementoAnterior.focus({ preventScroll: true });
    }
});