/* ==========================================================
   WEBBUILDER STUDIO — APLICACIÓN PRINCIPAL
   Organización: 1) Estado 2) Archivos 3) Editor 4) Vista previa
   5) Bloques y arrastrar/soltar 6) Imágenes 7) Guardado/exportación.
========================================================== */

/* 1. ESTADO DEL PROYECTO: cada ruta representa un archivo editable. */
/* Todo HTML nuevo empieza con esta estructura base. */
const htmlDoc = (body="  ") => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
${body}
</body>
</html>`;
const starterHTML = htmlDoc(`  <!-- BLOQUE 1: PORTADA. Cambiá el título y el texto de presentación. -->
  <section class="hero" data-wb-block="hero">
    <p class="eyebrow">BIENVENIDO A MI SITIO</p>
    <h1>Creá algo <span>increíble.</span></h1>
    <p>Esta página fue creada con WebBuilder Studio. Editá los bloques y personalizala.</p>
    <a class="button" href="#servicios">Empezar</a>
  </section>

  <!-- BLOQUE 2: SERVICIOS. Podés duplicar o modificar las tarjetas. -->
  <section class="section" id="servicios" data-wb-block="cards">
    <h2>Mis servicios</h2>
    <div class="cards">
      <article><h3>Diseño web</h3><p>Diseños modernos y adaptables.</p></article>
      <article><h3>Desarrollo</h3><p>Ideas convertidas en páginas reales.</p></article>
      <article><h3>Creatividad</h3><p>Un espacio para mostrar tu proyecto.</p></article>
    </div>
  </section>

  <!-- BLOQUE 3: PIE DE PÁGINA. -->
  <footer data-wb-block="footer"><p>© 2026 Mi sitio web</p></footer>`);
const starterCSS = `/* BLOQUE 1: COLORES Y CONFIGURACIÓN GENERAL */
:root { --accent: #7857f5; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; color: #20243a; }

/* BLOQUE 2: PORTADA PRINCIPAL */
.hero { min-height: 390px; padding: 75px 9%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; background: #f4f2ff; }
.eyebrow { color: var(--accent); font-size: 12px; font-weight: bold; letter-spacing: 2px; }
h1 { max-width: 650px; margin: 10px 0; font-size: clamp(40px, 7vw, 68px); line-height: 1.05; }
h1 span { color: var(--accent); }
.hero p:not(.eyebrow) { max-width: 520px; color: #62677a; line-height: 1.7; }
.button { display: inline-block; margin-top: 15px; padding: 13px 20px; color: white; background: var(--accent); border-radius: 7px; text-decoration: none; }

/* BLOQUE 3: TARJETAS Y SECCIONES */
.section { padding: 60px 9%; }
.section h2 { font-size: 32px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.cards article { padding: 23px; border: 1px solid #e5e6ed; border-radius: 12px; }
.cards p { color: #686d7c; line-height: 1.6; }
footer { padding: 24px 9%; color: #777; background: #f5f5f7; }
@media(max-width:650px) { .cards { grid-template-columns: 1fr; } .hero { padding: 55px 7%; } .section { padding: 45px 7%; } }`;
const starterJS = `// BLOQUE 1: JAVASCRIPT DEL SITIO
// Escribí acá las interacciones de tu página.
console.log("¡WebBuilder Studio está funcionando!");`;
let project = { name: "Mi proyecto", title: "Mi sitio web", accent: "#7857f5", settings: { autoConnections: true }, files: {
  "index.html": starterHTML,
  "css/styles.css": starterCSS,
  "js/app.js": starterJS,
  "README.md": "# Mi proyecto web\n\nCreado con WebBuilder Studio.\n\n- index.html: página principal\n- css/styles.css: estilos\n- js/app.js: JavaScript\n\nAbrí index.html en tu navegador o usá Live Server en Visual Studio Code."
}, assets: [], folders: ["css", "js", "assets"] };
let activePath = "index.html", editor = null, editorReady = false, currentMode = "visual", selectedBlock = null;
let createKind = "page", toastTimer = null;
const $ = s => document.querySelector(s);
hydrateIcons();
const preview = $("#previewFrame"), assetInput = $("#assetInput");

/* 2. UTILIDADES Y ARCHIVOS: lectura, extensión, creación y árbol. */
function escapeHTML(s="") { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function extension(path) { return (path.split(".").pop()||"").toLowerCase(); }
function languageFor(path) { const e=extension(path); const modes={html:"htmlmixed",htm:"htmlmixed",css:"css",js:"javascript",mjs:"javascript",cjs:"javascript",jsx:"javascript",tsx:"javascript",php:"php",java:"text/x-java",cs:"text/x-csharp",cpp:"text/x-c++src",py:"python",cc:"text/x-c++src",cxx:"text/x-c++src",h:"text/x-c++src",hpp:"text/x-c++src",json:{name:"javascript",json:true},md:"markdown"}; return modes[e]||"text"; }
function showToast(msg) { const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2300); }
function saveEditorToFile() { if(currentMode!=="code") return; if(editor && editorReady) project.files[activePath]=editor.getValue(); else if(!editor) { const ta=$("#codeEditor"); if(ta) project.files[activePath]=ta.value; } }
/* ÁRBOL DE ARCHIVOS ESTILO VS CODE: carpetas plegables, anidadas y con indentación. */
let selectedFolder="";
function allFolders() { const set=new Set(project.folders);Object.keys(project.files).forEach(p=>{const parts=p.split("/");for(let i=1;i<parts.length;i++)set.add(parts.slice(0,i).join("/"));});return set; }
function isCollapsed(folder) { return (project.collapsed||[]).includes(folder); }
function toggleFolder(folder) { const c=new Set(project.collapsed||[]);if(c.has(folder))c.delete(folder);else c.add(folder);project.collapsed=[...c];renderTree(); }
function expandAncestors(path) { const parts=path.split("/"),c=new Set(project.collapsed||[]);for(let i=1;i<parts.length;i++)c.delete(parts.slice(0,i).join("/"));project.collapsed=[...c]; }
function renderTree() {
  const tree=$("#fileTree"); tree.innerHTML="";
  const folders=allFolders(), files=Object.keys(project.files), byName=(a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:"base"});
  const build=(parent,depth)=>{
    const prefix=parent?parent+"/":"";
    [...folders].filter(f=>f.startsWith(prefix)&&f!==parent&&!f.slice(prefix.length).includes("/")).sort(byName).forEach(f=>{
      addFolderRow(tree,f,depth);
      if(!isCollapsed(f))build(f,depth+1);
    });
    files.filter(p=>p.startsWith(prefix)&&!p.slice(prefix.length).includes("/")).sort(byName).forEach(p=>addFileRow(tree,p,depth));
  };
  build("",0);
  $("#fileCount").textContent=`${files.length} archivos · ${folders.size} carpetas`;
}
function addFolderRow(tree,folder,depth) {
  const collapsed=isCollapsed(folder);
  const row=document.createElement("div");row.className="tree-row folder-row"+(selectedFolder===folder?" selected":"");row.title=folder;row.style.paddingLeft=(7+depth*14)+"px";
  row.setAttribute("aria-expanded",String(!collapsed));
  row.innerHTML=`<span class="chev">${icon(collapsed?"chevron-right":"chevron-down")}</span><span class="file-icon folder-ico">${icon(collapsed?"folder":"folder-open")}</span><span class="folder-name">${escapeHTML(folder.split("/").pop())}</span><span class="tree-actions" role="button" title="Opciones de la carpeta" aria-label="Opciones de la carpeta">${icon("ellipsis")}</span>`;
  const dots=row.querySelector(".tree-actions");
  dots.addEventListener("click",e=>{e.stopPropagation();openItemMenu(e,"folder",folder,dots);});
  row.addEventListener("click",()=>{selectedFolder=folder;toggleFolder(folder);});
  row.addEventListener("contextmenu",e=>{e.preventDefault();openItemMenu(e,"folder",folder,dots);});
  tree.appendChild(row);
}
/* Icono según el tipo de archivo. */
function fileIconFor(ext) {
  const map={html:["file-code","fi-html"],htm:["file-code","fi-html"],css:["hash","fi-css"],js:["braces","fi-js"],mjs:["braces","fi-js"],cjs:["braces","fi-js"],jsx:["atom","fi-jsx"],tsx:["atom","fi-jsx"],php:["code","fi-php"],java:["coffee","fi-java"],cs:["code","fi-csharp"],cpp:["code","fi-cpp"],py:["code","fi-python"],cc:["code","fi-cpp"],cxx:["code","fi-cpp"],h:["code","fi-cpp"],hpp:["code","fi-cpp"],json:["braces","fi-json"],md:["info","fi-md"],txt:["file-text","fi-txt"],
    png:["image","fi-img"],jpg:["image","fi-img"],jpeg:["image","fi-img"],gif:["image","fi-img"],svg:["image","fi-img"],webp:["image","fi-img"]};
  const [name,cls]=map[ext]||["file","fi-txt"];return {name,cls};
}
function addFileRow(tree,path,depth) {
  const row=document.createElement("div");row.className="tree-row file-row "+(activePath===path?"active":"");row.style.paddingLeft=(7+depth*14)+"px";
  const ext=extension(path);const kind=fileIconFor(ext);const ico=icon(kind.name);
  row.innerHTML=`<span class="file-icon ${kind.cls}">${ico}</span><span class="file-name">${escapeHTML(path.split("/").pop())}</span><span class="tree-actions" role="button" title="Opciones del archivo" aria-label="Opciones del archivo">${icon("ellipsis")}</span>`;
  row.title=path;
  const dots=row.querySelector(".tree-actions");
  dots.addEventListener("click",e=>{e.stopPropagation();openItemMenu(e,"file",path,dots);});
  row.addEventListener("click",()=>openFile(path));
  row.addEventListener("contextmenu",e=>{e.preventDefault();openItemMenu(e,"file",path,dots);});
  tree.appendChild(row);
}
/* Fila del proyecto: pliega o despliega todo el árbol. */
$(".project-folder").addEventListener("click",()=>{selectedFolder="";const tree=$("#fileTree"),hidden=tree.classList.toggle("tree-hidden");$("#treeChevron").innerHTML=icon(hidden?"chevron-right":"chevron-down");renderTree();});

/* 2.1. MENÚ ••• DE ARCHIVOS Y CARPETAS: cambiar nombre o eliminar. */
let itemMenu=null, renameTarget="";
function closeItemMenu() { if(itemMenu){itemMenu.remove();itemMenu=null;} }
function openItemMenu(e,kind,path,anchor) {
  closeItemMenu();
  const menu=document.createElement("div");menu.className="item-menu";
  menu.innerHTML=`<button type="button" data-act="rename">${icon("pencil")}Cambiar nombre</button><button type="button" data-act="delete" class="danger">${icon("trash")}Eliminar</button>`;
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect(), w=menu.offsetWidth, h=menu.offsetHeight;
  const fromRightClick=e.type==="contextmenu";
  let x=fromRightClick?e.clientX:r.left, y=fromRightClick?e.clientY:r.bottom+4;
  if(x+w>innerWidth-8)x=innerWidth-w-8;
  if(y+h>innerHeight-8)y=Math.max(8,(fromRightClick?e.clientY:r.top)-h-4);
  menu.style.left=Math.max(8,x)+"px";menu.style.top=y+"px";
  menu.addEventListener("click",ev=>{const act=ev.target.closest("button")?.dataset.act;if(!act)return;closeItemMenu();if(act==="rename")askRename(kind,path);else deleteItem(kind,path);});
  itemMenu=menu;
}
document.addEventListener("click",e=>{if(itemMenu&&!itemMenu.contains(e.target))closeItemMenu();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeItemMenu();});
$("#fileTree").addEventListener("scroll",closeItemMenu);
window.addEventListener("resize",closeItemMenu);

function htmlCount(exceptPrefix) { return Object.keys(project.files).filter(p=>p.toLowerCase().endsWith(".html") && !(exceptPrefix && p.startsWith(exceptPrefix))).length; }
/* Después de renombrar o eliminar, deja una página activa válida y redibuja todo sin recrear archivos borrados. */
function refreshAfterChange() {
  if(!project.files[activePath]){const keys=Object.keys(project.files);activePath=keys.find(p=>p.toLowerCase().endsWith(".html"))||keys[0]||"index.html";}
  $("#canvasPageName").textContent=activePath;$("#codeFileLabel").textContent=activePath;
  renderTree();
  if(currentMode==="code")loadCodeFile();else renderPreview();
}
function deleteItem(kind,path) {
  saveEditorToFile();
  if(kind==="folder") {
    const prefix=path+"/", inside=Object.keys(project.files).filter(p=>p.startsWith(prefix));
    const msg=inside.length?`¿Eliminar la carpeta "${path}" y sus ${inside.length} archivo(s)?`:`¿Eliminar la carpeta "${path}"?`;
    if(!confirm(msg))return;
    inside.forEach(p=>delete project.files[p]);
    project.folders=project.folders.filter(f=>f!==path && !f.startsWith(prefix));
    project.collapsed=(project.collapsed||[]).filter(f=>f!==path && !f.startsWith(prefix));
    if(selectedFolder===path||selectedFolder.startsWith(prefix))selectedFolder="";
    refreshAfterChange();showToast("Carpeta eliminada");
  } else {
    if(!confirm(`¿Eliminar ${path}?`))return;
    delete project.files[path];
    refreshAfterChange();showToast("Archivo eliminado");
  }
}
function askRename(kind,path) {
  createKind=kind==="folder"?"rename-folder":"rename-file";renameTarget=path;
  const base=path.split("/").pop();
  $("#newFileTypeRow").classList.add("hidden");
  $("#dialogTitle").textContent=kind==="folder"?"Cambiar nombre de la carpeta":"Cambiar nombre del archivo";
  $("#confirmCreateBtn").textContent="Guardar";
  $("#newItemName").value=base;$("#newItemName").placeholder=base;
  $("#createDialog").showModal();$("#newItemName").focus();
  const dot=kind==="file"?base.lastIndexOf("."):-1;
  $("#newItemName").setSelectionRange(0,dot>0?dot:base.length);
}
function applyRename() {
  const val=$("#newItemName").value.trim();
  if(!val)return;
  if(/[\/\\]/.test(val)){showToast("El nombre no puede incluir barras");return;}
  saveEditorToFile();
  const old=renameTarget, parent=old.includes("/")?old.slice(0,old.lastIndexOf("/")+1):"";
  if(createKind==="rename-file") {
    const oldBase=old.split("/").pop();
    let name=val; if(oldBase.includes(".") && !name.includes("."))name+="."+extension(oldBase);
    const newPath=parent+name;
    if(newPath===old){$("#createDialog").close("cancel");return;}
    if(project.files[newPath]!==undefined){showToast("Ya existe un archivo con ese nombre");return;}
    project.files[newPath]=project.files[old];delete project.files[old];
    if(activePath===old)activePath=newPath;
    $("#createDialog").close("renamed");refreshAfterChange();showToast("Archivo renombrado");
  } else {
    const newFolder=parent+val;
    if(newFolder===old){$("#createDialog").close("cancel");return;}
    const existing=new Set(project.folders);Object.keys(project.files).forEach(p=>{if(p.includes("/"))existing.add(p.slice(0,p.lastIndexOf("/")));});
    if(existing.has(newFolder)){showToast("Ya existe una carpeta con ese nombre");return;}
    const prefix=old+"/", moved={};
    Object.keys(project.files).forEach(p=>{if(p.startsWith(prefix)){moved[newFolder+"/"+p.slice(prefix.length)]=project.files[p];delete project.files[p];}});
    Object.assign(project.files,moved);
    project.folders=project.folders.map(f=>f===old?newFolder:f.startsWith(prefix)?newFolder+"/"+f.slice(prefix.length):f);
    if(!project.folders.includes(newFolder))project.folders.push(newFolder);
    project.collapsed=(project.collapsed||[]).map(f=>f===old?newFolder:f.startsWith(prefix)?newFolder+"/"+f.slice(prefix.length):f);
    if(assetsDir()===old)project.assetsDir=newFolder;
    if(selectedFolder===old)selectedFolder=newFolder;else if(selectedFolder.startsWith(prefix))selectedFolder=newFolder+"/"+selectedFolder.slice(prefix.length);
    if(activePath.startsWith(prefix))activePath=newFolder+"/"+activePath.slice(prefix.length);
    $("#createDialog").close("renamed");refreshAfterChange();showToast("Carpeta renombrada");
  }
}
function assetsDir() { return project.assetsDir||"assets"; }

function autoConnectionsEnabled() {
  if (!project.settings) project.settings = {};
  return project.settings.autoConnections !== false;
}
function relativeProjectPath(fromHtml, target) {
  const from = fromHtml.includes("/") ? fromHtml.slice(0, fromHtml.lastIndexOf("/")).split("/") : [];
  const to = target.split("/");
  while (from.length && to.length && from[0] === to[0]) { from.shift(); to.shift(); }
  let common = 0;
  while (common < from.length && common < to.length && from[common] === to[common]) common++;
  return [...Array(from.length-common).fill(".."), ...to.slice(common)].join("/") || target.split("/").pop();
}
function removeAutoConnections(html) {
  return String(html||"").replace(/\s*<link\b(?=[^>]*data-wb-auto=["']css["'])[^>]*>\s*/gi, "\n")
    .replace(/\s*<script\b(?=[^>]*data-wb-auto=["']js["'])[^>]*>\s*<\/script\s*>\s*/gi, "\n");
}
function syncAutoConnections() {
  const htmlFiles = Object.keys(project.files).filter(p => /\.html?$/i.test(p));
  if (!autoConnectionsEnabled()) {
    htmlFiles.forEach(p => project.files[p] = removeAutoConnections(project.files[p]));
    return;
  }
  const cssFiles = Object.keys(project.files).filter(p => extension(p) === "css").sort((a,b) => a === "css/styles.css" ? -1 : b === "css/styles.css" ? 1 : a.localeCompare(b));
  const jsFiles = Object.keys(project.files).filter(p => extension(p) === "js").sort((a,b) => a === "js/app.js" ? -1 : b === "js/app.js" ? 1 : a.localeCompare(b));
  htmlFiles.forEach(htmlPath => {
    let content = removeAutoConnections(project.files[htmlPath]);
    const links = cssFiles.map(p => `<link data-wb-auto="css" rel="stylesheet" href="${relativeProjectPath(htmlPath,p)}">`).join("\n");
    const scripts = jsFiles.map(p => `<script data-wb-auto="js" src="${relativeProjectPath(htmlPath,p)}"></script>`).join("\n");
    if (links) {
      if (/<\/head\s*>/i.test(content)) content = content.replace(/<\/head\s*>/i, `${links}\n</head>`);
      else content = `${links}\n${content}`;
    }
    if (scripts) {
      if (/<\/body\s*>/i.test(content)) content = content.replace(/<\/body\s*>/i, `${scripts}\n</body>`);
      else content += `\n${scripts}`;
    }
    project.files[htmlPath] = content;
  });
}
function updateAutoConnectionsUI() {
  /* Es un ajuste del proyecto abierto: desde Inicio no hay proyecto que modificar. */
  const toggle = $("#autoConnectionsToggle");
  if (toggle) { toggle.disabled = !inEditor; toggle.checked = inEditor ? autoConnectionsEnabled() : false; }
  const status = $("#autoConnectionsStatus");
  if (status) status.textContent = !inEditor
    ? "Abrí un proyecto para cambiar esta opción."
    : autoConnectionsEnabled()
      ? "Activado: los archivos CSS y JavaScript se conectan automáticamente."
      : "Desactivado: las conexiones automáticas están apagadas.";
}

/* Une todos los CSS y JS del proyecto, así renombrar o mover archivos no rompe la vista previa. */
function allCSS(pr=project) { const main="css/styles.css";return Object.keys(pr.files).filter(p=>extension(p)==="css").sort((a,b)=>a===main?-1:b===main?1:a.localeCompare(b)).map(p=>pr.files[p]).join("\n"); }
function allJS() { const main="js/app.js";return Object.keys(project.files).filter(p=>extension(p)==="js").sort((a,b)=>a===main?-1:b===main?1:a.localeCompare(b)).map(p=>project.files[p]).join("\n;\n"); }
function openFile(path) { saveEditorToFile();if(!project.files[path])return;expandAncestors(path);selectedFolder=path.includes("/")?path.slice(0,path.lastIndexOf("/")):"";activePath=path;$("#canvasPageName").textContent=path;$("#codeFileLabel").textContent=path;$("#projectNameLabel").textContent=project.name;renderTree();renderTabs();if(currentMode==="code")loadCodeFile();else if(path.endsWith(".html"))renderPreview();else switchMode("code"); }
function renderTabs() { /* La barra de pestañas superior se eliminó para dar más espacio al editor. */ }
function askCreate(kind) {
  createKind=kind;
  $("#confirmCreateBtn").textContent="Crear";
  if(selectedFolder&&!allFolders().has(selectedFolder))selectedFolder="";
  const titles={page:"Crear nueva página HTML",folder:"Crear carpeta",file:"Agregar lenguaje o archivo"};
  $("#dialogTitle").textContent=(titles[kind]||"Crear archivo")+(selectedFolder?` en ${selectedFolder}/`:"");
  const guess=selectedFolder.split("/").pop().toLowerCase();
  const defaultExt=guess==="js"?"js":guess==="css"?"css":"html";
  $("#newFileTypeRow").classList.toggle("hidden",kind!=="file");
  $("#newFileType").value=defaultExt;
  $("#newItemName").value=kind==="page"?"nueva-pagina.html":kind==="folder"?"nueva-carpeta":"nuevo-archivo";
  $("#newItemName").placeholder=kind==="page"?"pagina.html":kind==="folder"?"nombre-de-carpeta":"nombre del archivo";
  $("#createDialog").showModal();
  $("#newItemName").focus();
  $("#newItemName").select();
}

$("#newFileType").addEventListener("change",()=>{const ext=$("#newFileType").value;const n=$("#newItemName");n.value=n.value.replace(/\.[^.]+$/,"");});
/* Cancelar cierra el diálogo sin disparar el evento submit ni crear archivos. */
$("#cancelCreateBtn").addEventListener("click",()=>$("#createDialog").close("cancel"));

$("#createForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(createKind==="rename-file"||createKind==="rename-folder"){applyRename();return;}
  const typed=$("#newItemName").value.trim().replace(/^\/+/,"");
  if(!typed)return;
  const rawName=(selectedFolder?selectedFolder+"/":"")+typed;
  if(createKind==="folder"){
    project.folders.push(rawName);
    project.folders=[...new Set(project.folders)];
    expandAncestors(rawName+"/x");
    renderTree();
    $("#createDialog").close("created");
    showToast("Carpeta creada");
    return;
  }

  let path=rawName;
  if(createKind==="page"&&!path.toLowerCase().endsWith(".html"))path+=".html";
  if(createKind==="file") { const ext=$("#newFileType").value; path=path.replace(/\.[^.\/]+$/,"")+"."+ext; }
  path=path.replace(/\/+/g,"/");
  if(project.files[path]!==undefined){
    showToast("Ya existe un archivo con ese nombre");
    return;
  }

  const ext=extension(path);
  const starterByType={
    html:htmlDoc(),
    css:`/* ${path}: estilos de esta hoja */\n\n`,
    js:`// ${path}: JavaScript / Node.js\n\nconsole.log("Hola desde Node.js");\n`,
    jsx:`import React from "react";\n\nexport default function App() {\n  return <main><h1>Hola, React</h1></main>;\n}\n`,
    tsx:`import React from "react";\n\nexport default function App() {\n  return <main><h1>Hola, React</h1></main>;\n}\n`,
    php:`<?php\n// ${path}\necho "Hola desde PHP";\n`,
    py:`# ${path}\n\ndef main():\n    print("Hola desde Python")\n\nif __name__ == "__main__":\n    main()\n`,
    java:`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola desde Java");\n    }\n}\n`,
    cs:`using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hola desde C#");\n    }\n}\n`,
    cpp:`#include <iostream>\n\nint main() {\n    std::cout << "Hola desde C++" << std::endl;\n    return 0;\n}\n`,
    json:`{\n  "nombre": "Mi proyecto"\n}`,
    md:`# ${path.split("/").pop().replace(/\\.md$/i,"")}\n\nEscribí tu documentación acá.\n`,
    txt:`Archivo de texto: ${path}\n`
  };
  project.files[path]=starterByType[ext]??`/* ${path} */\n`;
  syncAutoConnections();
  openFile(path);
  renderTree();
  $("#createDialog").close("created");
  showToast(ext==="html"?"Página HTML creada":`Archivo .${ext} creado`);
});

/* 3. EDITOR DE CÓDIGO: CodeMirror con fallback si no carga la librería. */
function initEditor() {if(window.CodeMirror){editor=CodeMirror.fromTextArea($("#codeEditor"),{theme:cmTheme(),lineNumbers:true,tabSize:2,indentUnit:2,mode:"htmlmixed",lineWrapping:false,extraKeys:{"Ctrl-S":()=>saveProject(),"Ctrl-Space":"autocomplete","Tab":cm=>cm.execCommand("insertSoftTab")}});editor.on("change",()=>{if(editorReady){project.files[activePath]=editor.getValue();$("#codeStatus").textContent="Modificado";if(/\.(html?|css|js)$/i.test(activePath))renderPreview();}});editorReady=true;}else{$("#codeEditor").addEventListener("input",()=>{project.files[activePath]=$("#codeEditor").value;});}}
function loadCodeFile(){const value=project.files[activePath]||"";$("#languageLabel").textContent=extension(activePath).toUpperCase()||"TXT";if(editor){editorReady=false;editor.setOption("mode",languageFor(activePath));editor.setValue(value);editorReady=true;editor.refresh();}else $("#codeEditor").value=value;$("#codeFileLabel").textContent=activePath;}
function switchMode(mode){if(mode==="code"&&currentMode!=="code"){saveEditorToFile();currentMode="code";$("#canvasArea").classList.add("hidden");$("#codeArea").classList.remove("hidden");loadCodeFile();}else if(mode==="visual"){saveEditorToFile();currentMode="visual";$("#codeArea").classList.add("hidden");$("#canvasArea").classList.remove("hidden");if(!activePath.endsWith(".html")){const first=Object.keys(project.files).find(p=>p.endsWith(".html"));if(first)activePath=first;}renderPreview();}document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));renderTabs();}
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>switchMode(b.dataset.mode)));

