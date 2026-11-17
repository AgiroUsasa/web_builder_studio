# WebBuilder Studio

Editor visual de sitios web en español, inspirado en el flujo de trabajo de Visual Studio Code.

## Cómo abrirlo

1. Descomprimí el proyecto.
2. Abrí la carpeta `web_builder_studio` en Visual Studio Code.
3. Abrí `index.html` en un navegador. También podés usar la extensión Live Server.
4. Para resaltado de sintaxis y autocompletado, necesitás conexión a internet porque CodeMirror se carga desde CDN. Si no hay conexión, el editor sigue funcionando como área de texto.

## Usar tu cuenta en otros dispositivos

Las cuentas y los proyectos se guardan en el servidor incluido (`server.js`, solo requiere Node 16 o superior, sin instalar nada más).

1. En la carpeta del proyecto ejecutá `node server.js` (o `npm start`).
2. Abrí `http://localhost:3000`.
3. Para entrar desde otro dispositivo de tu red (celular, otra PC) usá `http://IP-DE-TU-PC:3000`.
4. Para usarlo desde cualquier lugar, subí la carpeta a un hosting que ejecute Node (Render, Railway, Fly.io, un VPS…). Configurá un disco persistente y apuntá `DATA_DIR` a él; si el sitio va con HTTPS, definí `HTTPS=1`.

- Los datos quedan en `data/` (o en `DATA_DIR`): `users.json`, `sessions.json` y `projects/`. Hacé copias de esa carpeta.
- Las contraseñas se guardan con hash `scrypt` y salt; las sesiones usan una cookie HttpOnly.
- Si ya tenías una cuenta creada en este navegador, al iniciar sesión por primera vez con el servidor se sube automáticamente con sus proyectos (se te muestra un código de recuperación nuevo).
- Si se corta internet, los cambios se guardan en el dispositivo y se envían al volver la conexión.
- Si abrís `index.html` directamente (sin servidor), la app sigue funcionando en modo local, sin sincronizar.

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
- Guardado en tu cuenta (servidor) o, sin servidor, en el navegador.
- Exportación de una página HTML o del proyecto completo en ZIP.

## Estructura

- `index.html`: interfaz del editor.
- `css/styles.css`: estilos de la aplicación.
- `js/ads.js`: anuncios de la pantalla de Inicio.
- `server.js`: servidor de cuentas y proyectos.
- `js/app.js`: lógica del editor, constructor visual, archivos y exportación.
- `assets/`: carpeta de destino para las imágenes exportadas.

## Comentarios en el código

Los archivos están separados por bloques numerados y las plantillas HTML incluyen comentarios que explican qué hace cada sección. Podés modificar los textos, estilos y funciones directamente.

## Límites de esta versión

- La sincronización entre dispositivos requiere ejecutar `server.js`. Si dos dispositivos editan el mismo proyecto a la vez, prevalece el último guardado.
- El editor de código usa CodeMirror desde CDN para coloreado y autocompletado; requiere internet para cargar esa biblioteca.
- La vista previa ejecuta el HTML y JavaScript del proyecto dentro de un iframe local.
