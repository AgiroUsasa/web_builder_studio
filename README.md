# WebBuilder Studio

Editor visual de sitios web en español, inspirado en el flujo de trabajo de Visual Studio Code.

## Cómo abrirlo

1. Descomprimí el proyecto.
2. Abrí la carpeta `web_builder_studio` en Visual Studio Code.
3. Abrí `index.html` en un navegador. También podés usar la extensión Live Server.
4. Para resaltado de sintaxis y autocompletado, necesitás conexión a internet porque CodeMirror se carga desde CDN. Si no hay conexión, el editor sigue funcionando como área de texto.

## Funciones

- Explorador de archivos y carpetas.
- Creación de páginas HTML dentro del mismo proyecto.
- Edición de HTML, CSS, JavaScript/Node.js, React (JSX/TSX), PHP, Java, C#, C++ y archivos de texto.
- Un único botón para agregar cualquier lenguaje o tipo de archivo; los archivos iniciales se pueden eliminar desde el menú de cada archivo.
- Editor CodeMirror con resaltado de sintaxis, números de línea y sugerencias de autocompletado.
- Constructor visual con bloques arrastrables.
- Vista previa adaptable a escritorio y móvil.
- Biblioteca de imágenes: importar, previsualizar y arrastrar imágenes al lienzo.
- Modo claro, modo oscuro o el del sistema. Se elige en Ajustes y se recuerda en este navegador.
- Ajustes en el botón de usuario (arriba a la derecha): apariencia y conexiones automáticas del proyecto abierto.
- Recuperar contraseña: al crear la cuenta se muestra un código de recuperación; con ese código y tu correo se cambia la contraseña desde "¿Olvidaste tu contraseña?". En Ajustes se puede generar un código nuevo.
- Publicidad en la pantalla de Inicio: banner con anuncios que rotan. Se editan en `js/ads.js` (poné `enabled: false` para quitarlos).
- Guardado local en el navegador.
- Exportación de una página HTML o del proyecto completo en ZIP.

## Estructura

- `index.html`: interfaz del editor.
- `css/styles.css`: estilos de la aplicación.
- `js/ads.js`: anuncios de la pantalla de Inicio.
- `js/app.js`: lógica del editor, constructor visual, archivos y exportación.
- `assets/`: carpeta de destino para las imágenes exportadas.

## Comentarios en el código

Los archivos están separados por bloques numerados y las plantillas HTML incluyen comentarios que explican qué hace cada sección. Podés modificar los textos, estilos y funciones directamente.

## Límites de esta versión

- El proyecto se guarda en el almacenamiento local del navegador; no sincroniza automáticamente entre dispositivos.
- El editor de código usa CodeMirror desde CDN para coloreado y autocompletado; requiere internet para cargar esa biblioteca.
- La vista previa ejecuta el HTML y JavaScript del proyecto dentro de un iframe local.