/* 4. VISTA PREVIA: renderiza la página activa dentro del iframe aislado. */
function isFullDoc(h) { return /<body[\s>]/i.test(h); }
/* Si la página es un documento completo, el CSS/JS del proyecto se inyecta dentro de él; si es un fragmento, se envuelve como antes. */
function composeDoc(html,headExtra,bodyExtra) {
  if(!isFullDoc(html))return null;
  let out=/<\/head\s*>/i.test(html)?html.replace(/<\/head\s*>/i,m=>headExtra+"\n"+m):html.replace(/<body/i,m=>headExtra+m);
  out=/<\/body\s*>/i.test(out)?out.replace(/<\/body\s*>/i,m=>bodyExtra+m):out+bodyExtra;
  return out;
}
/* Agrega un fragmento dentro del <body> (o al final si el archivo es un fragmento). */
function appendToBody(path,snippet) {
  const cur=project.files[path]||"";
  project.files[path]=/<\/body\s*>/i.test(cur)?cur.replace(/\n?[ \t]*<\/body\s*>/i,m=>"\n"+snippet+m):cur+"\n"+snippet;
}
function currentHTML(){return project.files[activePath]||project.files["index.html"]||"";}
function renderPreview(){const htmlPath=activePath.endsWith(".html")?activePath:(Object.keys(project.files).find(p=>p==="index.html")||Object.keys(project.files).find(p=>/\.html?$/i.test(p)));if(!htmlPath||!project.files[htmlPath]){preview.srcdoc="<!doctype html><html lang='es'><body style='font:14px Arial;padding:24px;color:#555'>No hay una página HTML para mostrar. Agregá un archivo HTML desde el botón +.</body></html>";return;}const css=autoConnectionsEnabled()?allCSS():"";const js=autoConnectionsEnabled()?allJS():"";const title=$("#siteTitle").value||project.title;const assets=project.assets.map(a=>({name:a.name,data:a.data}));const sourceHTML=project.files[htmlPath]||"";const html=autoConnectionsEnabled()?removeAutoConnections(sourceHTML):sourceHTML;const inject=`<script>document.addEventListener('click',function(e){const el=e.target.closest('[data-wb-block]');if(el){e.preventDefault();parent.postMessage({type:'wb-select',tag:el.tagName,block:el.getAttribute('data-wb-block'),text:el.innerText.slice(0,180)},'*');}});<\/script>`;const headX=`<style>${css}\n:root{--accent:${project.accent};}*{max-width:100%;}</style>`;const bodyX=inject+`<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script>`;preview.srcdoc=composeDoc(html,headX,bodyX)||`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)}</title><style>${css}\n:root{--accent:${project.accent};}*{max-width:100%;}</style></head><body>${html}${inject}<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script></body></html>`;$("#projectNameLabel").textContent=project.name;$("#blockCount").textContent=`${(html.match(/data-wb-block=/g)||[]).length} bloques`;}
window.addEventListener("message",e=>{if(e.data?.type==="wb-select"){selectedBlock=e.data;$("#propertiesPanel").innerHTML=`<div class="section-label">ELEMENTO SELECCIONADO</div><p class="small muted">Tipo: ${escapeHTML(e.data.block)}</p><p class="small">${escapeHTML(e.data.text||"Sin texto")}</p><div class="guide-card"><b>Editar este elemento</b><p>Para cambiar su estructura o contenido, abrí el archivo HTML en la pestaña Código y buscá el bloque <code>${escapeHTML(e.data.block)}</code>.</p></div><button class="outline-btn" id="backProperties">Volver a propiedades</button>`;$("#backProperties").onclick=()=>location.reload();}});
$("#siteTitle").addEventListener("input",()=>{project.title=$("#siteTitle").value;if(/<title>[\s\S]*?<\/title>/i.test(project.files[activePath]||"")&&currentMode!=="code")project.files[activePath]=project.files[activePath].replace(/<title>[\s\S]*?<\/title>/i,()=>`<title>${escapeHTML(project.title)}</title>`);renderPreview();});$("#accentColor").addEventListener("input",()=>{project.accent=$("#accentColor").value;renderPreview();});$("#refreshPreview").onclick=renderPreview;
document.querySelectorAll("[data-device]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-device]").forEach(x=>x.classList.toggle("active",x===b));preview.classList.toggle("mobile",b.dataset.device==="mobile");});

