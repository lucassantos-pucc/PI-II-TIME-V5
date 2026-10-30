/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

import { CadastrarDemandasApi, ListarUsuariosApi, EditarDemandasApi } from "./Api.js";

const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("Responsavel_id");
const descricao = document.getElementById("descricao_id");
const usuarios = await ListarUsuariosApi();
let id_responsavel, id_demanda;
let editar = 0;
if (localStorage.getItem("DemandaAtual") && localStorage.getItem("DemandaAtual") !== "{}") { // Pega os valores armazenados no localStorage e coloca nos inputs
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));
    titulo.value = demandaAtual.titulo;
    console.log(demandaAtual.prazoFinalizacao)
    prazo.value = demandaAtual.prazoFinalizacao.split('/').reverse().join('-'); // Inverte a data para o formato yyyy-mm-dd
    document.getElementById("cadastro").innerHTML = "Editar Demanda"
    document.getElementById("prioridade_id").value = demandaAtual.prioridade;
    document.getElementById("status_id").value = demandaAtual.statusDemanda;
    document.getElementById("tipos_id").value = demandaAtual.tipo;
    responsavel.value = demandaAtual.responsavel;
    descricao.value = demandaAtual.descricao;
    editar =1
    id_demanda = demandaAtual.id_demanda;
}


form.addEventListener("submit", function (event) {
    event.preventDefault();
    for (const usuario of usuarios.usuarios){
        if(responsavel.value === usuario.nome){
            id_responsavel = usuario.id_usuario;
        }

    }

    const erros = [];
    if (titulo.value.trim().length < 3) {
        erros.push("O título deve ter pelo menos 3 caracteres.");
    }
    else if(titulo.value.trim().length > 30){
        erros.push("O título não deve ter mais de 30 caracteres.")
    }
    if (prazo && new Date(prazo.value) <= new Date()) { //Verifica data futura
        erros.push("O prazo deve ser uma data futura.");
    }
    if(responsavel.value !== "" && id_responsavel === undefined){
        erros.push("O Responsavel não existe.");

    }
    if (erros.length > 0) {
        alert(erros.join("\n")); //juntos os elementos do array seperando por \n
        return;
    }

    alert("Demanda validada com sucesso!");
    const newPrazo = prazo.value.trim().split('-').reverse().join('/'); // Inverte a data para o formato dd/mm/yyyy

    const demanda = { //Preparar a estrutura para json
        titulo: titulo.value.trim(),
        tipo: document.getElementById("tipos_id").value,
        prioridade: document.getElementById("prioridade_id").value,
        prazoFinalizacao: newPrazo,
        statusDemanda: document.getElementById("status_id").value,
        descricao: descricao.value.trim(),
        id_projeto: localStorage.getItem("Projeto"),
        id_responsavel: responsavel.value !== "" ? null : id_responsavel,
    };
    if (editar ===0){
        console.log(CadastrarDemandasApi(demanda));
    }else{
        
        console.log(EditarDemandasApi(id_demanda, demanda));
    }
    form.reset();
    localStorage.setItem("DemandaAtual", JSON.stringify({})); // Limpa a demanda atual
    open("Listagem_Demanda.html", "_self");
});