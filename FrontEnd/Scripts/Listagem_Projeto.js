// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

import { ListarProjetosApi, ListarUsuarioApi, ListarProjetosUsuarioApi } from "./Api.js";

async function CreateProjeto(info) {
    const lider = await ListarUsuarioApi(info.id_lider)
    const Proj_Cr = document.createElement('button'); // Projeto Criado
    Proj_Cr.classList.add("projeto-card");

    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode(info.titulo));
    Proj_Cr.appendChild(h3);

    Proj_Cr.appendChild(document.createElement('hr'));
    const box = document.createElement('div');
    box.classList.add("caixa");
    box.appendChild(ProjetoContent("lider-gen", "Lider: " + lider.usuario.nome));

    Proj_Cr.appendChild(box);

    
    Proj_Cr.addEventListener("click", () => {
        localStorage.setItem("Projeto", info.id_projeto)
        open("Dashboard_Demanda.html", "_self");
    }); 

    document.getElementById("secao-projeto").appendChild(Proj_Cr);
}

function ProjetoContent(classe, texto) {
    const content = document.createElement('div');
    content.classList.add("gen");
    content.classList.add(classe);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(texto));

    content.appendChild(p);
    
    return content;
}

// Cria os projetos dinamicamente na tela a partir de arquivos JSON

const usuario = JSON.parse(localStorage.getItem("UsuarioLogado"));
let jsonprojetos;
if (usuario.papel === "Administrador") {
    jsonprojetos = await ListarProjetosApi();
}
else {
    jsonprojetos = await ListarProjetosUsuarioApi(usuario.id_usuario);
}
for (const projeto of jsonprojetos) { 
    CreateProjeto(projeto);
}

document.getElementById("btn-filtrar").addEventListener("click", async () => {
    document.getElementById("secao-projeto").innerHTML = "";
    
    let nome;
    let lider;
    try { nome = document.getElementById("filtro_nome").value; }
    catch { nome = ""; }
    try {lider = document.getElementById("filtro_lider").value; }
    catch { lider = ""; }
    
    if (usuario.papel === "Administrador") {
        jsonprojetos = await ListarProjetosApi(nome, lider);
    }
    
    else {
        jsonprojetos = await ListarProjetosUsuarioApi(usuario.id_usuario, nome, lider);
    }
    for (const projeto of jsonprojetos) {   
        CreateProjeto(projeto);
    }
}); 