/* 5. BLOQUES Y ARRASTRAR/SOLTAR: plantillas comentadas y editables. */
const blockTemplates={
 hero:`\n<!-- BLOQUE: PORTADA -->\n<section class="hero" data-wb-block="hero"><p class="eyebrow">NUEVA SECCIÓN</p><h1>Tu gran <span>idea.</span></h1><p>Escribí acá una presentación para tu página web.</p><a class="button" href="#contacto">Conocer más</a></section>`,
 text:`\n<!-- BLOQUE: TEXTO -->\n<section class="section" data-wb-block="text"><h2>Un título para tu contenido</h2><p>Escribí acá la información que quieras compartir con tus visitantes.</p></section>`,
 cards:`\n<!-- BLOQUE: TARJETAS -->\n<section class="section" data-wb-block="cards"><h2>Nuestros servicios</h2><div class="cards"><article><h3>Servicio 1</h3><p>Descripción del servicio.</p></article><article><h3>Servicio 2</h3><p>Descripción del servicio.</p></article><article><h3>Servicio 3</h3><p>Descripción del servicio.</p></article></div></section>`,
 image:`\n<!-- BLOQUE: IMAGEN. Reemplazá la ruta por una imagen de assets/. -->\n<section class="section" data-wb-block="image"><h2>Nuestra imagen</h2><img src="https://placehold.co/900x350/e9e6ff/5140a8?text=Tu+imagen" alt="Imagen descriptiva" style="width:100%;max-width:900px;border-radius:14px"><p>Agregá una descripción para esta imagen.</p></section>`,
 button:`\n<!-- BLOQUE: BOTÓN -->\n<section class="section" data-wb-block="button"><a class="button" href="#">Hacé clic acá</a></section>`,
 contact:`\n<!-- BLOQUE: CONTACTO -->\n<section class="section" id="contacto" data-wb-block="contact"><h2>Contactanos</h2><p>¿Tenés alguna consulta? Escribinos.</p><a class="button" href="mailto:hola@ejemplo.com">Enviar correo</a></section>`
};
function addBlock(type){if(!activePath.endsWith(".html"))switchMode("visual");const target=activePath.endsWith(".html")?activePath:"index.html";appendToBody(target,blockTemplates[type]);activePath=target;renderPreview();renderTree();showToast("Bloque agregado al final de la página");}
document.querySelectorAll("[data-block]").forEach(b=>{b.addEventListener("click",()=>addBlock(b.dataset.block));b.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/wb-block",b.dataset.block);e.dataTransfer.effectAllowed="copy";document.body.classList.add("dragging-item");});});
const stage=$("#previewStage");stage.addEventListener("dragover",e=>{e.preventDefault();stage.classList.add("dragging");});stage.addEventListener("dragleave",e=>{if(!stage.contains(e.relatedTarget))stage.classList.remove("dragging");});stage.addEventListener("drop",e=>{e.preventDefault();stage.classList.remove("dragging");const block=e.dataTransfer.getData("text/wb-block");if(block)addBlock(block);const asset=e.dataTransfer.getData("text/wb-asset");if(asset){const a=project.assets.find(x=>x.name===asset);if(a){appendToBody(activePath,`\n<!-- IMAGEN: ${a.name} -->\n<section class="section" data-wb-block="image"><img src="${assetsDir()}/${a.name}" alt="${escapeHTML(a.name)}" style="max-width:100%"></section>`);renderPreview();showToast("Imagen agregada al final de la página");}}});

/* 6. GESTOR DE IMÁGENES: importar, previsualizar y arrastrar recursos. */
function importAssets(){assetInput.click();}$("#uploadAssetBtn").onclick=importAssets;$("#addAssetBtn").onclick=importAssets;$("#openAssetsBtn").onclick=()=>showInspector("assets");
assetInput.addEventListener("change",async()=>{for(const file of assetInput.files){if(!file.type.startsWith("image/"))continue;const data=await new Promise(resolve=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.readAsDataURL(file);});project.assets.push({name:file.name.replace(/[^a-zA-Z0-9._-]/g,"_"),data});}assetInput.value="";renderAssets();showToast("Imágenes importadas a la biblioteca");});
function renderAssets(){const grid=$("#assetGrid");grid.innerHTML="";if(!project.assets.length){grid.innerHTML='<p class="muted small">Todavía no hay imágenes. Usá “Importar” para agregar archivos.</p>';return;}project.assets.forEach(a=>{const card=document.createElement("div");card.className="asset-card";card.draggable=true;card.innerHTML=`<img src="${a.data}" alt=""><span>${escapeHTML(a.name)}</span>`;card.title="Arrastrá esta imagen al lienzo";card.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/wb-asset",a.name);document.body.classList.add("dragging-item");});card.addEventListener("click",()=>{const html=`<img src="${assetsDir()}/${a.name}" alt="${escapeHTML(a.name)}" style="max-width:100%">`;navigator.clipboard?.writeText(html);showToast("Código de imagen copiado");});grid.appendChild(card);});}
function showInspector(tab){document.querySelectorAll(".inspector-tab").forEach(b=>b.classList.toggle("active",b.dataset.inspector===tab));$("#propertiesPanel").classList.toggle("hidden",tab!=="properties");$("#assetsPanel").classList.toggle("hidden",tab!=="assets");if(tab==="assets")renderAssets();}
document.querySelectorAll(".inspector-tab").forEach(b=>b.onclick=()=>showInspector(b.dataset.inspector));

/* 7. GUARDADO LOCAL Y RECUPERACIÓN DEL PROYECTO. */
/* GUARDADO: cada proyecto se guarda por separado y la biblioteca (Inicio) lista los guardados. */
const LEGACY_LIB="webbuilder-studio-library-v3", LEGACY_PROJ="webbuilder-studio-project-v3-", OLD_KEY="webbuilder-studio-project-v2";
let LIB_KEY="", PROJ_PREFIX="";
function setAccountKeys(uid) { LIB_KEY=`webbuilder-studio-library-v4-${uid}`;PROJ_PREFIX=`webbuilder-studio-project-v4-${uid}-`; }
let library=[], inEditor=false;
function newId() { return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function writeLibrary() { try{localStorage.setItem(LIB_KEY,JSON.stringify(library));}catch(e){console.warn("No se pudo guardar la biblioteca",e);} }
function loadStored(id) { try{return JSON.parse(localStorage.getItem(PROJ_PREFIX+id));}catch(e){return null;} }
/* Miniatura sin scripts: HTML principal + CSS del proyecto. */
function buildThumbDoc(pr) {
  const keys=Object.keys(pr.files), main=pr.files["index.html"]!==undefined?"index.html":keys.find(p=>p.toLowerCase().endsWith(".html"));
  if(!main)return "";
  const html=pr.files[main].replace(/<script[\s\S]*?<\/script>/gi,""), css=allCSS(pr);
  const style=`<style>${css}\n:root{--accent:${pr.accent||"#7857f5"};}*{max-width:100%;}</style>`;
  const doc=composeDoc(html,style,"")||`<!doctype html><html><head><meta charset="utf-8">${style}</head><body>${html}</body></html>`;
  return doc.length>60000?"":doc;
}
function persist(pr) {
  if(!currentUser)return false;
  pr.updated=Date.now();
  try{localStorage.setItem(PROJ_PREFIX+pr.id,JSON.stringify(pr));}catch(e){return false;}
  const meta={id:pr.id,name:pr.name,created:pr.created||pr.updated,updated:pr.updated,files:Object.keys(pr.files).length,preview:buildThumbDoc(pr)};
  const k=library.findIndex(x=>x.id===pr.id);if(k>=0)library[k]=meta;else library.push(meta);
  writeLibrary();queueSync(pr.id,"put");return true;
}
function saveProject(silent){
  saveEditorToFile();
  project.name=$("#projectNameLabel").textContent||project.name;project.title=$("#siteTitle").value;project.accent=$("#accentColor").value;
  if(!project.id){project.id=newId();project.created=Date.now();}
  const ok=persist(project);
  if(!silent){if(ok){showToast(serverMode?"Proyecto guardado en tu cuenta":"Proyecto guardado en este navegador");$("#codeStatus").textContent="Guardado";}else showToast("No se pudo guardar: quizá las imágenes son demasiado grandes");}
  return ok;
}
function readLibrary() {
  try{library=JSON.parse(localStorage.getItem(LIB_KEY))||[];}catch(e){library=[];}
  if(!Array.isArray(library))library=[];
}
function defaultFiles(name,template) {
  if(template==="example")return {"index.html":starterHTML,"css/styles.css":starterCSS,"js/app.js":starterJS,"README.md":`# ${name}\n\nCreado con WebBuilder Studio.\n\n- index.html: página principal\n- css/styles.css: estilos\n- js/app.js: JavaScript\n`};
  return {"index.html":htmlDoc('  <main class="section"><h1>Mi nueva web</h1><p>Empezá a crear.</p></main>'),"css/styles.css":starterCSS,"js/app.js":starterJS,"README.md":`# ${name}\n`};
}
function createProject(name,template) {
  if(inEditor&&project.id&&!saveProject(true)&&!confirm("No se pudo guardar el proyecto actual. ¿Crear el nuevo igual?"))return;
  const pr={id:newId(),name,title:name,accent:"#7857f5",settings:{autoConnections:true},files:defaultFiles(name,template),assets:[],folders:["css","js","assets"],collapsed:[],created:Date.now()};
  if(!persist(pr)){showToast("No hay espacio para guardar el proyecto nuevo");return;}
  openProject(pr);showToast("Proyecto creado");
}
/* Carga un proyecto en el editor sin tocar los archivos de otro. */
function openProject(pr) {
  project=pr;project.assets=project.assets||[];project.folders=project.folders||["css","js","assets"];project.collapsed=project.collapsed||[];project.settings=project.settings||{autoConnections:true};if(project.settings.autoConnections!==false)syncAutoConnections();
  currentMode="visual";selectedFolder="";
  $("#codeArea").classList.add("hidden");$("#canvasArea").classList.remove("hidden");
  document.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode==="visual"));
  const keys=Object.keys(project.files);
  activePath=project.files["index.html"]!==undefined?"index.html":keys.find(p=>p.toLowerCase().endsWith(".html"))||keys[0]||"index.html";
  $("#projectNameLabel").textContent=project.name;$("#treeProjectName").textContent=project.name.toUpperCase().replace(/\s+/g,"_");
  $("#canvasPageName").textContent=activePath;$("#codeFileLabel").textContent=activePath;
  $("#siteTitle").value=project.title||project.name;$("#accentColor").value=project.accent||"#7857f5";
  renderTree();renderAssets();updateAutoConnectionsUI();renderPreview();hideHome();
}
function openProjectById(id) { const pr=loadStored(id);if(!pr?.files){showToast("No se pudo abrir ese proyecto");return;}openProject(pr); }
function goHome() {
  if(inEditor&&project.id&&!saveProject(true)&&!confirm("No se pudo guardar el proyecto. ¿Salir igual y perder los cambios?"))return;
  inEditor=false;document.body.classList.add("at-home");$("#homeView").classList.remove("hidden");renderHome();startAds();
}
function hideHome() { inEditor=true;document.body.classList.remove("at-home");$("#homeView").classList.add("hidden");stopAds(); }
/* PUBLICIDAD: banner de la pantalla de Inicio. Los anuncios se editan en js/ads.js. */
let adIndex=0, adTimer=null;
function stopAds(){clearInterval(adTimer);adTimer=null;}
function showAd(i){
  const box=$("#adBanner"),ads=WB_ADS.ads;
  adIndex=(i+ads.length)%ads.length;const ad=ads[adIndex];
  const link=/^https?:\/\//i.test(ad.url||"")?ad.url:"";
  const cta=ad.cta?(link?`<a class="ad-cta" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer sponsored">${escapeHTML(ad.cta)}</a>`:`<span class="ad-cta">${escapeHTML(ad.cta)}</span>`):"";
  const dots=ads.length>1?`<div class="ad-dots">${ads.map((_,k)=>`<button type="button" class="${k===adIndex?"active":""}" data-ad="${k}" aria-label="Ver anuncio ${k+1}"></button>`).join("")}</div>`:"";
  box.innerHTML=`<span class="ad-tag">Publicidad</span><div class="ad-icon"><span class="ic">${icon("sparkles")}</span></div><div class="ad-text"><b>${escapeHTML(ad.title)}</b><span>${escapeHTML(ad.text||"")}</span></div>${cta}${dots}`;
  box.querySelectorAll("[data-ad]").forEach(b=>b.onclick=()=>{showAd(+b.dataset.ad);startAds(true);});
}
function startAds(keepIndex){
  stopAds();const box=$("#adBanner");
  const ok=typeof WB_ADS!=="undefined"&&WB_ADS.enabled&&Array.isArray(WB_ADS.ads)&&WB_ADS.ads.length;
  box.classList.toggle("hidden",!ok);if(!ok)return;
  showAd(keepIndex===true?adIndex:0);
  const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(WB_ADS.ads.length>1&&!reduce)adTimer=setInterval(()=>{if(!document.hidden)showAd(adIndex+1);},Math.max(3000,WB_ADS.intervalMs||8000));
}

/* INICIO: tarjetas de proyectos. */
function whenText(t) {
  const m=Math.round((Date.now()-t)/60000);
  if(m<1)return "ahora";if(m<60)return `hace ${m} min`;if(m<1440)return `hace ${Math.round(m/60)} h`;
  return new Date(t).toLocaleDateString("es-AR",{day:"numeric",month:"short",year:"numeric"});
}
function renderHome() {
  const grid=$("#projectGrid"),q=$("#homeSearch").value.trim().toLowerCase();
  const list=library.filter(m=>m.name.toLowerCase().includes(q)).sort((a,b)=>b.updated-a.updated);
  grid.innerHTML="";
  $("#homeSubtitle").textContent=(currentUser?`Hola, ${currentUser.name}. `:"")+(library.length?`${library.length} proyecto${library.length===1?"":"s"} guardado${library.length===1?"":"s"}.`:"Todavía no tenés proyectos. Creá el primero.");
  if(!q){const nc=document.createElement("button");nc.className="project-card new-card";nc.innerHTML=`<span class="plus">${icon("plus")}</span><b>Nuevo proyecto</b><small>En blanco o con ejemplo</small>`;nc.onclick=()=>openProjectDialog("new");grid.appendChild(nc);}
  list.forEach(m=>{
    const card=document.createElement("div");card.className="project-card";card.tabIndex=0;card.setAttribute("role","button");card.setAttribute("aria-label","Abrir "+m.name);
    card.innerHTML=`<div class="thumb">${m.preview?`<iframe sandbox tabindex="-1" loading="lazy" title="" srcdoc="${escapeHTML(m.preview)}"></iframe>`:'<span class="thumb-empty">Sin vista previa</span>'}</div><div class="card-info"><div class="card-text"><b>${escapeHTML(m.name)}</b><small>Editado ${whenText(m.updated)} · ${m.files} archivos</small></div><span class="tree-actions card-dots" role="button" title="Opciones del proyecto" aria-label="Opciones del proyecto">${icon("ellipsis")}</span></div>`;
    const dots=card.querySelector(".card-dots");
    dots.addEventListener("click",e=>{e.stopPropagation();openProjectMenu(e,dots,m.id);});
    card.addEventListener("contextmenu",e=>{e.preventDefault();openProjectMenu(e,dots,m.id);});
    card.addEventListener("click",()=>openProjectById(m.id));
    card.addEventListener("keydown",e=>{if(e.key==="Enter")openProjectById(m.id);});
    grid.appendChild(card);
  });
  if(q&&!list.length)grid.innerHTML='<p class="muted">No hay proyectos que coincidan con la búsqueda.</p>';
}
function openProjectMenu(e,anchor,id) {
  closeItemMenu();
  const menu=document.createElement("div");menu.className="item-menu";
  menu.innerHTML=`<button type="button" data-act="open">${icon("folder-open")}Abrir</button><button type="button" data-act="rename">${icon("pencil")}Cambiar nombre</button><button type="button" data-act="copy">${icon("copy")}Duplicar</button><button type="button" data-act="delete" class="danger">${icon("trash")}Eliminar</button>`;
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect(),w=menu.offsetWidth,hh=menu.offsetHeight,rc=e.type==="contextmenu";
  let x=rc?e.clientX:r.left,y=rc?e.clientY:r.bottom+4;
  if(x+w>innerWidth-8)x=innerWidth-w-8;if(y+hh>innerHeight-8)y=Math.max(8,(rc?e.clientY:r.top)-hh-4);
  menu.style.left=Math.max(8,x)+"px";menu.style.top=y+"px";
  menu.addEventListener("click",ev=>{const act=ev.target.closest("button")?.dataset.act;if(!act)return;closeItemMenu();
    if(act==="open")openProjectById(id);else if(act==="rename")openProjectDialog("rename",id);else if(act==="copy")duplicateProject(id);else deleteProject(id);});
  itemMenu=menu;
}
function duplicateProject(id) {
  const pr=loadStored(id);if(!pr){showToast("No se pudo duplicar");return;}
  pr.id=newId();pr.name=pr.name+" (copia)";pr.created=Date.now();
  if(!persist(pr)){showToast("No hay espacio para duplicar el proyecto");return;}
  renderHome();showToast("Proyecto duplicado");
}
function deleteProject(id) {
  const m=library.find(x=>x.id===id);if(!m)return;
  if(!confirm(`¿Eliminar el proyecto "${m.name}"? Esta acción no se puede deshacer.`))return;
  try{localStorage.removeItem(PROJ_PREFIX+id);}catch(e){}
  library=library.filter(x=>x.id!==id);writeLibrary();queueSync(id,"del");
  if(project.id===id)project.id=null;
  renderHome();showToast("Proyecto eliminado");
}
/* Diálogo de nombre: nuevo proyecto o cambiar nombre. */
let projectDialogMode="new", projectDialogId=null;
function openProjectDialog(mode,id) {
  projectDialogMode=mode;projectDialogId=id||null;
  const isNew=mode==="new",m=id?library.find(x=>x.id===id):null;
  $("#projectDialogTitle").textContent=isNew?"Nuevo proyecto":"Cambiar nombre del proyecto";
  $("#confirmProjectBtn").textContent=isNew?"Crear":"Guardar";
  $("#templateChoice").classList.toggle("hidden",!isNew);
  $("#projectNameInput").value=isNew?"":m?.name||"";
  $("#projectDialog").showModal();$("#projectNameInput").focus();$("#projectNameInput").select();
}
$("#cancelProjectBtn").addEventListener("click",()=>$("#projectDialog").close("cancel"));
$("#projectForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#projectNameInput").value.trim().slice(0,60);if(!name)return;
  $("#projectDialog").close("ok");
  if(projectDialogMode==="new"){createProject(name,document.querySelector('input[name="projectTemplate"]:checked').value);return;}
  const pr=loadStored(projectDialogId);if(!pr){showToast("No se pudo renombrar");return;}
  pr.name=name;if(!persist(pr)){showToast("No se pudo guardar el cambio");return;}
  if(project.id===pr.id)project.name=name;
  renderHome();showToast("Proyecto renombrado");
});
$("#homeSearch").addEventListener("input",renderHome);
$("#homeNewBtn").onclick=()=>openProjectDialog("new");
$("#homeBtn").onclick=goHome;
$("#brandHome").addEventListener("click",goHome);
$("#brandHome").addEventListener("keydown",e=>{if(e.key==="Enter")goHome();});
$("#saveBtn").onclick=()=>saveProject();
$("#newProjectBtn").onclick=()=>openProjectDialog("new");
$("#resetExampleBtn").onclick=()=>{if(confirm("¿Restablecer el proyecto de ejemplo? Se reemplazarán los cambios actuales.")){project.files["index.html"]=starterHTML;project.files["css/styles.css"]=starterCSS;project.files["js/app.js"]=starterJS;activePath="index.html";renderTree();renderPreview();showToast("Ejemplo restablecido");}};
$("#newFileBtn").onclick=()=>askCreate("file");$("#newFolderBtn").onclick=()=>askCreate("folder");

/* 8. EXPORTACIÓN: HTML independiente y proyecto completo ZIP. */
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
$("#exportHtmlBtn").onclick=()=>{saveEditorToFile();const html=removeAutoConnections(project.files[activePath]||starterHTML);const css=autoConnectionsEnabled()?allCSS():"";const js=autoConnectionsEnabled()?allJS():"";const headX=`<style>${css}\n:root{--accent:${project.accent}}</style>`;const bodyX=`<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script>`;const output=composeDoc(html,headX,bodyX)||`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(project.title)}</title><style>${css}\n:root{--accent:${project.accent}}</style></head><body>${html}<script>${js.replace(/<\/script/gi,"<\\/script")}<\/script></body></html>`;downloadBlob(new Blob([output],{type:"text/html;charset=utf-8"}),activePath.split("/").pop());showToast("Página HTML exportada");};
function bytesFromDataURL(data){const b64=data.split(",")[1]||"";const raw=atob(b64);const out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
const crcTable=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(data){let c=0xffffffff;for(const b of data)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function makeZip(entries){const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;const dt=new Date(),tm=(dt.getHours()<<11)|(dt.getMinutes()<<5)|Math.floor(dt.getSeconds()/2),day=((dt.getFullYear()-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate();entries.forEach(entry=>{const name=enc.encode(entry.name),data=typeof entry.data==="string"?enc.encode(entry.data):entry.data,crc=crc32(data);const l=new Uint8Array(30+name.length+data.length),v=new DataView(l.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(8,0,true);v.setUint16(10,tm,true);v.setUint16(12,day,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,name.length,true);l.set(name,30);l.set(data,30+name.length);locals.push(l);const c=new Uint8Array(46+name.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint16(10,0,true);cv.setUint16(12,tm,true);cv.setUint16(14,day,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,name.length,true);cv.setUint32(42,offset,true);c.set(name,46);centrals.push(c);offset+=l.length;});const cs=centrals.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22),ev=new DataView(end.buffer);ev.setUint32(0,0x06054b50,true);ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);ev.setUint32(12,cs,true);ev.setUint32(16,offset,true);return new Blob([...locals,...centrals,end],{type:"application/zip"});}
$("#exportZipBtn").onclick=()=>{saveEditorToFile();const entries=[];Object.entries(project.files).forEach(([path,data])=>entries.push({name:`${project.name.replace(/[^a-z0-9_-]/gi,"_")}/${path}`,data}));project.assets.forEach(a=>entries.push({name:`${project.name}/${assetsDir()}/${a.name}`,data:bytesFromDataURL(a.data)}));const readme=`${project.name}\n\nProyecto creado con WebBuilder Studio.\nAbrí index.html en tu navegador o usá Live Server en Visual Studio Code.\n\nEstructura: HTML por página, CSS en css/, JavaScript en js/ e imágenes en assets/.\n`;entries.push({name:`${project.name}/README.txt`,data:readme});downloadBlob(makeZip(entries),`${project.name.replace(/\s+/g,"-").toLowerCase()}.zip`);showToast("Proyecto completo exportado en ZIP");};

/* 8.1. PANELES PLEGABLES: los controles × ocultan paneles y los botones flotantes los recuperan. */
const panelSelectors={explorer:".explorer",blocks:".blocks-panel",inspector:".inspector"};
function setPanelVisible(name,visible){const panel=document.querySelector(panelSelectors[name]);if(!panel)return;panel.classList.toggle("panel-collapsed",!visible);document.querySelector(".app-layout")?.classList.toggle(`hide-${name}`,!visible);document.querySelectorAll(`[data-show="${name}"]`).forEach(btn=>btn.classList.toggle("visible",!visible));document.querySelectorAll(`[data-hide="${name}"]`).forEach(btn=>btn.setAttribute("aria-label",visible?"Ocultar panel":"Panel oculto"));}
document.querySelectorAll("[data-hide]").forEach(btn=>btn.addEventListener("click",()=>setPanelVisible(btn.dataset.hide,false)));
document.querySelectorAll("[data-show]").forEach(btn=>btn.addEventListener("click",()=>setPanelVisible(btn.dataset.show,true)));

document.querySelectorAll("[data-inspector]").forEach(btn=>btn.addEventListener("click",()=>{
  const name=btn.dataset.inspector;
  document.querySelectorAll("[data-inspector]").forEach(x=>x.classList.toggle("active",x===btn));
  ["properties","assets"].forEach(key=>{const panel=document.getElementById(key+"Panel");if(panel)panel.classList.toggle("hidden",key!==name);});
}));
$("#autoConnectionsToggle")?.addEventListener("change",e=>{
  if(!project.settings)project.settings={};
  project.settings.autoConnections=e.target.checked;
  syncAutoConnections();
  updateAutoConnectionsUI();
  renderTree();
  renderPreview();
  saveProject(true);
  showToast(e.target.checked?"Conexiones automáticas activadas":"Conexiones automáticas desactivadas");
});


/* 8. CUENTAS: registro e inicio de sesión locales (por navegador). Cada cuenta tiene su propia biblioteca. */
const USERS_KEY="webbuilder-studio-users-v1", SESSION_KEY="webbuilder-studio-session-v1";
let currentUser=null, authMode="login", authFails=0, authLockUntil=0;
const textEnc=new TextEncoder();
const toHex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
const fromHex=h=>Uint8Array.from(h.match(/../g)||[],x=>parseInt(x,16));
/* SHA-256 de respaldo para navegadores sin WebCrypto (contextos no seguros). */
function sha256Fallback(data) {
  const K=[],H=[],fr=x=>(x-Math.floor(x))*4294967296|0;
  for(let c=2;K.length<64;c++){let pr=true;for(let d=2;d*d<=c;d++)if(c%d===0){pr=false;break;}if(pr){if(H.length<8)H.push(fr(Math.sqrt(c)));K.push(fr(Math.cbrt(c)));}}
  const l=data.length,bits=l*8,pad=((l+9+63)>>6)<<6,m=new Uint8Array(pad);m.set(data);m[l]=0x80;
  const dv=new DataView(m.buffer);dv.setUint32(pad-8,Math.floor(bits/4294967296));dv.setUint32(pad-4,bits>>>0);
  const w=new Int32Array(64),R=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<pad;off+=64){
    for(let i=0;i<16;i++)w[i]=dv.getInt32(off+i*4);
    for(let i=16;i<64;i++){const a=w[i-15],b=w[i-2];w[i]=(w[i-16]+(R(a,7)^R(a,18)^(a>>>3))+w[i-7]+(R(b,17)^R(b,19)^(b>>>10)))|0;}
    let [a,b,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){
      const t1=(h+(R(e,6)^R(e,11)^R(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((R(a,2)^R(a,13)^R(a,22))+((a&b)^(a&c)^(b&c)))|0;
      h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;
    }
    [a,b,c,d,e,f,g,h].forEach((v,i)=>{H[i]=(H[i]+v)|0;});
  }
  const out=new Uint8Array(32),ov=new DataView(out.buffer);H.forEach((x,i)=>ov.setInt32(i*4,x));return out;
}
/* La contraseña nunca se guarda: solo un hash con sal aleatoria (PBKDF2-SHA256 cuando el navegador lo permite). */
/* El hash de respaldo (sin crypto.subtle) mide 65 caracteres y empieza con "f"; el normal mide 64. Mirar solo la "f" fallaba 1 de cada 16 veces. */
function isFallbackHash(h){return typeof h==="string"&&h.length===65&&h[0]==="f";}
async function hashPassword(pw,saltHex,forceFallback) {
  const salt=fromHex(saltHex);
  if(!forceFallback&&window.crypto?.subtle){
    const key=await crypto.subtle.importKey("raw",textEnc.encode(pw),"PBKDF2",false,["deriveBits"]);
    return toHex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:150000},key,256));
  }
  const pwb=textEnc.encode(pw),seed=new Uint8Array(salt.length+pwb.length);seed.set(salt);seed.set(pwb,salt.length);
  let hh=sha256Fallback(seed);for(let i=0;i<20000;i++)hh=sha256Fallback(hh);
  return "f"+toHex(hh);
}
/* SERVIDOR: si la app se abre desde server.js, las cuentas y proyectos viven en el servidor y se ven desde cualquier dispositivo.
   Si se abre el HTML directamente (sin servidor) todo sigue funcionando en modo local, como antes. */
let serverMode=false, migratedCode=null;
async function api(method,url,body){
  const r=await fetch(url,{method,credentials:"same-origin",headers:{"Content-Type":"application/json","X-WB":"1"},body:body===undefined?undefined:JSON.stringify(body)});
  let d={};try{d=await r.json();}catch(e){}
  if(!r.ok)throw Object.assign(new Error(d.error||"No se pudo completar la operación."),{status:r.status});
  return d;
}
async function detectServer(){try{const r=await fetch("api/ping",{cache:"no-store"});serverMode=r.ok&&(await r.json()).ok===true;}catch(e){serverMode=false;}}
/* Cola de cambios pendientes: sobrevive si se cierra la pestaña o se corta internet, y se envía al volver. */
const pendKey=()=>`webbuilder-pending-${currentUser.id}`;
function pendGet(){try{return JSON.parse(localStorage.getItem(pendKey()))||{};}catch(e){return {};}}
function pendSet(o){try{localStorage.setItem(pendKey(),JSON.stringify(o));}catch(e){}}
let syncTimer=null, flushing=null;
function queueSync(id,op){if(!serverMode||!currentUser)return;const q=pendGet();q[id]=op;pendSet(q);clearTimeout(syncTimer);syncTimer=setTimeout(()=>flushPending().catch(()=>{}),700);}
function sessionExpired(){showToast("Tu sesión venció. Volvé a ingresar.");setTimeout(()=>location.reload(),1500);}
function flushPending(){
  if(!serverMode||!currentUser)return Promise.resolve();
  if(flushing)return flushing;
  return flushing=(async()=>{
    for(;;){
      const q=pendGet(),ids=Object.keys(q);if(!ids.length)return;
      for(const id of ids){
        try{
          if(q[id]==="del")await api("DELETE","api/project/"+id);
          else{const pr=loadStored(id),m=library.find(x=>x.id===id);if(pr&&m)await api("PUT","api/project/"+id,{project:pr,meta:m});}
          const n=pendGet();if(n[id]===q[id]){delete n[id];pendSet(n);}
        }catch(e){if(e.status===401)sessionExpired();else{clearTimeout(syncTimer);syncTimer=setTimeout(()=>flushPending().catch(()=>{}),15000);}return;}
      }
    }
  })().finally(()=>{flushing=null;});
}
/* Trae lo último del servidor: envía primero lo pendiente y después baja los proyectos nuevos o más recientes. */
async function pullFromServer(){
  await flushPending();
  const remote=(await api("GET","api/library")).library,pend=pendGet(),ids=new Set(remote.map(m=>m.id));
  library=library.filter(m=>{if(ids.has(m.id)||pend[m.id]==="put")return true;try{localStorage.removeItem(PROJ_PREFIX+m.id);}catch(e){}return false;});
  for(const m of remote){
    if(pend[m.id])continue;
    const loc=library.find(x=>x.id===m.id);
    if(loc&&loc.updated>=m.updated&&loadStored(m.id))continue;
    const pr=(await api("GET","api/project/"+m.id)).project;
    try{localStorage.setItem(PROJ_PREFIX+m.id,JSON.stringify(pr));}catch(e){continue;}
    if(loc)Object.assign(loc,m);else library.push(m);
  }
  writeLibrary();
}
let pulling=false;
function refreshFromServer(){
  if(!serverMode||!currentUser||inEditor||pulling)return;
  pulling=true;pullFromServer().then(()=>renderHome()).catch(e=>{if(e.status===401)sessionExpired();}).finally(()=>{pulling=false;});
}
window.addEventListener("focus",refreshFromServer);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshFromServer();});
/* Cuentas creadas antes en este navegador: al ingresar por primera vez con el servidor se suben a él, con sus proyectos. */
async function migrateLocalAccount(lu,pw,remember){
  const r=await api("POST","api/register",{name:lu.name,email:lu.email,password:pw,remember});
  const oldLib=`webbuilder-studio-library-v4-${lu.id}`,oldProj=`webbuilder-studio-project-v4-${lu.id}-`;
  currentUser=r.user;setAccountKeys(r.user.id);library=[];
  try{(JSON.parse(localStorage.getItem(oldLib))||[]).forEach(m=>{const raw=localStorage.getItem(oldProj+m.id);if(raw){localStorage.setItem(PROJ_PREFIX+m.id,raw);library.push(m);}});writeLibrary();library.forEach(m=>queueSync(m.id,"put"));}catch(e){console.warn("No se pudieron copiar los proyectos locales",e);}
  migratedCode=r.code;return r.user;
}
function clearLocalCache(){
  try{const del=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k===LIB_KEY||k.startsWith(PROJ_PREFIX)||k===pendKey())del.push(k);}del.forEach(k=>localStorage.removeItem(k));}catch(e){}
}
function readUsers() { try{return JSON.parse(localStorage.getItem(USERS_KEY))||{};}catch(e){return {};} }
function writeUsers(u) { localStorage.setItem(USERS_KEY,JSON.stringify(u)); }
/* Los proyectos guardados antes de existir las cuentas pasan a la primera cuenta que se crea. */
function migrateLegacyTo(uid) {
  setAccountKeys(uid);library=[];
  try{
    const legacy=JSON.parse(localStorage.getItem(LEGACY_LIB));
    if(Array.isArray(legacy)){
      legacy.forEach(m=>{const raw=localStorage.getItem(LEGACY_PROJ+m.id);if(raw){localStorage.setItem(PROJ_PREFIX+m.id,raw);localStorage.removeItem(LEGACY_PROJ+m.id);library.push(m);}});
      localStorage.removeItem(LEGACY_LIB);
    }
    const old=JSON.parse(localStorage.getItem(OLD_KEY));
    if(!Array.isArray(legacy)&&old?.files){old.id=newId();old.created=Date.now();currentUser=currentUser||{id:uid};persist(old);}
    localStorage.removeItem(OLD_KEY);
  }catch(e){console.warn("No se pudieron importar los proyectos anteriores",e);}
  writeLibrary();library=[];
}
/* CÓDIGO DE RECUPERACIÓN: sin servidor de correo, es lo que permite cambiar la contraseña. Se guarda solo su hash. */
function newRecoveryCode(){const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",b=crypto.getRandomValues(new Uint8Array(12));let c="";for(let i=0;i<12;i++){c+=A[b[i]%32];if(i%4===3&&i<11)c+="-";}return c;}
function normCode(c){return String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"");}
async function setRecovery(user){const code=newRecoveryCode();user.recSalt=toHex(crypto.getRandomValues(new Uint8Array(16)));user.recHash=await hashPassword(normCode(code),user.recSalt);return code;}
async function resetPassword(email,code,newPw) {
  if(serverMode){const r=await api("POST","api/reset",{email,code,password:newPw});return {user:r.user,code:r.code};}
  const users=readUsers(),user=users[email.toLowerCase()];
  /* El hash se calcula aunque la cuenta no exista, para no revelar qué correos tienen cuenta. */
  const h=await hashPassword(normCode(code),user?.recSalt||toHex(new Uint8Array(16)),isFallbackHash(user?.recHash));
  if(!user||!user.recHash||h!==user.recHash)throw new Error("El correo o el código de recuperación no son correctos.");
  user.salt=toHex(crypto.getRandomValues(new Uint8Array(16)));user.hash=await hashPassword(newPw,user.salt);
  const code2=await setRecovery(user);
  users[user.email]=user;writeUsers(users);
  return {user,code:code2};
}
let recoveryDone=null;
function showRecoveryCode(code,done,kind){
  const reset=kind==="reset",again=kind==="new";
  $("#recoveryTitle").textContent=reset?"Contraseña actualizada":again?"Código nuevo":"Tu cuenta está lista";
  $("#recoveryLead").textContent=(reset?"Tu código anterior ya no sirve. ":again?"El código anterior ya no sirve. ":"")+"Guardá este código en un lugar seguro: es la única forma de recuperar tu cuenta si olvidás la contraseña, y solo se muestra ahora.";
  $("#recoveryCode").textContent=code;recoveryDone=done;$("#recoveryDialog").showModal();
}
$("#recoveryDialog").addEventListener("cancel",e=>e.preventDefault());
$("#doneRecoveryBtn").addEventListener("click",()=>$("#recoveryDialog").close());
$("#recoveryDialog").addEventListener("close",()=>{const f=recoveryDone;recoveryDone=null;$("#recoveryCode").textContent="";if(f)f();});
$("#copyRecoveryBtn").addEventListener("click",()=>{
  const code=$("#recoveryCode").textContent;
  (navigator.clipboard?navigator.clipboard.writeText(code):Promise.reject()).then(()=>showToast("Código copiado")).catch(()=>{const r=document.createRange();r.selectNodeContents($("#recoveryCode"));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);showToast("Seleccionado: copialo con Ctrl+C");});
});
$("#newRecoveryBtn").addEventListener("click",async()=>{
  if(!currentUser||!confirm("El código de recuperación actual dejará de funcionar. ¿Generar uno nuevo?"))return;
  if(serverMode){try{const r=await api("POST","api/recovery");$("#settingsDialog").close();showRecoveryCode(r.code,null,"new");}catch(e){showToast(e.message);}return;}
  const users=readUsers(),u=users[currentUser.email];if(!u)return;
  const code=await setRecovery(u);writeUsers(users);currentUser=u;
  $("#settingsDialog").close();showRecoveryCode(code,null,"new");
});
async function registerUser(name,email,pw) {
  if(serverMode){const r=await api("POST","api/register",{name,email,password:pw,remember:$("#authRemember").checked});return {user:r.user,code:r.code};}
  const users=readUsers(),key=email.toLowerCase();
  if(users[key])throw new Error("Ya existe una cuenta con ese correo.");
  const salt=toHex(crypto.getRandomValues(new Uint8Array(16)));
  const user={id:newId(),name,email:key,salt,hash:await hashPassword(pw,salt),created:Date.now()};
  const code=await setRecovery(user);
  const first=!Object.keys(users).length;
  users[key]=user;writeUsers(users);
  if(first){const prev=currentUser;currentUser=user;migrateLegacyTo(user.id);currentUser=prev;}
  return {user,code};
}
async function loginUser(email,pw) {
  if(serverMode){
    const remember=$("#authRemember").checked;
    try{return (await api("POST","api/login",{email,password:pw,remember})).user;}
    catch(e){
      if(e.status!==401)throw e;
      const lu=readUsers()[email.toLowerCase()];
      if(!lu||await hashPassword(pw,lu.salt,isFallbackHash(lu.hash))!==lu.hash)throw e;
      return migrateLocalAccount(lu,pw,remember);
    }
  }
  const user=readUsers()[email.toLowerCase()];
  const salt=user?user.salt:toHex(new Uint8Array(16));
  const hash=await hashPassword(pw,salt,isFallbackHash(user?.hash));
  if(!user||hash!==user.hash)throw new Error("Correo o contraseña incorrectos.");
  return user;
}
async function enterAccount(user,remember) {
  currentUser=user;setAccountKeys(user.id);readLibrary();
  if(serverMode){try{await pullFromServer();}catch(e){if(e.status===401){sessionExpired();return;}showToast("Sin conexión: se muestran los proyectos guardados en este dispositivo");}}
  const data=JSON.stringify({uid:user.id});
  localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(SESSION_KEY);
  (remember===false?sessionStorage:localStorage).setItem(SESSION_KEY,data);
  $("#userName").textContent=user.name;$("#userAvatar").textContent=(user.name||user.email)[0].toUpperCase();
  document.body.classList.remove("logged-out");
  $("#authForm").reset();$("#authError").textContent="";
  goHome();
}
function showAuth(mode) {
  document.body.classList.add("logged-out");setAuthMode(mode||"login");
  setTimeout(()=>$("#authEmail").focus(),30);
}
function setAuthMode(mode) {
  authMode=mode;const reg=mode==="register",rst=mode==="reset";
  document.querySelectorAll(".auth-tab").forEach(b=>{const on=b.dataset.auth===mode;b.classList.toggle("active",on);b.setAttribute("aria-selected",on);});
  $("#authTabs").classList.toggle("hidden",rst);
  $("#authNameRow").classList.toggle("hidden",!reg);$("#authConfirmRow").classList.toggle("hidden",!(reg||rst));
  $("#authCodeRow").classList.toggle("hidden",!rst);$("#authRememberRow").classList.toggle("hidden",rst);
  $("#forgotBtn").classList.toggle("hidden",mode!=="login");$("#backLoginBtn").classList.toggle("hidden",!rst);
  $("#authPwLabel").textContent=rst?"Nueva contraseña":"Contraseña";
  $("#authTitle").textContent=rst?"Recuperá tu cuenta":reg?"Creá tu cuenta":"Bienvenido de nuevo";
  $("#authLead").textContent=rst?"Ingresá tu correo y el código de recuperación que recibiste al crear la cuenta.":reg?"Guardá tus proyectos y encontralos cuando vuelvas.":"Ingresá para ver tus proyectos.";
  $("#authSubmit").textContent=rst?"Cambiar contraseña":reg?"Crear cuenta":"Iniciar sesión";
  $("#authPassword").autocomplete=(reg||rst)?"new-password":"current-password";
  $("#authPassword").value="";$("#authConfirm").value="";$("#authCode").value="";
  $("#authError").textContent="";
}
$("#forgotBtn").addEventListener("click",()=>{setAuthMode("reset");$("#authCode").focus();});
$("#backLoginBtn").addEventListener("click",()=>{setAuthMode("login");$("#authPassword").focus();});
document.querySelectorAll(".auth-tab").forEach(b=>b.addEventListener("click",()=>setAuthMode(b.dataset.auth)));
$("#togglePw").addEventListener("click",()=>{const f=$("#authPassword"),show=f.type==="password";f.type=show?"text":"password";$("#authConfirm").type=f.type;$("#togglePw").innerHTML=icon(show?"eye-off":"eye");$("#togglePw").setAttribute("aria-label",show?"Ocultar contraseña":"Mostrar contraseña");});
$("#authForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const err=m=>{$("#authError").textContent=m;},btn=$("#authSubmit");
  const name=$("#authName").value.trim(),email=$("#authEmail").value.trim(),pw=$("#authPassword").value;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return err("Ingresá un correo válido.");
  if(authMode==="register"){
    if(!name)return err("Ingresá tu nombre.");
    if(pw.length<8)return err("La contraseña debe tener al menos 8 caracteres.");
    if(pw!==$("#authConfirm").value)return err("Las contraseñas no coinciden.");
  } else if(authMode==="reset"){
    if(normCode($("#authCode").value).length!==12)return err("Ingresá el código de recuperación completo (12 caracteres).");
    if(pw.length<8)return err("La nueva contraseña debe tener al menos 8 caracteres.");
    if(pw!==$("#authConfirm").value)return err("Las contraseñas no coinciden.");
  } else if(!pw)return err("Ingresá tu contraseña.");
  if(Date.now()<authLockUntil)return err(`Demasiados intentos. Probá de nuevo en ${Math.ceil((authLockUntil-Date.now())/1000)} s.`);
  btn.disabled=true;const label=btn.textContent;btn.textContent="Un momento…";err("");
  try{
    if(authMode==="register"){
      const r=await registerUser(name,email,pw);authFails=0;
      showRecoveryCode(r.code,()=>enterAccount(r.user,$("#authRemember").checked),"register");
    }else if(authMode==="reset"){
      const r=await resetPassword(email,$("#authCode").value,pw);authFails=0;
      showRecoveryCode(r.code,()=>enterAccount(r.user,true),"reset");
    }else{
      const user=await loginUser(email,pw);authFails=0;
      if(migratedCode){const c=migratedCode;migratedCode=null;showRecoveryCode(c,()=>enterAccount(user,$("#authRemember").checked),"register");}
      else enterAccount(user,$("#authRemember").checked);
    }
  }catch(ex){
    if(authMode!=="register"&&++authFails>=5){authLockUntil=Date.now()+30000;authFails=0;}
    err(ex.message||"No se pudo completar la operación.");
  }finally{btn.disabled=false;btn.textContent=label;}
});
/* AJUSTES Y TEMA: claro, oscuro o el del sistema. La elección se guarda en este navegador. */
const THEME_KEY="wb_theme";
const systemLight=window.matchMedia?matchMedia("(prefers-color-scheme: light)"):null;
function themeChoice(){let t=null;try{t=localStorage.getItem(THEME_KEY);}catch(e){}return["light","dark","system"].includes(t)?t:"dark";}
function effectiveTheme(choice){return choice==="system"?(systemLight&&systemLight.matches?"light":"dark"):choice;}
function cmTheme(){return document.documentElement.dataset.theme==="light"?"eclipse":"dracula";}
function applyTheme(choice=themeChoice()){
  document.documentElement.dataset.theme=effectiveTheme(choice);
  if(editor&&editor.setOption)editor.setOption("theme",cmTheme());
  document.querySelectorAll("[data-theme-choice]").forEach(b=>{const on=b.dataset.themeChoice===choice;b.classList.toggle("active",on);b.setAttribute("aria-checked",on);});
}
function setTheme(choice){try{localStorage.setItem(THEME_KEY,choice);}catch(e){}applyTheme(choice);}
document.querySelectorAll("[data-theme-choice]").forEach(b=>b.addEventListener("click",()=>setTheme(b.dataset.themeChoice)));
if(systemLight)(systemLight.addEventListener?systemLight.addEventListener.bind(systemLight,"change"):systemLight.addListener.bind(systemLight))(()=>{if(themeChoice()==="system")applyTheme();});
function openSettings(){applyTheme();updateAutoConnectionsUI();$("#settingsDialog").showModal();}
$("#closeSettingsBtn").addEventListener("click",()=>$("#settingsDialog").close());
$("#settingsDialog").addEventListener("click",e=>{const d=e.currentTarget,r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
/* Menú de la cuenta y cierre de sesión. */
$("#userBtn").addEventListener("click",e=>{
  e.stopPropagation();if(itemMenu){closeItemMenu();return;}
  const menu=document.createElement("div");menu.className="item-menu";
  menu.innerHTML=`<div class="menu-label"><b>${escapeHTML(currentUser?.name||"")}</b><small>${escapeHTML(currentUser?.email||"")}</small></div><button type="button" data-act="settings">${icon("settings")}Ajustes</button><button type="button" data-act="logout" class="danger">${icon("log-out")}Cerrar sesión</button>`;
  document.body.appendChild(menu);
  const r=$("#userBtn").getBoundingClientRect();menu.style.top=(r.bottom+6)+"px";menu.style.left=Math.max(8,r.right-menu.offsetWidth)+"px";
  menu.addEventListener("click",ev=>{const act=ev.target.closest("[data-act]")?.dataset.act;if(act==="settings"){closeItemMenu();openSettings();}else if(act==="logout"){closeItemMenu();logout();}});
  itemMenu=menu;
});
async function logout() {
  if(inEditor&&project.id&&!saveProject(true)&&!confirm("No se pudo guardar el proyecto. ¿Cerrar sesión igual y perder los cambios?"))return;
  if(serverMode){try{await flushPending();if(!Object.keys(pendGet()).length)clearLocalCache();}catch(e){}api("POST","api/logout").catch(()=>{});}
  localStorage.removeItem(SESSION_KEY);sessionStorage.removeItem(SESSION_KEY);
  stopAds();currentUser=null;inEditor=false;library=[];LIB_KEY="";PROJ_PREFIX="";
  /* Se vacía lo que quedó en memoria para que la próxima cuenta no vea nada ajeno. */
  project={name:"Mi proyecto",title:"Mi sitio web",accent:"#7857f5",files:{"index.html":htmlDoc()},assets:[],folders:["css","js","assets"],collapsed:[]};
  activePath="index.html";preview.srcdoc="";
  if(editor){editorReady=false;editor.setValue("");editorReady=true;}else $("#codeEditor").value="";
  renderTree();renderAssets();$("#projectGrid").innerHTML="";
  showAuth("login");
}
async function startAuth() {
  await detectServer();
  if(serverMode){let u=null;try{u=(await api("GET","api/me")).user;}catch(e){}if(u)enterAccount(u,true);else showAuth("login");return;}
  let uid=null;
  try{uid=JSON.parse(localStorage.getItem(SESSION_KEY)||sessionStorage.getItem(SESSION_KEY)||"null")?.uid;}catch(e){}
  const user=uid&&Object.values(readUsers()).find(u=>u.id===uid);
  if(user)enterAccount(user,localStorage.getItem(SESSION_KEY)!==null);
  else showAuth(Object.keys(readUsers()).length?"login":"register");
}

/* 9. INICIO: recupera el último trabajo y dibuja la interfaz. */
$("#projectNameLabel").textContent=project.name;$("#treeProjectName").textContent=project.name.toUpperCase().replace(/\s+/g,"_");$("#siteTitle").value=project.title;$("#accentColor").value=project.accent;renderTree();renderAssets();renderTabs();initEditor();applyTheme();renderPreview();startAuth();
/* Mientras se arrastra un bloque o una imagen, el iframe no captura el arrastre: así el lienzo recibe el drop. */
["dragend","drop"].forEach(ev=>document.addEventListener(ev,()=>document.body.classList.remove("dragging-item"),true));
