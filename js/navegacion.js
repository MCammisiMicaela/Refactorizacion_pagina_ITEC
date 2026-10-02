document.addEventListener("componentes-cargados", function () {
    const encabezado = document.querySelector(".encabezado");
    const menu = document.getElementById("menu-principal");
    const botonMenu = document.querySelector(".menu-boton");

    if (!encabezado || !menu || !botonMenu) {
        return;
    }

    const grupos = [...menu.querySelectorAll(".menu-grupo")];
    const seccionActual = document.body.dataset.seccion;
    const pantallaGrande = window.matchMedia("(min-width: 1100px)");

    function cerrarGrupos(excepto = null) {
        grupos.forEach(grupo => {
            if (grupo !== excepto) {
                grupo.open = false;
            }
        });
    }

    function cerrarMenu() {
        menu.classList.remove("menu-abierto");
        botonMenu.setAttribute("aria-expanded", "false");
        cerrarGrupos();
    }

    document.querySelectorAll(".menu a, .pie a[data-seccion]").forEach(enlace => {
        const destino = new URL(enlace.href);
        const paginaActual =
            destino.origin === window.location.origin &&
            destino.pathname === window.location.pathname &&
            destino.hash === "";

        enlace.removeAttribute("aria-current");

        if (paginaActual) {
            enlace.setAttribute("aria-current", "page");
        }

        enlace.classList.toggle(
            "menu-activo",
            paginaActual && enlace.closest(".menu") !== null
        );

        enlace.classList.toggle(
            "pie-contacto-activo",
            enlace.dataset.seccion === seccionActual &&
            enlace.closest(".pie") !== null
        );
    });

    grupos.forEach(grupo => {
        grupo.classList.toggle(
            "menu-grupo-activo",
            grupo.dataset.seccionMenu === seccionActual
        );

        grupo.addEventListener("toggle", function () {
            if (grupo.open) {
                cerrarGrupos(grupo);
            }
        });
    });

    botonMenu.addEventListener("click", function () {
        const abierto = botonMenu.getAttribute("aria-expanded") === "true";

        if (abierto) {
            cerrarMenu();
        } else {
            menu.classList.add("menu-abierto");
            botonMenu.setAttribute("aria-expanded", "true");
        }
    });

    menu.addEventListener("click", function (evento) {
        const enlace = evento.target.closest("a");

        if (!enlace) {
            return;
        }

        const destino = new URL(enlace.href);

        if (
            destino.pathname === window.location.pathname &&
            destino.hash
        ) {
            const bloque = document.getElementById(
                decodeURIComponent(destino.hash.slice(1))
            );

            if (bloque) {
                bloque.setAttribute("tabindex", "-1");
                bloque.focus({ preventScroll: true });
            }
        }

        cerrarMenu();
    });

    document.addEventListener("click", function (evento) {
        if (!encabezado.contains(evento.target)) {
            cerrarMenu();
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key !== "Escape") {
            return;
        }

        const grupoAbierto = grupos.find(grupo => grupo.open);

        if (grupoAbierto) {
            grupoAbierto.open = false;
            grupoAbierto.querySelector("summary").focus();
        } else if (menu.classList.contains("menu-abierto")) {
            cerrarMenu();
            botonMenu.focus();
        }
    });

    encabezado.addEventListener("focusout", function (evento) {
        if (!encabezado.contains(evento.relatedTarget)) {
            cerrarMenu();
        }
    });

    pantallaGrande.addEventListener("change", function () {
        const focoDentroDelMenu = menu.contains(document.activeElement);

        cerrarMenu();

        if (!pantallaGrande.matches && focoDentroDelMenu) {
            botonMenu.focus();
        }
    });
});