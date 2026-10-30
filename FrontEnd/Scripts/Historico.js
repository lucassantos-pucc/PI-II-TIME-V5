// Feito por: Lucas de Oliveira Santos
// RA: 26887166

//CRIAR HISTORICO NO FRONT

import { CarregarHistoricoApi, RegistrarHistoricoApi, BuscarDemandasApi, BuscarProjetoApi,  } from "./Api.js";

// parte grafica
async function CriarHistorico(info){
    
    const Historico_cr = document.createElement('li');
    Historico_cr.classList.add("historico-item"); //adiciona a classe

    const span = document.createElement('span'); 
    span.classList.add('historico-texto'); 

    const strong = document.createElement("strong"); 
    strong.textContent = info.nome;

    span.appendChild(strong);
    span.appendChild(document.createTextNode(" " + info.descricao));

    Historico_cr.appendChild(span);

    // Criar data do histórico
    const data = document.createElement("span");
    data.classList.add("historico-data");

    const dataHora = new Date(info.dataHora);
    data.textContent = dataHora.toLocaleString("pt-BR");
    
    Historico_cr.appendChild(data);

    Historico_cr.appendChild(data);

    // Adicionar o histórico na lista do HTML
    document.querySelector("ul").appendChild(Historico_cr);
}

async function MostrarHistorico(){
    //localStorage.setItem("DemandaAtual", 1)
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));

    if(!demandaAtual.id_demanda){
        console.log("nenhuma demanda selecionada.");
        return;
    }

    try{
        const historicos = await CarregarHistoricoApi(demandaAtual.id_demanda);

        let tamanho = historicos.length;
        let historico = 0
        while(historico < tamanho){
            CriarHistorico(historicos[historico])
            historico++;
        }
    }

    catch (erro) {
    console.log("Erro ao carregar histórico:", erro);
    }
}

export async function RegistrarHistorico(demandaAtual, demandaAntiga){

    
    const autor = JSON.parse(localStorage.getItem("UsuarioLogado")).id_usuario;
    let descricao = "";

    //verificar os campos que mudaram
    // Verificar se é uma demanda nova
    if (demandaAntiga == null) {
        descricao += "Demanda " + demandaAtual.titulo + " criada | ";
    }

    else {

        if (demandaAntiga.titulo !== demandaAtual.titulo) {
            descricao += "Título alterado de " + demandaAntiga.titulo + " para " + demandaAtual.titulo + " | ";
        }

        if (demandaAntiga.status !== demandaAtual.status) {
            descricao += "Status alterado de " + demandaAntiga.status +
                " para " + demandaAtual.status + " | ";
        }

        if (demandaAntiga.prazo !== demandaAtual.prazo) {
            descricao += "Prazo alterado de " + demandaAntiga.prazo +
                " para " + demandaAtual.prazo + " | ";
        }

        if (demandaAntiga.prioridade !== demandaAtual.prioridade) {
            descricao += "Prioridade alterada | ";
        }

        if (demandaAntiga.responsavel !== demandaAtual.responsavel) {
            descricao += "Responsável alterado | ";
        }

        if (demandaAntiga.descricao !== demandaAtual.descricao) {
            descricao += "Descrição alterada | ";
        }
    }

    if (descricao === "") {
        console.log("Nenhuma alteração realizada.");
        return;
    }
    const historico = {
            descricao: descricao,
            id_autor: autor,
            id_demanda: demandaAtual.id_demanda,
        };
        console.log(await RegistrarHistoricoApi(historico));
}

MostrarHistorico();