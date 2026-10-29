
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

import { ListarProjetosApi, ListarProjetosUsuarioApi, ListarUsuarioApi } from "./Api.js";


async function CreateProjeto(info) {
    const lider = await ListarUsuarioApi(info.id_lider)
    const Proj_Cr = document.createElement('button'); // !! Projeto Criado || Não sei se o projeto tem q ser uma div ou botão, deixei como tava no demandas mas podem mudar
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
        localStorage.setItem("Projeto", info.id_projeto);
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
/*
const jsonprojetos = []; // !! Temporario
jsonprojetos[0] = '{"nome":"Teste1", "lider":"Sr.Exemplilson", "status":"Aberta", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 1"}';
jsonprojetos[1] = '{"nome":"Teste2", "lider":"Sr.Exemplilson", "status":"Em andamento", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 2"}';
jsonprojetos[2] = '{"nome":"Teste3", "lider":"Sr.Exemplilson", "status":"Concluido", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 3"}';
jsonprojetos[3] = '{"nome":"Teste4", "lider":"Sr.Exemplilson", "status":"Cancelado", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 4"}';
*/
const usuario = JSON.parse(localStorage.getItem("UsuarioLogado"));
let jsonprojetos;
if (usuario.papel === "Administrador") {
    jsonprojetos = await ListarProjetosApi();
}

else {
    jsonprojetos = await ListarProjetosUsuarioApi(usuario.id_usuario);
}

console.log(jsonprojetos);
for (const projeto of jsonprojetos) {
    console.log(projeto);   
    CreateProjeto(projeto);
}