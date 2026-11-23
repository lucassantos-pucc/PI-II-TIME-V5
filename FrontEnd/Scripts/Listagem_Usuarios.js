// Feito por: Arthur Cardoso Martin
// RA: 26006506
 
import { ListarUsuariosApi } from "./Api.js";
 
const CLASSE_PERFIL = {
    "Administrador": "perfil-adm",
    "Lider de Projeto": "perfil-lider",
    "Membro da equipe": "perfil-membro"
};
 
// Cria um item da lista com a mesma estrutura do HTML
function CreateUsuario(info) {
    const li = document.createElement("li");
    li.classList.add("usuarios-item");
 
    const divInfo = document.createElement("div");
    divInfo.classList.add("usuarios-info");
 
    const nome = document.createElement("span");
    nome.classList.add("usuarios-nome");
    nome.textContent = info.nome;
    divInfo.appendChild(nome);
 
    const email = document.createElement("span");
    email.classList.add("usuarios-email");
    email.textContent = info.email;
    divInfo.appendChild(email);
 
    li.appendChild(divInfo);
 
    const divDetalhes = document.createElement("div");
    divDetalhes.classList.add("usuarios-detalhes");
 
    const badge = document.createElement("span");
    badge.classList.add("usuarios-badge", CLASSE_PERFIL[info.papel]);
    badge.textContent = info.papel;
    divDetalhes.appendChild(badge);
 
    li.appendChild(divDetalhes);
 
    document.querySelector(".usuarios-lista").appendChild(li);
}
 
const jsonusuarios = await ListarUsuariosApi();
 
document.querySelector(".usuarios-lista").innerHTML = ""; // remove os itens de exemplo do HTML
 
for (const usuario of jsonusuarios.usuarios) {
    CreateUsuario(usuario);
}