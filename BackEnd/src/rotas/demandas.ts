/*
    Feito por: Lucas de Oliveira Santos
    RA: 26887166
    Modificado por: Arthur Cardoso Martin
    RA: 26006506
*/

//importando dados testes

import { Request, Response, Router } from "express";
import {Demanda, DemandaRow, ProjetoRow, UsuarioRow, Tipo , Prioridade, Status} from "../dados/dados";
import Conexao from "../dados/database";

const router = Router();

/*Listagem de demandas por projeto e filtros
Teste valido
/?id=1
/?id_projeto=3

Teste invalido
/?id=a
/?id_projeto=a
*/
router.get("/", async (req: Request, res: Response) => {
    const projeto = Number(req.query.id_projeto);
    const id_demanda = Number(req.query.id_demanda);
    const id_usuario = Number(req.query.id_usuario);
    
    if (id_demanda){
        const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda");
        const demanda = demandas.find((d) => d.id_demanda === id_demanda);
        if (!demanda) {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }
        return res.status(200).json(demanda);
    }

    let [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda where id_projeto = ?", [projeto]);

    if(id_usuario !== -1 && id_usuario){ 
        [demandas]  = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda where id_projeto = ? and id_responsavel = ?", [projeto, id_usuario]);
    }
    
    const tipo = req.query.tipo;
    const prioridade = req.query.prioridade;
    const status = req.query.status;
    const responsavel = req.query.responsavel;
    let filtro = demandas;
    if (projeto) { filtro = filtro.filter((i) => i.id_projeto === projeto); }

    if (tipo) { filtro = filtro.filter((i) => i.tipo === tipo); }

    if (prioridade) { filtro = filtro.filter((i) => i.prioridade === prioridade); }

    if (status) { filtro = filtro.filter((i) => i.statusDemanda === status); }
    
    if (responsavel) { filtro = filtro.filter((i) => i.id_responsavel === Number(responsavel)); }
    return res.status(200).json(filtro);
});

//POST DEMANDAS
/*
Teste valido
{
 "titulo": "Nova Demanda",
 "tipo": "Tarefa",
 "prazoFinalizacao": "2023-12-31",
 "statusDemanda": "Aberta",
 "prioridade": "Alta",
 "descricao": "Descrição detalhada da demanda",
 "id_projeto": 1,
 "id_responsavel": 1
}

Teste invalido
{
 "titulo": "Nova Demanda",
 "tipo": "Tarefa",
 "prazoFinalizacao": "2023-12-31",
 "prioridade": "prioridade_invalida",
 "id_projeto": 1,
 "id_responsavel": 1,
 "descricao": "Descrição detalhada da demanda"
}
*/

router.post("/", async (req:Request, res:Response)=>{
    //pega dados apartir da requisicao
    const {titulo, tipo, prazoFinalizacao, statusDemanda, prioridade, descricao, id_projeto, id_responsavel} = req.body;
    //validacao dos dados
    if(!titulo || !tipo || !prioridade || !id_projeto || !descricao){
        return res.status(400).json({
            mensagem: "titulo, tipo, prioridade, id_projeto, descricao e statusDemanda são obrigatorios"
        })
    }
    let statusFinal: Status;
    if(!["Defeito", "Tarefa", "Melhoria", "Documentação"].includes(tipo)){
        return res.status(400).json({ mensagem: "Tipo inválido."});
    }
    if(!["Baixa", "Média", "Alta", "Crítica"].includes(prioridade)){
        return res.status(400).json({mensagem: "Prioridade inválida."});
    }
    if(!statusDemanda){
        statusFinal = "Aberta";
    }else if(!["Aberta", "Em andamento", "Em revisão", "Concluída"].includes(statusDemanda)){
        return res.status(400).json({mensagem: "Status inválido."});
    }else{
        statusFinal = statusDemanda as Status;
    }

    const [projetos] = await Conexao.query<ProjetoRow[]>("SELECT * FROM projeto");
    const projetoExiste = projetos.find((item)=> item.id_projeto === id_projeto);

    if(!projetoExiste){
        return res.status(404).json({mensagem: "Projeto Atribuído não encontrado."})
    }

    // Se não houver responsável, deixa null
    const responsavelFinal = id_responsavel || null;

    let prazo: Date | null;

    //se tiver um prazo de finalização (em string) converte para Date
    if (prazoFinalizacao) {
        prazo = new Date(prazoFinalizacao);
    } 
    // se não tiver deixa null
    else {
        prazo = null;
    }

    //se tudo estiver certo cria uma nova demanda 
    const novaDemanda: Omit<Demanda, 'id_demanda'> = {
        titulo, 
        tipo: tipo as Tipo, // Informa ao TypeScript que o valor de tipo pertence ao conjunto de tipos permitidos.
        dataCriacao: new Date(), 
        dataAlteracao: new Date(),
        prazoFinalizacao: prazo, 
        statusDemanda: statusFinal as Status,
        prioridade: prioridade as Prioridade, // Informa ao TypeScript que a prioridade pertence ao conjunto de prioridades permitidas.
        id_projeto, 
        id_responsavel: responsavelFinal,
        descricao
    };
    console.log(novaDemanda);
    const resposta = await Conexao.query("INSERT INTO demanda (titulo, tipo, dataCriacao, prazoFinalizacao, statusDemanda, prioridade, dataAlteracao, descricao, id_responsavel, id_projeto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [novaDemanda.titulo, novaDemanda.tipo, novaDemanda.dataCriacao, novaDemanda.prazoFinalizacao, novaDemanda.statusDemanda, novaDemanda.prioridade, novaDemanda.dataAlteracao, novaDemanda.descricao, novaDemanda.id_responsavel, novaDemanda.id_projeto]
    );
    console.log("Resposta do banco de dados:", resposta);
    //returna nova demanda
    return res.status(201).json(novaDemanda);
});

//EDITAR DEMANDA
/*
Teste valido
PUT /1
{
 "titulo": "Titulo editado",
 "prioridade": "Crítica",
 "prazoFinalizacao": "2026-12-31",
 "id_responsavel": 2
}
 
Teste invalido
PUT /999
*/
router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {titulo, tipo, prazoFinalizacao, prioridade, descricao, id_responsavel} = req.body;
 
    const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda");
    const demanda = demandas.find((d) => d.id_demanda === id);
 
    if (!demanda) {
        return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }
 
    const campos: string[] = [];
    const valores: any[] = [];
 
    if (titulo !== undefined) {
        if (!titulo) { return res.status(400).json({ mensagem: "Título não pode ser vazio." }); }
        campos.push("titulo = ?");
        valores.push(titulo);
    }
    if (descricao !== undefined) {
        if (!descricao) { return res.status(400).json({ mensagem: "Descrição não pode ser vazia." }); }
        campos.push("descricao = ?");
        valores.push(descricao);
    }
    if (tipo !== undefined) {
        if (!["Defeito", "Tarefa", "Melhoria", "Documentação"].includes(tipo)) {
            return res.status(400).json({ mensagem: "Tipo inválido." });
        }
        campos.push("tipo = ?");
        valores.push(tipo);
    }
    if (prioridade !== undefined) {
        if (!["Baixa", "Média", "Alta", "Crítica"].includes(prioridade)) {
            return res.status(400).json({ mensagem: "Prioridade inválida." });
        }
        campos.push("prioridade = ?");
        valores.push(prioridade);
    }
    if (prazoFinalizacao !== undefined) {
        let prazo: Date | null = null;
        if (prazoFinalizacao) {prazo = new Date(prazoFinalizacao);}
        campos.push("prazoFinalizacao = ?");
        valores.push(prazo);
    }
    if (id_responsavel !== undefined) {
        const responsavelFinal = id_responsavel || null;
        if (responsavelFinal) {
            const [usuarios] = await Conexao.query<UsuarioRow[]>("SELECT * FROM usuario");
            const usuarioExiste = usuarios.find((u) => u.id_usuario === responsavelFinal);
            if (!usuarioExiste) {
                return res.status(404).json({ mensagem: "Responsável não encontrado." });
            }
        }
        campos.push("id_responsavel = ?");
        valores.push(responsavelFinal);
    }
 
    if (campos.length === 0) {
        return res.status(400).json({ mensagem: "Nenhum campo para atualizar." });
    }
 
    valores.push(id);
 
    await Conexao.query("UPDATE demanda SET " + campos.join(", ") + " WHERE id_demanda = ?;", valores);
 
    const [atualizada] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda WHERE id_demanda = ?", [id]);
    return res.status(200).json(atualizada[0]);
});

