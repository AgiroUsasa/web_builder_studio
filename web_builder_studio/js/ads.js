/* ==========================================================
   PUBLICIDAD DE LA PANTALLA DE INICIO
   Los anuncios de abajo son de ejemplo: reemplazalos por los tuyos.
   - title / text: lo que se ve en el banner.
   - cta: texto del botón. url: enlace (debe empezar con http:// o https://). Si url está vacío, el anuncio no es clicable.
   - Para quitar la publicidad poné enabled: false.
   Con una red de anuncios real (por ejemplo Google AdSense) hay que registrarse y pegar su código; este banner no la reemplaza.
========================================================== */
const WB_ADS = {
  enabled: true,
  intervalMs: 8000,
  ads: [
    { title: "Tu marca puede estar acá", text: "Espacio publicitario disponible en la pantalla de inicio de WebBuilder Studio.", cta: "Anunciá con nosotros", url: "" },
    { title: "Promocioná tu negocio", text: "Llegá a quienes crean sitios web todos los días. Este es un anuncio de ejemplo.", cta: "Ver más", url: "" },
    { title: "Anuncio de ejemplo", text: "Cambiá este texto y el enlace en js/ads.js para mostrar tu propia publicidad.", cta: "Editar anuncios", url: "" }
  ]
};
