//Feito por Lucas Studach Kaid Ludemann
//RA: 26006454

//IMPORTAR O MODULO ROUTER DA BIBLOTECA EXPRESS
import express, {Router, Request, Response} from "express";
import {demandas} from "../dados/dados";

const router = Router();

router.use(express.json());

router.get("/", (req: Request, res: Response) => {
    //CONTADORES DOS sTATUS
    let abertas= 0;
    let andam= 0;
    let rev= 0;
    let conc= 0;
    let canc= 0;

    //CONTADORES DAS PRIORIDADES
    let crit= 0;
    let alta= 0;
    let media= 0;
    let baixa= 0;

    //CONTADORES DOS TIPOS
    let tarefa= 0;
    let melhoria= 0;
    let defeito= 0;
    let doc= 0;

    //CONTADOR DE DEMANDAS PRÓXIMAS DA DATA FINAL
    let final= 0;

    //CONTADOR DE DEMANDAS CRÍTICAS EM ABERTO
    let demcrit= 0;

    //CONTADOR DO TOTAL DE DEMANDAS
    let total= 0;
    let diasFinalizar: number;
    const diaAtual = new Date();
    for (const demanda of demandas) {
        if (demanda.status === "Aberta") {abertas++;}
        else if (demanda.status === "Em andamento") {andam++;}
        else if (demanda.status === "Em revisão") {rev++;}
        else if (demanda.status === "Concluída") {conc++;}
        else if (demanda.status === "Cancelada") {canc++;}

        if (demanda.prioridade === "Crítica") {crit++;}
        else if (demanda.prioridade === "Alta") {alta++;}
        else if (demanda.prioridade === "Média") {media++;}
        else if (demanda.prioridade === "Baixa") {baixa++;}

        if (demanda.tipo === "Tarefa") {tarefa++;}
        else if (demanda.tipo === "Melhoria") {melhoria++;}
        else if (demanda.tipo === "Defeito") {defeito++;}
        else if (demanda.tipo === "Documentação") {doc++;}

        diasFinalizar = demanda.prazo_finalizacao ? 
        (demanda.prazo_finalizacao.getFullYear() - diaAtual.getFullYear()) * 365 + (demanda.prazo_finalizacao.getMonth() - diaAtual.getMonth()) * 30 + (demanda.prazo_finalizacao.getDate() - diaAtual.getDate()) : -1;
        if ((diasFinalizar <= 3) && (diasFinalizar >= 0)) {final++;}

        if ((demanda.status === "Aberta") && (demanda.prioridade === "Crítica")) {demcrit++;}
        total++;
        console.log(diasFinalizar);
    }
    
    return res.status(200).json({
    mensagem: "Situação das demandas",
    total,
    status: {
        abertas,
        emAndamento: andam,
        emRevisao: rev,
        concluidas: conc,
        canceladas: canc,
    },
    prioridades: {
        critica: crit,
        alta,
        media,
        baixa,
    },
    tipos: {
        tarefa,
        melhoria,
        defeito,
        documentacao: doc,
    },
        proximasDoPrazo: final,
        demandas_criticas_abertas: demcrit
    });
});

//EXPORTAR A ROTA PARA O ARQUIVO INDEX.JS
export default router;