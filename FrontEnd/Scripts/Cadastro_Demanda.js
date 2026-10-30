/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

import { CadastrarDemandasApi, ListarUsuariosApi, EditarDemandasApi, BuscarFeriadoNacional } from "./Api.js";

const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("Responsavel_id");
const descricao = document.getElementById("descricao_id");
const usuarios = await ListarUsuariosApi();
let id_responsavel, id_demanda;
let editar = 0;
let prazoOriginal = "";

if (localStorage.getItem("DemandaAtual") && localStorage.getItem("DemandaAtual") !== "{}") { // Pega os valores armazenados no localStorage e coloca nos inputs
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));
    titulo.value = demandaAtual.titulo;
    console.log(demandaAtual.prazoFinalizacao)
    prazo.value = demandaAtual.prazoFinalizacao
        ? demandaAtual.prazoFinalizacao.split("/").reverse().join("-")
        : "";
    prazoOriginal = prazo.value;
    document.getElementById("cadastro").innerHTML = "Editar Demanda"
    document.getElementById("prioridade_id").value = demandaAtual.prioridade;
    document.getElementById("status_id").value = demandaAtual.statusDemanda;
    document.getElementById("tipos_id").value = demandaAtual.tipo;
    responsavel.value = demandaAtual.responsavel;
    descricao.value = demandaAtual.descricao;
    editar =1
    id_demanda = demandaAtual.id_demanda;
}


form.addEventListener("submit",async function (event) {
    event.preventDefault();
    id_responsavel = undefined;
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
    if (prazo.value) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const [a, m, d] = prazo.value.split("-").map(Number);
        if (new Date(a, m - 1, d) <= hoje) {
            erros.push("O prazo deve ser uma data futura.");
        }
    }
    if(responsavel.value !== "" && id_responsavel === undefined){
        erros.push("O Responsavel não existe.");

    }
    if (erros.length > 0) {
        alert(erros.join("\n")); 
        return;
    }

    if (prazo.value && prazo.value !== prazoOriginal) {
        try {
            const feriado = await BuscarFeriadoNacional(prazo.value);
            if (feriado) {
                alert(`O prazo não pode ser um feriado nacional: ${feriado.name} (${prazo.value.split("-").reverse().join("/")}).`);
                return;
            }
        } catch (e) {
            alert("Não foi possível verificar se a data é feriado. Tente novamente.");
            return;
        }
    }

    const demanda = { //Preparar a estrutura para json
        id_demanda: id_demanda,
        titulo: titulo.value.trim(),
        tipo: document.getElementById("tipos_id").value,
        prioridade: document.getElementById("prioridade_id").value,
        prazoFinalizacao: prazo.value || null,
        statusDemanda: document.getElementById("status_id").value,
        descricao: descricao.value.trim(),
        id_projeto: Number(localStorage.getItem("Projeto")),
        id_responsavel: responsavel.value !== "" ? id_responsavel : null ,
    };
    try{
        if (editar ===0){
            console.log(await CadastrarDemandasApi(demanda));
            open("Listagem_Demanda.html", "_self");
        }else{        
            console.log(await EditarDemandasApi(id_demanda, demanda));
            console.log("editado")
            const antiga = JSON.parse(localStorage.getItem("DemandaAtual") || "{}");
            const json = JSON.stringify({
                ...antiga,
                ...demanda,
                prazoFinalizacao: prazo.value ? prazo.value.split("-").reverse().join("/") : "",
                responsavel: responsavel.value.trim()
            });
            localStorage.setItem("DemandaAtual", json); 
            sessionStorage.setItem("DemandaAtual", json);
            open("Demanda.html", "_self");
        }
    }catch (e){
        alert(e.message)
    }
});