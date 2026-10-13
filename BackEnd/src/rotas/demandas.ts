//Feito por: Lucas de Oliveira Santos
//RA: 26887166


//importando dados testes

import { Request, Response, Router } from "express";
import {demandas, projetos, Demanda, Tipo , Prioridade} from "../dados/dados";

const router = Router();
let proximoIdDemanda = 5;

//Listagem de demandas
router.get("/", (req: Request, res: Response) => {
    let filtro = demandas;
    const tipo = req.query.tipo;
    const prioridade = req.query.prioridade;
    const status = req.query.status;
    const projeto = Number(req.query.projeto);
    const responsavel = req.query.responsavel;

    if (tipo) { filtro = filtro.filter((i) => i.tipo === tipo); }

    if (prioridade) { filtro = filtro.filter((i) => i.prioridade === prioridade); }

    if (status) { filtro = filtro.filter((i) => i.status === status); }
    
    if (projeto) { filtro = filtro.filter((i) => i.id_projeto === projeto); }
    
    if (responsavel) { filtro = filtro.filter((i) => i.responsavel === responsavel); }

    if (tipo || prioridade || status || projeto || responsavel) { return res.status(200).json(filtro); }

    return res.status(200).json(demandas);
});

//Listar uma demanda
/*
Teste valido
/1

Teste invalido
/999
*/
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    return res.status(200).json(demanda);
});

//POST DEMANDAS
/*
Teste valido
{
 "nome": "Nova Demanda",
 "tipo": "Tarefa",
 "prazo_finalizacao": "2023-12-31",
 "prioridade": "Alta",
 "id_projeto": 1,
 "responsavel": "João da Silva",
 "descricao": "Descrição detalhada da demanda"
}

Teste invalido
{
 "nome": "Nova Demanda",
 "tipo": "Tarefa",
 "prazo_finalizacao": "2023-12-31",
 "prioridade": "prioridade_invalida",
 "id_projeto": 1,
 "responsavel": "João da Silva",
 "descricao": "Descrição detalhada da demanda"
}
*/

router.post("/", (req:Request, res:Response)=>{
    //pega dados apartir da requisicao
    const {titulo, tipo, prazo_finalizacao, prioridade, id_projeto, responsavel, descricao} = req.body;

    //validacao dos dados
    if(!titulo || !tipo || !prioridade || !id_projeto || !descricao){
        return res.status(400).json({
            mensagem: "titulo, tipo, prioridade, id_projeto, e descricao são obrigatorios"
        })
    }

    if(tipo !== "Defeito" && tipo !== "Tarefa" && tipo !== "Melhoria" && tipo !== "Documentação" ){
        return res.status(400).json({ mensagem: "Tipo inválido."});
    }
    if(prioridade !== "Baixa"  && prioridade !== "Média"  && prioridade !== "Alta" && prioridade !== "Crítica"){
        return res.status(400).json({mensagem: "Prioridade inválida."});
    }

    const projetoExiste = projetos.find((item)=> item.id === id_projeto);

    if(!projetoExiste){
        return res.status(404).json({mensagem: "Projeto Atribuido não encontrado."})
    }

    // Se não houver responsável, deixa null
    const responsavelFinal = responsavel || null;

    let prazo: Date | null;

    //se tiver um prazo de finalização (em string) converte para Date
    if (prazo_finalizacao) {
        prazo = new Date(prazo_finalizacao);
    } 
    // se n tiver deixa null
    else {
        prazo = null;
    }

    //se tudo estiver certo cria uma nova demanda 
    const novaDemanda: Demanda = {
        id: proximoIdDemanda,
        titulo, 
        tipo: tipo as Tipo, // Informa ao TypeScript que o valor de tipo pertence ao conjunto de tipos permitidos.
        data_criacao: new Date(), 
        data_ultima_alteracao: new Date(),
        prazo_finalizacao: prazo, 
        status: "Aberta",
        prioridade: prioridade as Prioridade, // Informa ao TypeScript que a prioridade pertence ao conjunto de prioridades permitidas.
        id_projeto, 
        responsavel: responsavelFinal,
        descricao
    };


    //adiciona nova demanda a lista 
    demandas.push(novaDemanda);

    //incrementa o contador de ids
    proximoIdDemanda++;

    //returna nova demanda
    return res.status(201).json(novaDemanda);

});

export default router;