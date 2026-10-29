/*
    Feito por Lucas Studach Kaid Ludemann
    RA: 26006454
    Modificado por: Arthur Cardoso Martin
    RA: 26006506
*/

import express, {Router, Request, Response} from "express";
import {DemandaRow} from "../dados/dados";
import Conexao from "../dados/database";

const router = Router();

router.use(express.json());

router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    //CONTADORES DOS STATUS
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
    const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda where demanda.id_projeto = ?", [id]);
    for (const demanda of demandas) {
        if (demanda.statusDemanda === "Aberta".toLowerCase()) {abertas++;}
        else if (demanda.statusDemanda === "Em andamento".toLowerCase()) {andam++;}
        else if (demanda.statusDemanda === "Em revisao".toLowerCase()) {rev++;}
        else if (demanda.statusDemanda === "Concluida".toLowerCase()) {conc++;}
        else if (demanda.statusDemanda === "Cancelada".toLowerCase()) {canc++;}

        if (demanda.prioridade === "Critica".toLowerCase()) {crit++;}
        else if (demanda.prioridade === "Alta".toLowerCase()) {alta++;}
        else if (demanda.prioridade === "Media".toLowerCase()) {media++;}
        else if (demanda.prioridade === "Baixa".toLowerCase()) {baixa++;}

        if (demanda.tipo === "Tarefa".toLowerCase()) {tarefa++;}
        else if (demanda.tipo === "Melhoria".toLowerCase()) {melhoria++;}
        else if (demanda.tipo === "Defeito".toLowerCase()) {defeito++;}
        else if (demanda.tipo === "Documentacao".toLowerCase()) {doc++;}

        let prazo: Date = new Date;
        if(demanda.prazoFinalizacao === null){
            diasFinalizar = -1;
        }else{
            prazo = demanda.prazoFinalizacao;
            diasFinalizar = prazo ? (demanda.prazoFinalizacao.getFullYear() - diaAtual.getFullYear()) * 365 + (demanda.prazoFinalizacao.getMonth() - diaAtual.getMonth()) * 30 + (demanda.prazoFinalizacao.getDate() - diaAtual.getDate()) : -1;
        }
        if ((diasFinalizar <= 7) && (diasFinalizar >= 0)) {final++;}

        if ((demanda.statusDemanda === "Aberta".toLowerCase()) && (demanda.prioridade === "Critica".toLowerCase())) {demcrit++;}
        total++;
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