/* ==========================================================
   ICONOS — Lucide (https://lucide.dev), licencia ISC.
   Van incrustados en este archivo: no necesitan internet ni librerías externas.
   Uso en HTML:  <i class="ic" data-icon="plus"></i>
   Uso en JS:    icon("plus")   (devuelve el SVG como texto)
========================================================== */
const WB_ICONS = {
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"></path><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path>",
  "plus": "<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"></line>",
  "file-down": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M12 18v-6\"></path><path d=\"m9 15 3 3 3-3\"></path>",
  "save": "<path d=\"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\"></path><path d=\"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7\"></path><path d=\"M7 3v4a1 1 0 0 0 1 1h7\"></path>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"></path>",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\"></path>",
  "x": "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>",
  "file-plus": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M9 15h6\"></path><path d=\"M12 18v-6\"></path>",
  "file-code": "<path d=\"M10 12.5 8 15l2 2.5\"></path><path d=\"m14 12.5 2 2.5-2 2.5\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z\"></path>",
  "folder-plus": "<path d=\"M12 10v6\"></path><path d=\"M9 13h6\"></path><path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"></path>",
  "image-plus": "<path d=\"M16 5h6\"></path><path d=\"M19 2v6\"></path><path d=\"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5\"></path><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"></path><circle cx=\"9\" cy=\"9\" r=\"2\"></circle>",
  "folder": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"></path>",
  "folder-open": "<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"></path>",
  "file": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path>",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M10 9H8\"></path><path d=\"M16 13H8\"></path><path d=\"M16 17H8\"></path>",
  "hash": "<line x1=\"4\" x2=\"20\" y1=\"9\" y2=\"9\"></line><line x1=\"4\" x2=\"20\" y1=\"15\" y2=\"15\"></line><line x1=\"10\" x2=\"8\" y1=\"3\" y2=\"21\"></line><line x1=\"16\" x2=\"14\" y1=\"3\" y2=\"21\"></line>",
  "braces": "<path d=\"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1\"></path><path d=\"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1\"></path>",
  "image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"></rect><circle cx=\"9\" cy=\"9\" r=\"2\"></circle><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"></path>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 16v-4\"></path><path d=\"M12 8h.01\"></path>",
  "files": "<path d=\"M20 7h-3a2 2 0 0 1-2-2V2\"></path><path d=\"M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z\"></path><path d=\"M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8\"></path>",
  "blocks": "<rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><path d=\"M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3\"></path>",
  "sliders": "<line x1=\"21\" x2=\"14\" y1=\"4\" y2=\"4\"></line><line x1=\"10\" x2=\"3\" y1=\"4\" y2=\"4\"></line><line x1=\"21\" x2=\"12\" y1=\"12\" y2=\"12\"></line><line x1=\"8\" x2=\"3\" y1=\"12\" y2=\"12\"></line><line x1=\"21\" x2=\"16\" y1=\"20\" y2=\"20\"></line><line x1=\"12\" x2=\"3\" y1=\"20\" y2=\"20\"></line><line x1=\"14\" x2=\"14\" y1=\"2\" y2=\"6\"></line><line x1=\"8\" x2=\"8\" y1=\"10\" y2=\"14\"></line><line x1=\"16\" x2=\"16\" y1=\"18\" y2=\"22\"></line>",
  "layout-template": "<rect width=\"18\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"9\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect><rect width=\"5\" height=\"7\" x=\"16\" y=\"14\" rx=\"1\"></rect>",
  "type": "<polyline points=\"4 7 4 4 20 4 20 7\"></polyline><line x1=\"9\" x2=\"15\" y1=\"20\" y2=\"20\"></line><line x1=\"12\" x2=\"12\" y1=\"4\" y2=\"20\"></line>",
  "layout-grid": "<rect width=\"7\" height=\"7\" x=\"3\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"3\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"14\" y=\"14\" rx=\"1\"></rect><rect width=\"7\" height=\"7\" x=\"3\" y=\"14\" rx=\"1\"></rect>",
  "pointer": "<path d=\"M14 4.1 12 6\"></path><path d=\"m5.1 8-2.9-.8\"></path><path d=\"m6 12-1.9 2\"></path><path d=\"M7.2 2.2 8 5.1\"></path><path d=\"M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z\"></path>",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"></rect><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"></path>",
  "panel-top": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M3 9h18\"></path>",
  "refresh": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path>",
  "monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"></rect><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"></line><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"></line>",
  "smartphone": "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"></rect><path d=\"M12 18h.01\"></path>",
  "code": "<path d=\"m18 16 4-4-4-4\"></path><path d=\"m6 8-4 4 4 4\"></path><path d=\"m14.5 4-5 16\"></path>",
  "palette": "<circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"></circle><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"></circle><path d=\"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z\"></path>",
  "log-out": "<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"></path><polyline points=\"16 17 21 12 16 7\"></polyline><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"></line>",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path><path d=\"m15 5 4 4\"></path>",
  "trash": "<path d=\"M3 6h18\"></path><path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"></path><path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"></path><line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"></line><line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"></line>",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path>",
  "ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle>",
  "upload": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"17 8 12 3 7 8\"></polyline><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"></line>",
  "sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"></path><path d=\"M20 3v4\"></path><path d=\"M22 5h-4\"></path><path d=\"M4 17v2\"></path><path d=\"M5 18H3\"></path>",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>",
  "eye-off": "<path d=\"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49\"></path><path d=\"M14.084 14.158a3 3 0 0 1-4.242-4.242\"></path><path d=\"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143\"></path><path d=\"m2 2 20 20\"></path>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>",
  "folder-kanban": "<path d=\"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z\"></path><path d=\"M8 10v4\"></path><path d=\"M12 10v2\"></path><path d=\"M16 10v6\"></path>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>",
  "settings": "<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2\"></path><path d=\"M12 20v2\"></path><path d=\"m4.93 4.93 1.41 1.41\"></path><path d=\"m17.66 17.66 1.41 1.41\"></path><path d=\"M2 12h2\"></path><path d=\"M20 12h2\"></path><path d=\"m6.34 17.66-1.41 1.41\"></path><path d=\"m19.07 4.93-1.41 1.41\"></path>",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>"
};
function icon(name, extraClass = "") {
  const body = WB_ICONS[name] || WB_ICONS["file"];
  return `<svg class="${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
/* Reemplaza cada <i data-icon="nombre"> por su SVG. */
function hydrateIcons(root = document) {
  root.querySelectorAll("i[data-icon]").forEach(el => { el.innerHTML = icon(el.dataset.icon); el.classList.add("ic"); el.removeAttribute("data-icon"); });
}

