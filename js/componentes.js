const raizProyecto = new URL("../", document.currentScript.src);

// Carga las plantillas compartidas, resuelve sus rutas y las inserta en la página.
async function cargarComponentes() {
    try {
        const respuesta = await fetch(
            new URL("componentes/estructura.html", raizProyecto)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la estructura compartida.");
        }

        const contenido = await respuesta.text();

        const documento = new DOMParser().parseFromString(
            contenido,
            "text/html"
        );

        const componentes = [
            ["plantilla-cabecera", "cabecera-compartida"],
            ["plantilla-pie", "pie-compartido"]
        ];

        for (const [idPlantilla, idContenedor] of componentes) {
            const plantilla = documento.getElementById(idPlantilla);
            const contenedor = document.getElementById(idContenedor);

            if (!plantilla || !contenedor) {
                throw new Error(`Falta el componente ${idPlantilla}.`);
            }

            const fragmento = plantilla.content.cloneNode(true);

            fragmento.querySelectorAll("[href], [src], [action]").forEach(elemento => {
                for (const atributo of ["href", "src", "action"]) {
                    const valor = elemento.getAttribute(atributo);

                    if (
                        !valor ||
                        valor.startsWith("#") ||
                        /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(valor)
                    ) {
                        continue;
                    }

                    elemento.setAttribute(
                        atributo,
                        new URL(valor, raizProyecto).href
                    );
                }
            });

            contenedor.replaceChildren(fragmento);
        }

        document.dispatchEvent(new Event("componentes-cargados"));
    } catch (error) {
        console.error(error);

        const contenedor = document.getElementById("cabecera-compartida");

        if (contenedor) {
            contenedor.textContent =
                "No se pudo cargar la navegación. Recargá la página.";
        }
    }
}

cargarComponentes();