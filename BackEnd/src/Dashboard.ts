//Feito por Lucas Studach Kaid Ludemann
//RA: 26006454

//IMPORTAR O MODULO ROUTER DA BIBLOTECA EXPRESS
import express, {Router, Request, Response} from "express";
const RouterDashboard: Router = express.Router();

RouterDashboard.use(express.json());


type typeStatus= "ABERTA" | "EM ANDAMENTO" | "EM REVISÃO" 
| "CONCLUÍDA" | "CANCELADA";

type typePrioridade= "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA";

type typeTipo=  "TAREFA" | "MELHORIA" | "DEFEITO" | "DOCUMENTAÇÃO";

interface demanda {
    Id: number;
    Status: typeStatus;
    Prioridade: typePrioridade;
    Tipo: typeTipo;
    Dias_finalizar: number;
}

let Demandas: demanda [] = [
    {
        Id: 1,
        Status: "ABERTA",
        Prioridade: "CRÍTICA",
        Tipo: "TAREFA",
        Dias_finalizar: 2,
    },
    {
        Id: 2,
        Status: "EM ANDAMENTO",
        Prioridade: "CRÍTICA",
        Tipo: "MELHORIA",
        Dias_finalizar: 2,
    },
    {
        Id: 3,
        Status: "EM ANDAMENTO",
        Prioridade: "ALTA",
        Tipo: "DEFEITO",
        Dias_finalizar: 4,
    },
    {
        Id: 4,
        Status: "EM REVISÃO",
        Prioridade: "MÉDIA",
        Tipo: "DEFEITO",
        Dias_finalizar: 3,
    },
    {
        Id: 5,
        Status: "CONCLUÍDA",
        Prioridade: "ALTA",
        Tipo: "DOCUMENTAÇÃO",
        Dias_finalizar: 0,
    },
    {
        Id: 6,
        Status: "CANCELADA",
        Prioridade: "BAIXA",
        Tipo: "MELHORIA",
        Dias_finalizar: 0,
    },
    {
        Id: 7,
        Status: "EM ANDAMENTO",
        Prioridade: "ALTA",
        Tipo: "TAREFA",
        Dias_finalizar: 2,
    },
    {
        Id: 8,
        Status: "EM ANDAMENTO",
        Prioridade: "MÉDIA",
        Tipo: "MELHORIA",
        Dias_finalizar: 5,
    },
    {
        Id: 9,
        Status: "EM REVISÃO",
        Prioridade: "ALTA",
        Tipo: "DEFEITO",
        Dias_finalizar: 2,
    },
    {
        Id: 10,
        Status: "CONCLUÍDA",
        Prioridade: "ALTA",
        Tipo: "DEFEITO",
        Dias_finalizar: 0,
    }
];

RouterDashboard.get("/Dashboard", (req: Request, res: Response) => {
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

    for (const demanda of Demandas) {
        if (demanda.Status === "ABERTA") {abertas++;}
        else if (demanda.Status === "EM ANDAMENTO") {andam++;}
        else if (demanda.Status === "EM REVISÃO") {rev++;}
        else if (demanda.Status === "CONCLUÍDA") {conc++;}
        else if (demanda.Status === "CANCELADA") {canc++;}

        if (demanda.Prioridade === "CRÍTICA") {crit++;}
        else if (demanda.Prioridade === "ALTA") {alta++;}
        else if (demanda.Prioridade === "MÉDIA") {media++;}
        else if (demanda.Prioridade === "BAIXA") {baixa++;}

        if (demanda.Tipo === "TAREFA") {tarefa++;}
        else if (demanda.Tipo === "MELHORIA") {melhoria++;}
        else if (demanda.Tipo === "DEFEITO") {defeito++;}
        else if (demanda.Tipo === "DOCUMENTAÇÃO") {doc++;}

        if (demanda.Dias_finalizar <= 3) {final++;}

        if ((demanda.Status === "ABERTA") && (demanda.Prioridade === "CRÍTICA")) {demcrit++;}
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
export default RouterDashboard;