//Patch demanda
/*
Teste valido
PATCH /1/status
{
 "statusDemanda": "Em andamento"
}
 
Teste invalido
{
 "statusDemanda": "status_invalido"
}
*/
router.patch("/:id/status", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {statusDemanda} = req.body;
 
    if (!statusDemanda || !["Aberta", "Em andamento", "Em revisão", "Concluída", "Cancelada"].includes(statusDemanda)) {
        return res.status(400).json({ mensagem: "Status inválido." });
    }
 
    const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda");
    const demanda = demandas.find((d) => d.id_demanda === id);
 
    if (!demanda) {
        return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }
 
    await Conexao.query("UPDATE demanda SET statusDemanda = ? WHERE id_demanda = ?;", [statusDemanda, id]);
 
    return res.status(200).json({ id_demanda: id, statusDemanda: statusDemanda as Status });
});

//Patch cancelar demanda
/*
Teste valido
PATCH /1/cancelar
 
Teste invalido
PATCH /999/cancelar
*/
router.patch("/:id/cancelar", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
 
    const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda");
    const demanda = demandas.find((d) => d.id_demanda === id);
 
    if (!demanda) {
        return res.status(404).json({ mensagem: "Demanda não encontrada." });
    }
 
    await Conexao.query("UPDATE demanda SET statusDemanda = ? WHERE id_demanda = ?;",["Cancelada", id]
    );
 
    return res.status(200).json({ id_demanda: id, statusDemanda: "Cancelada" as Status });
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const [demandas] = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda");
    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    //pega dados apartir da requisicao
    const {titulo, tipo, prazo_finalizacao, prioridade, descricao} = req.body; // TODO Implementar status dinamico

    //validacao dos dados
    if(!titulo || !tipo || !prioridade || !descricao){
        return res.status(400).json({
            mensagem: "titulo, tipo, prioridade e descricao são obrigatorios"
        })
    }

    if(tipo !== "Defeito" && tipo !== "Tarefa" && tipo !== "Melhoria" && tipo !== "Documentação" ){
        return res.status(400).json({ mensagem: "Tipo inválido."});
    }
    if(prioridade !== "Baixa"  && prioridade !== "Média"  && prioridade !== "Alta" && prioridade !== "Crítica"){
        return res.status(400).json({mensagem: "Prioridade inválida."});
    }

    let prazo: Date | null;

    //se tiver um prazo de finalização (em string) converte para Date
    if (prazo_finalizacao) {
        prazo = new Date(prazo_finalizacao);
    } 
    // se n tiver deixa null
    else {
        prazo = null;
    }

    demanda.titulo = titulo;
    demanda.tipo = tipo;
    demanda.data_ultima_alteracao = new Date();
    demanda.prioridade = prioridade;
    demanda.prazo_finalizacao = prazo;
    demanda.descricao = descricao;

    return res.status(200).json(demanda);
});

router.delete("/", (req: Request, res: Response) => {

});

export default router;