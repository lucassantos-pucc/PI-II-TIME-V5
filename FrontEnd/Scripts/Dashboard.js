
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

import { DashboardDemandasApi, DashboardProjetosApi } from "./Api.js";

async function DemandasMostrar() {
    const info = await DashboardDemandasApi();

    const total = document.getElementById("total");
    total.textContent = info.total;

    const status = document.getElementById("status");
    let staText = `ABERTAS: ${info.status.abertas}<br>`;
    staText += `EM ANDAMENTO: ${info.status.emAndamento}<br>`;
    staText += `EM REVISÃO: ${info.status.emRevisao}<br>`;
    staText += `CONCLUÍDAS: ${info.status.concluidas}<br>`;
    staText += `CANCELADAS: ${info.status.canceladas}`;

    status.innerHTML = staText;

    const prioridade = document.getElementById("prioridade");
    let priText = `CRÍTICA: ${info.prioridades.critica}<br>`;
    priText += `ALTA: ${info.prioridades.alta}<br>`;
    priText += `MÉDIA: ${info.prioridades.media}<br>`;
    priText += `BAIXA: ${info.prioridades.baixa}`;

    prioridade.innerHTML = priText;

    const tipo = document.getElementById("tipo");
    let tipoText = `TAREFA: ${info.tipos.tarefa}<br>`;
    tipoText += `MELHORIA: ${info.tipos.melhoria}<br>`;
    tipoText += `DEFEITO: ${info.tipos.defeito}<br>`;
    tipoText += `DOCUMENTAÇÃO: ${info.tipos.documentacao}`;

    tipo.innerHTML = tipoText;

    const prox = document.getElementById("prox");
    prox.textContent = info.proximasDoPrazo;

    const andacrit = document.getElementById("andacrit");
    andacrit.textContent = info.demandas_criticas_abertas;
    
}

async function ProjetosMostrar() {

}

if (document.title === "Dashboard_Demandas") { DemandasMostrar(); }

else if (document.title === "Dashboard_Projetos") { ProjetosMostrar(); }