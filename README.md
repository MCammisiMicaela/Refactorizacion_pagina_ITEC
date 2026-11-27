# Refactorización del sitio web de ITEC El Molino

**Proyecto académico grupal de desarrollo web** · Instituto Tecnológico El Molino (ITEC), Esperanza, Santa Fe, Argentina.

Este repositorio contiene una propuesta de refactorización del sitio institucional de ITEC El Molino. El trabajo reúne secciones informativas sobre la institución, sus tecnicaturas, formación, capacitaciones, servicios para empresas y novedades. Su finalidad es organizar los contenidos y ofrecer una experiencia de navegación más clara y consistente.

> **Alcance:** proyecto académico / prototipo. No se presenta como el sitio oficial en producción ni como un servicio institucional operativo. El repositorio se mantiene privado mientras se revisan las autorizaciones para compartir código, imágenes y contenidos.

## Tecnologías

- **HTML5:** estructura semántica de las páginas y formularios.
- **CSS3:** estilos por sección, componentes compartidos y adaptación a diferentes tamaños de pantalla.
- **JavaScript (vanilla):** navegación, carga dinámica de contenido, búsqueda, filtros, interacciones y validaciones.
- **JSON:** datos locales para el buscador, las noticias y las capacitaciones.
- **Git y GitHub:** trabajo colaborativo y control de versiones.

La versión revisada no requiere instalar un framework de frontend ni un sistema de gestión de paquetes para ejecutarse.

## Funcionalidades implementadas en el proyecto

- **Navegación compartida:** cabecera y pie de página reutilizables, cargados desde `componentes/estructura.html` mediante JavaScript.
- **Buscador interno:** consultas sobre un índice local en `datos/busqueda.json`, con normalización de tildes y mayúsculas; incluye sugerencias.
- **Noticias:** listado alimentado desde `datos/noticias.json`, filtros, paginación, vista de detalle y noticias destacadas en el inicio.
- **Capacitaciones:** tarjetas generadas a partir de datos JSON, filtros y ventanas de detalle.
- **Información institucional y académica:** tecnicaturas, páginas de carreras, infraestructura, servicios, formación profesional, ingresantes y otras secciones.
- **Formularios del prototipo:** validación en el navegador. El formulario de contacto prepara un correo en la aplicación del usuario; los formularios de suscripción/novedades son demostrativos y no almacenan datos ni envían correos automáticamente.
- **Consideraciones de accesibilidad:** etiquetas semánticas, enlace para saltar al contenido, indicadores ARIA en controles interactivos y soporte de teclado en distintos componentes.

Las funcionalidades están descritas a partir del código del repositorio; no equivalen a una auditoría integral ni a pruebas automatizadas aprobadas.

## Mi participación

Soy **[@MCammisiMicaela](https://github.com/MCammisiMicaela)**. Este es un **trabajo en equipo**, y las siguientes contribuciones son identificables en el historial de Git:

- **Sección Infraestructura:** desarrollo y ajustes de `paginas/infraestructura.html`, `css/infraestructura.css` y `js/infraestructura.js`.
- **Tecnicaturas y páginas de carreras:** desarrollo de páginas de oferta académica, estilos asociados y ajustes en navegación, búsqueda y contacto.
- **Servicios para empresas:** desarrollo de `paginas/servicios.html` y `css/servicios.css`, junto con ajustes de integración.
- **Integración y consistencia visual:** unificación de estilos CSS, correcciones generales y ajustes de integración entre distintas secciones del sitio.

**Evidencia en commits:**
- [Infraestructura](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/808ff8528a)
- [Tecnicaturas](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/3289cda8ca)
- [Servicios para empresas](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/305c4103c3)
- [Unificación de CSS](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/859b6db99d)

Estas referencias permiten revisar cambios concretos; la autoría se describe sin atribuirme el desarrollo completo del sitio.

### Colaboración

El historial también registra aportes de **[@alandra-dev](https://github.com/alandra-dev)** (entre otros, módulos iniciales de noticias y capacitaciones), **[@malenabreques-mb](https://github.com/malenabreques-mb)** (formación profesional y vinculación institucional) y **[@BrianFranzen09](https://github.com/BrianFranzen09)** (comentarios en el código). Algunas secciones recibieron integraciones y correcciones posteriores de varios integrantes.

## Estructura del repositorio

```text
.
├── index.html              # Página principal
├── componentes/
│   └── estructura.html     # Plantillas de cabecera y pie
├── css/                    # Estilos generales y por sección
├── datos/                  # JSON de búsqueda, noticias y capacitaciones
├── img/                    # Recursos gráficos del prototipo
├── js/                     # Interacciones y lógica del navegador
└── paginas/                # Secciones internas y páginas de carreras
```

## Cómo ejecutarlo localmente

El proyecto utiliza `fetch()` para cargar HTML y JSON. Por eso, **no es recomendable abrir `index.html` directamente con `file://`**: se debe servir el directorio a través de HTTP local.

1. Clonar el repositorio con una cuenta que tenga acceso:

   ```bash
   git clone https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC.git
   cd Refactorizacion_pagina_ITEC
   ```

2. Iniciar un servidor estático local (por ejemplo, con Python 3):

   ```bash
   python -m http.server 8000
   ```

   En Windows, si `python` no está disponible, se puede probar `py -m http.server 8000`. También se puede utilizar la extensión **Live Server** de VS Code.

3. Abrir en el navegador: **http://localhost:8000/**

No se necesita una base de datos ni un backend para visualizar las páginas y los datos locales incluidos en el prototipo.

## Recorrido sugerido para revisar el proyecto

1. Abrir el inicio y probar el menú en escritorio y en una pantalla angosta.
2. Entrar a **Tecnicaturas** y recorrer algunas páginas de carreras.
3. Explorar **Infraestructura** y **Servicios para empresas**.
4. Probar el buscador con términos con y sin tildes.
5. Revisar los filtros del listado de noticias y el detalle de una publicación.
6. Consultar capacitaciones y abrir sus detalles.
7. Probar validaciones de formularios **sin introducir datos personales reales**.

### Estado de calidad y siguientes mejoras

- [ ] Ejecutar y documentar pruebas manuales de navegación, enlaces, formularios y diseño responsive.
- [ ] Incorporar pruebas automatizadas para funciones aislables (por ejemplo, normalización y filtros).
- [ ] Añadir capturas autorizadas de las distintas páginas, sin información privada.
- [ ] Revisar accesibilidad y rendimiento con herramientas de navegador.
- [ ] Confirmar permisos de publicación y definir una demo o caso de estudio público para el portfolio.

## Uso de contenidos y visibilidad

El repositorio contiene material visual e información relacionada con una institución educativa. **No se debe asumir autorización para redistribuir, reutilizar o publicar logotipos, fotografías y otros recursos institucionales.**

Por el momento, este repositorio es **privado**. Una persona reclutadora sin acceso no podrá consultar este código ni los commits enlazados. Antes de mostrarlo públicamente se deberá acordar con el equipo y los responsables del contenido qué materiales pueden compartirse. Como alternativa, se puede preparar un caso de estudio con capturas autorizadas o una demo con contenido ficticio.

---

*Documentación de proyecto académico colaborativo, preparada para facilitar su evaluación técnica y la identificación de contribuciones verificables.*
