# Reingeniería del ecosistema digital ITEC

**Análisis, rediseño y prototipo funcional del sitio web de ITEC El Molino**

**Proyecto académico grupal** · Tecnicatura Superior en Desarrollo de Software · Programación II · 3.er año · 2026

> **Nota:** Este proyecto es una propuesta académica de reingeniería del sitio del Instituto Tecnológico El Molino (ITEC), de Esperanza, Santa Fe. **No es el sitio oficial en producción** ni una implementación contratada por la institución. Su código y contenidos se mantienen privados mientras se verifican los permisos de difusión.

## Descripción del proyecto

El proyecto surge del análisis integral del sitio web de ITEC El Molino. El objetivo fue **detectar problemas de usabilidad, accesibilidad, arquitectura de la información, navegación y consistencia visual**, proponer mejoras técnicamente viables y materializarlas en un **prototipo de rediseño navegable**.

El trabajo se desarrolló en dos etapas complementarias:

1. **Investigación y diagnóstico:** evaluación de las páginas originales, identificación de fortalezas y dificultades, y elaboración de propuestas de mejora.
2. **Diseño y desarrollo:** reorganización del sitio, creación de nuevas interfaces y desarrollo de funcionalidades con HTML, CSS, JavaScript y datos locales en JSON.

El análisis original abarcó **Inicio, Institucional, Formación, Servicios y Contacto**, junto con sus subsecciones, desde la perspectiva de futuros estudiantes, estudiantes actuales, empresas y otros visitantes.

**Documento de referencia:** informe final académico *Reingeniería del Ecosistema Digital ITEC*, entregado el **7 de octubre de 2026** en la materia **Programación II**.

## Del diagnóstico a la implementación

El informe académico identificó problemas concretos en el sitio original. En la siguiente tabla se relacionan los hallazgos y propuestas con elementos que pueden encontrarse en el **código de este repositorio**.

| Problema observado en el sitio original | Respuesta desarrollada en el prototipo |
| --- | --- |
| Acciones importantes, como ver carreras o consultar inscripciones, poco visibles en Inicio | Portada con enlaces directos a tecnicaturas, requisitos y consultas, además de bloques resumidos para acceder a otras secciones. |
| Navegación con categorías poco descriptivas y recorridos extensos | Menú reorganizado con apartados como **Estudiar en ITEC**, **Ingresantes** y **Servicios para empresas**, y accesos internos específicos. |
| Carreras concentradas en una página extensa | Presentación de **seis tecnicaturas** en tarjetas y páginas individuales para consultar sus detalles. |
| Noticias distribuidas en una línea de tiempo con grandes espacios vacíos | Listado en tarjetas, búsqueda, filtros por categoría y año, paginación y páginas de detalle. |
| Dificultad para encontrar información específica | Buscador general sobre un índice local, con normalización de tildes y mayúsculas y sugerencias de búsqueda. |
| Presentación de servicios empresariales poco orientada a la acción | Sección **Servicios para empresas** con alternativas diferenciadas y accesos a consulta. |
| Cursos y capacitaciones con disponibilidad difícil de interpretar | Presentación y filtros para diferenciar ofertas formativas, más información de detalle sobre capacitaciones. |
| Componentes visuales y formularios con criterios desiguales | Estilos compartidos, componentes reutilizables, etiquetas en español y validaciones del lado del cliente. |
| Necesidad de reforzar accesibilidad y uso desde dispositivos móviles | Estructuras semánticas, atributos ARIA en controles, navegación por teclado en componentes concretos y reglas CSS adaptativas. |

**Importante:** la tabla documenta decisiones de diseño y funcionalidades presentes en el código; **no significa que se haya comprobado formalmente el cumplimiento de WCAG, el rendimiento del sitio o el funcionamiento de todos los dispositivos**.

### Criterios de rediseño

El informe también propuso utilizar una navegación orientada a las tareas de los usuarios, establecer una jerarquía visual clara, simplificar formularios, conservar un idioma uniforme y avanzar hacia un pequeño **sistema de diseño institucional**. Estas propuestas guiaron el desarrollo, pero no se presenta el proyecto como un design system terminado o auditado.

## Tecnologías utilizadas

