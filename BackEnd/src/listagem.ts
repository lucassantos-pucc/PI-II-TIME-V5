import { Request, Response } from "express";

const express = require("express");

const routerListagem = express.Router();

routerListagem.use(express.json());

type T_Tipo = "Defeito" | "Tarefa" | "Melhoria" | "Documentação";
type T_Prioridade = "Baixa" | "Média" | "Alta" | "Crítica";
type T_Status = "Aberta" | "Em andamento" | "Em revisao" | "Concluído" | "Cancelado";

interface Demanda {
    id: number;
    nome: string;
    tipo: T_Tipo;
    prioridade: T_Prioridade;
    status: T_Status;
    projeto: string;
    responsavel: string;
    dtcriacao: Date;
    prazo: Date;
};

let Demandas: Demanda[] = [ // !! Lista temporária
    {
        id: 1,
        nome: "Teste1",
        tipo: "Defeito",
        prioridade: "Baixa",
        status: "Aberta",
        projeto: "Projeto Exemplo 1",
        responsavel: "Sr.Exemplilson",
        dtcriacao: new Date(2026, 10, 11),
        prazo: new Date(2026, 10, 14)
    },
    {
        id: 2,
        nome: "Teste2",
        tipo: "Documentação",
        prioridade: "Média",
        status: "Em andamento",
        projeto: "Projeto Exemplo 2",
        responsavel: "Sr.Exemplilson",
        dtcriacao: new Date(2026, 10, 12),
        prazo: new Date(2026, 10, 15)
    },
    {
        id: 3,
        nome: "Teste3",
        tipo: "Defeito",
        prioridade: "Baixa",
        status: "Cancelado",
        projeto: "Projeto Exemplo 1",
        responsavel: "Sr.Exemplar",
        dtcriacao: new Date(2026, 10, 11),
        prazo: new Date(2026, 10, 14)
    }
];

routerListagem.get("/demandas", (req: Request, res: Response) => {
    let filtro = Demandas;
    const tipo = req.query.tipo;
    const prioridade = req.query.prioridade;
    const status = req.query.status;
    const projeto = req.query.projeto;
    const responsavel = req.query.responsavel;

    if (tipo) { filtro = filtro.filter((i) => i.tipo === tipo); }

    if (prioridade) { filtro = filtro.filter((i) => i.prioridade === prioridade); }

    if (status) { filtro = filtro.filter((i) => i.status === status); }
    
    if (projeto) { filtro = filtro.filter((i) => i.projeto === projeto); }
    
    if (responsavel) { filtro = filtro.filter((i) => i.responsavel === responsavel); }

    if (tipo || prioridade || status || projeto || responsavel) { return res.status(200).json(filtro); }

    return res.status(200).json(Demandas);
});Demandas



export default routerListagem;