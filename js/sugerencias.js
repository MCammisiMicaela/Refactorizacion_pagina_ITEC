const raizSugerencias = new URL("../", document.currentScript.src);

let contenidosSugerencias;

function cargarSugerencias() {
    if (!contenidosSugerencias) {
        contenidosSugerencias = fetch(
            new URL("datos/busqueda.json", raizSugerencias)
        )
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error("No se pudieron cargar las sugerencias.");
                }

                return respuesta.json();
            })
            .catch(error => {
                contenidosSugerencias = null;
                throw error;
            });
    }

    return contenidosSugerencias;
}

function normalizarSugerencia(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function iniciarSugerencias() {
    document.querySelectorAll(".buscador-sitio").forEach(formulario => {
        const campo = formulario.querySelector('input[type="search"]');

        if (!campo || campo.dataset.sugerencias === "listas") {
            return;
        }

        campo.dataset.sugerencias = "listas";
        campo.autocomplete = "off";
        campo.setAttribute("role", "combobox");
        campo.setAttribute("aria-autocomplete", "list");
        campo.setAttribute("aria-expanded", "false");

        const lista = document.createElement("ul");
        lista.id = `${campo.id}-sugerencias`;
        lista.className = "sugerencias-busqueda";
        lista.setAttribute("role", "listbox");
        lista.setAttribute("aria-label", "Sugerencias de búsqueda");
        lista.hidden = true;

        campo.setAttribute("aria-controls", lista.id);
        formulario.append(lista);

        let coincidencias = [];
        let opcionActiva = -1;
        let versionBusqueda = 0;

        function cerrarSugerencias() {
            versionBusqueda++;
            lista.hidden = true;
            opcionActiva = -1;
            campo.setAttribute("aria-expanded", "false");
            campo.removeAttribute("aria-activedescendant");
        }

        function seleccionarOpcion(indice) {
            opcionActiva = indice;

            [...lista.children].forEach((opcion, posicion) => {
                opcion.setAttribute(
                    "aria-selected",
                    String(posicion === indice)
                );
            });

            const opcion = lista.children[indice];

            if (opcion) {
                campo.setAttribute("aria-activedescendant", opcion.id);
                opcion.scrollIntoView({ block: "nearest" });
            }
        }

        function abrirResultado(indice) {
            const resultado = coincidencias[indice];

            if (resultado) {
                window.location.assign(
                    new URL(resultado.url, raizSugerencias).href
                );
            }
        }

        async function actualizarSugerencias() {
            cerrarSugerencias();

            const texto = normalizarSugerencia(campo.value);

            if (!texto) {
                return;
            }

            const versionActual = versionBusqueda;

            try {
                const contenidos = await cargarSugerencias();

                if (
                    versionActual !== versionBusqueda ||
                    document.activeElement !== campo
                ) {
                    return;
                }

                const palabrasConsulta = texto.split(/\s+/);

                coincidencias = contenidos
                    .filter(contenido => {
                        const titulo = normalizarSugerencia(contenido.titulo);

                        const palabrasClave = Array.isArray(contenido.palabras)
                            ? contenido.palabras.join(" ")
                            : contenido.palabras || "";

                        const palabrasContenido = normalizarSugerencia(
                            `${contenido.titulo} ${palabrasClave}`
                        )
                            .split(/[^\p{L}\p{N}]+/u)
                            .filter(Boolean);

                        return titulo.startsWith(texto) ||
                            palabrasConsulta.every(palabraConsulta =>
                                palabrasContenido.some(palabraContenido =>
                                    palabraContenido.startsWith(palabraConsulta)
                                )
                            );
                    })
                    .sort((primero, segundo) => {
                        const prioridadPrimero = normalizarSugerencia(
                            primero.titulo
                        ).startsWith(texto);

                        const prioridadSegundo = normalizarSugerencia(
                            segundo.titulo
                        ).startsWith(texto);

                        return Number(prioridadSegundo) - Number(prioridadPrimero);
                    })
                    .slice(0, 6);

                lista.replaceChildren();

                coincidencias.forEach((contenido, indice) => {
                    const opcion = document.createElement("li");

                    opcion.id = `${lista.id}-${indice}`;
                    opcion.textContent = contenido.titulo;
                    opcion.setAttribute("role", "option");
                    opcion.setAttribute("aria-selected", "false");

                    opcion.addEventListener("mousedown", evento => {
                        evento.preventDefault();
                    });

                    opcion.addEventListener("click", () => {
                        abrirResultado(indice);
                    });

                    lista.append(opcion);
                });

                const hayOpciones = coincidencias.length > 0;

                lista.hidden = !hayOpciones;
                campo.setAttribute("aria-expanded", String(hayOpciones));
            } catch (error) {
                console.error(error);
                cerrarSugerencias();
            }
        }

        campo.addEventListener("input", actualizarSugerencias);
        campo.addEventListener("focus", actualizarSugerencias);

        campo.addEventListener("keydown", evento => {
            if (lista.hidden) {
                return;
            }

            if (evento.key === "ArrowDown") {
                evento.preventDefault();

                seleccionarOpcion(
                    (opcionActiva + 1) % coincidencias.length
                );
            } else if (evento.key === "ArrowUp") {
                evento.preventDefault();

                seleccionarOpcion(
                    opcionActiva <= 0
                        ? coincidencias.length - 1
                        : opcionActiva - 1
                );
            } else if (evento.key === "Enter" && opcionActiva >= 0) {
                evento.preventDefault();
                abrirResultado(opcionActiva);
            } else if (evento.key === "Escape") {
                evento.preventDefault();
                evento.stopPropagation();
                cerrarSugerencias();
            } else if (evento.key === "Tab") {
                cerrarSugerencias();
            }
        });

        formulario.addEventListener("focusout", evento => {
            if (!formulario.contains(evento.relatedTarget)) {
                cerrarSugerencias();
            }
        });

        document.addEventListener("click", evento => {
            if (!formulario.contains(evento.target)) {
                cerrarSugerencias();
            }
        });

        formulario.addEventListener("submit", cerrarSugerencias);
    });
}

document.addEventListener("componentes-cargados", iniciarSugerencias);

iniciarSugerencias();