| Tecnología | Aplicación dentro del proyecto |
| --- | --- |
| **HTML5** | Estructura de páginas, formularios, navegación y contenido semántico. |
| **CSS3** | Diseño visual, componentes compartidos y estilos adaptativos. |
| **JavaScript (vanilla)** | Interacciones, navegación, filtros, renderizado dinámico, buscador y validaciones. |
| **JSON** | Almacenamiento local de los datos de noticias, capacitaciones y búsqueda. |
| **Git y GitHub** | Versionado, ramas, integración y colaboración del equipo. |

No se utilizó un framework de frontend ni se requiere una base de datos o backend para visualizar esta versión del prototipo.

## Funcionalidades y decisiones técnicas

### Arquitectura y navegación

- Las plantillas de cabecera y pie están centralizadas en `componentes/estructura.html`.
- `js/componentes.js` las carga mediante `fetch()`, inserta sus fragmentos en cada página y adapta las rutas relativas a la raíz del proyecto.
- `js/navegacion.js` administra el menú, los submenús y los estados de navegación.
- Existen páginas específicas para institucional, historia, infraestructura, vinculación, formación, tecnicaturas, carreras, ingresantes, servicios, noticias y contacto.

### Contenidos y búsqueda

- `datos/busqueda.json` es el índice del buscador interno.
- `js/busqueda.js` realiza búsquedas que ignoran mayúsculas y tildes.
- `js/sugerencias.js` ofrece sugerencias sobre ese índice.
- `datos/noticias.json` alimenta el listado, los filtros y los detalles de las publicaciones.
- `datos/capacitaciones.json` alimenta tarjetas, filtros y ventanas de detalle.

Estos contenidos se cargan desde archivos locales; **no se implementó un CMS ni una API de producción**.

### Interacciones y formularios

- La sección Infraestructura incluye un visor de imágenes que permite ampliar fotografías y devolver el foco al control anterior.
- El sitio contiene menús, filtros y diálogos interactivos con distintas consideraciones de accesibilidad.
- Los formularios realizan validaciones en el navegador.
- **Contacto y consultas de capacitación:** preparan mensajes mediante enlaces `mailto:`, para que el usuario los revise y envíe desde su aplicación de correo.
- **Boletín, novedades y preinscripción:** son **simulaciones académicas**. No almacenan datos, no registran inscripciones reales y no envían correos automáticamente.

## Mi participación en el equipo

