import { Request, Response } from "express";

const express = require("express");

const RouterDetalhes = express.Router();
const RouterComentarios = express.Router();

RouterDetalhes.use(express.json());
RouterComentarios.use(express.json());

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

interface Comentario {
    id: number;
    demandaId: number;
    autor: string;
    conteudo: string;
    data: Date;
};

let Comentarios: Comentario[] = [ // !! Lista temporária
    {
        id: 1,
        demandaId: 1,
        autor: "Usario Exemplo 1",
        conteudo: "Comentário de teste 1",
        data: new Date(2026, 10, 11)
    },
    {
        id: 2,
        demandaId: 1,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 3,
        demandaId: 2,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 3,
        demandaId: 2,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 3,
        demandaId: 3,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    }
];

RouterDetalhes.get("/demandas/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = Demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    return res.status(200).json(demanda);
});

RouterComentarios.get("/demandas/:id/comentarios", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = Demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const comentarios = Comentarios.filter((c) => c.demandaId === id) || [];
    if (comentarios.length === 0) {
        return res.status(404).json({ error: "Nenhum comentário encontrado para esta demanda" });
    }
    return res.status(200).json(comentarios);
});

RouterComentarios.post("/demandas/:id/comentarios", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = Demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const { autor, conteudo } = req.body;
    const novoComentario: Comentario = {
        id: Comentarios.length + 1,
        demandaId: id,
        autor,
        conteudo,
        data: new Date()
    };
    Comentarios.push(novoComentario);
    return res.status(201).json(novoComentario);
});


export default {RouterDetalhes, RouterComentarios};