**Micaela Cammisi — [@MCammisiMicaela](https://github.com/MCammisiMicaela)**

El proyecto fue desarrollado de manera **colaborativa**. El informe final es un trabajo grupal; por eso, los siguientes aportes individuales se respaldan específicamente con el historial de commits del repositorio.

| Área | Contribuciones que pueden verificarse |
| --- | --- |
| **Infraestructura** | Desarrollo de la sección, estilos e interacción con imágenes, incluyendo `paginas/infraestructura.html`, `css/infraestructura.css` y `js/infraestructura.js`. |
| **Tecnicaturas y carreras** | Desarrollo de la página de tecnicaturas, páginas individuales de carreras y sus estilos; ajustes vinculados con búsqueda y contacto. |
| **Servicios para empresas** | Desarrollo de la página y sus estilos, junto con ajustes para integrar los recorridos de consulta. |
| **Integración y mantenimiento visual** | Unificación de archivos CSS, correcciones generales y ajustes de consistencia entre secciones desarrolladas por el equipo. |

**Commits de referencia:**

- [Desarrollo de Infraestructura](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/808ff8528a)
- [Desarrollo de Tecnicaturas](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/3289cda8ca)
- [Desarrollo de Servicios para empresas](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/305c4103c3)
- [Unificación de CSS](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/859b6db99d)
- [Correcciones generales](https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC/commit/acf37420cc)

Estos enlaces son **evidencias de cambios registrados**, no una atribución exclusiva de todo el proyecto.

### Integrantes

El informe académico fue presentado por:

- **Malena Breques** — [@malenabreques-mb](https://github.com/malenabreques-mb): el historial registra, entre otros, desarrollos de Formación Profesional y Vinculación institucional.
- **Micaela Cammisi** — [@MCammisiMicaela](https://github.com/MCammisiMicaela): aportes detallados en el apartado anterior.
- **Brian Franzen** — [@BrianFranzen09](https://github.com/BrianFranzen09): el historial registra un commit de comentarios en el código.
- **Agostina Landra** — [@alandra-dev](https://github.com/alandra-dev): el historial registra, entre otros, el desarrollo inicial de módulos de Noticias y Capacitaciones.

Las tareas de análisis y elaboración del informe fueron presentadas **en conjunto**. No se atribuyen contribuciones individuales de investigación o diseño que el historial por sí solo no permita confirmar.

## Estructura del proyecto

```text
Refactorizacion_pagina_ITEC/
├── index.html              # Página de inicio
├── componentes/
│   └── estructura.html     # Cabecera y pie reutilizables
├── css/                    # Estilos generales y de cada sección
├── datos/
│   ├── busqueda.json       # Índice del buscador
│   ├── capacitaciones.json # Datos de capacitaciones
│   └── noticias.json       # Datos de publicaciones
├── img/                    # Fotografías e ilustraciones
├── js/                     # Componentes, navegación e interacciones
└── paginas/
    ├── carreras/           # Páginas específicas de tecnicaturas
    └── ...                 # Secciones internas del sitio
```

## Cómo ejecutar el prototipo

Se necesita un navegador moderno y un **servidor HTTP local**. No basta con abrir `index.html` mediante `file://`, porque JavaScript utiliza `fetch()` para cargar componentes y archivos JSON.

1. Clonar el repositorio usando una cuenta con acceso:

   ```bash
   git clone https://github.com/MCammisiMicaela/Refactorizacion_pagina_ITEC.git
   cd Refactorizacion_pagina_ITEC
   ```

2. Iniciar un servidor estático. Por ejemplo, con **Python 3**:

   ```bash
   python -m http.server 8000
   ```

   En Windows también puede funcionar `py -m http.server 8000`. Otra opción es usar **Live Server** de Visual Studio Code.

3. Abrir **http://localhost:8000/**.

### Recorrido sugerido

1. Consultar los accesos principales y el menú del inicio.
2. Explorar las seis tecnicaturas y la página de **Desarrollo de Software**.
3. Revisar **Infraestructura**, sus fotografías y el visor de imágenes.
4. Comparar las opciones en **Servicios para empresas**.
5. Probar el buscador con palabras que contengan tildes.
6. Explorar filtros de noticias y capacitaciones.
7. Revisar los formularios como **demostraciones** y comprobar sus mensajes sin utilizar datos personales reales.

## Evidencia académica y estado del proyecto

El informe final entregado con el trabajo incluye:

- Análisis de las páginas originales, con capturas y observaciones.
- Evaluación de **usabilidad, accesibilidad y diseño visual**.
- Tabla de dificultades detectadas y propuestas de mejora.
- Propuesta de arquitectura de navegación.
- Capturas del **prototipo desarrollado**: desde Inicio, Infraestructura y Tecnicaturas hasta Noticias, Contacto y Buscador.

Las capturas del informe corresponden al **prototipo académico**. El README **no reproduce ni adjunta por el momento el PDF ni esas imágenes**, hasta revisar qué recursos institucionales y del equipo pueden difundirse.

### Aspectos pendientes de verificar o mejorar

- [ ] Pruebas manuales documentadas de navegación, enlaces, formularios y vistas móviles.
- [ ] Pruebas automatizadas de funciones aisladas, como búsqueda, normalización y filtros.
- [ ] Revisión de accesibilidad con herramientas y pruebas de teclado.
- [ ] Revisión de imágenes, datos y licencias antes de cualquier publicación.
- [ ] Capturas propias y autorizadas que muestren el resultado final.
- [ ] Una demo o caso de estudio público, si se cuenta con las autorizaciones necesarias.

> El análisis del **sitio original** no debe confundirse con una auditoría del prototipo implementado. La presencia de una solución en el código tampoco acredita por sí sola que haya sido probada en todos los escenarios.

## Privacidad y uso del material

Este es un **repositorio privado**. Sin acceso autorizado no es posible consultar su contenido ni los commits enlazados. La publicación del código, las fotografías, los logotipos y otros materiales institucionales debe acordarse previamente con los integrantes del equipo y los titulares de los contenidos.

Como alternativa para un portfolio laboral se puede preparar una **demo con información ficticia** o un **caso de estudio con capturas autorizadas**, manteniendo el código original privado.

---

**Trabajo académico grupal — Programación II, 2026.** Documentación complementada a partir del informe final *Reingeniería del Ecosistema Digital ITEC* y de las funcionalidades y commits verificables en este repositorio.
