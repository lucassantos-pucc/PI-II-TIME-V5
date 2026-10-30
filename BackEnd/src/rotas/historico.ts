//Feito por: Lucas de Oliveira Santos
//RA: 26887166

import { Request, Response, Router } from "express";
import {HistoricoRow, UsuarioRow, Historico} from "../dados/dados";
import Conexao from "../dados/database";


const router = Router();




//get historico de uma demanda em especifico

//TESTE VALIDO
// /1


router.get("/:id_demanda", async (req: Request, res: Response) => {
    let id = Number(req.params.id_demanda);
    const [historicos] = await Conexao.query<HistoricoRow[]>("select historico.dataHora, historico.descricao, demanda.titulo, usuario.nome from historico, usuario, demanda where historico.id_autor = usuario.id_usuario and historico.id_demanda = demanda.id_demanda and historico.id_demanda = ? order by dataHora;", [id]);
    return res.status(200).json(historicos);
});

//post de historico

//TESTE VALIDO

/*
{
    "descricao": "Demanda criada para teste",
    "id_autor": 5,
    "id_demanda": 5
}
*/

//TESTES INVALIDO

/*
{
    "descricao": "Demanda criada para teste",
    "id_autor": 5,
    "id_demanda": 9
}

{
    "descricao": "Demanda criada para teste",
    "id_autor": 9,
    "id_demanda": 5
}
    
*/
router.post("/", async (req: Request, res: Response) => {
    const {descricao, id_autor, id_demanda} = req.body;
    
    if(!descricao || !id_autor || !id_demanda){
        return res.status(400).json({
            mensagem: "dataHora, descricao, id_autor, id_demanda são obrigatorios"
        });
    }

    //verificar se autor existe 
    const [autor] = await Conexao.query<UsuarioRow[]>("select * from usuario where id_usuario = ?;",[id_autor]);
    const [demanda] = await Conexao.query<UsuarioRow[]>("select * from demanda where id_demanda = ?;",[id_demanda]);

    //como a consulta retorna um array vazio quando n tem o registro e o javascript considera arrays vazios verdadeiros, usa o .length == 0 para entrar no if 
    if(autor.length == 0){
        return res.status(404).json({mensagem: "Autor Atribuído não encontrado."});
    } 

    //verificar id_demanda

    if(demanda.length == 0){
        return res.status(404).json({mensagem: "Demanda Atribuído não encontrado."});
    }

    //cria historico
    const novoHistorico: Omit<Historico, "id_historico"> = {
        dataHora: new Date(),
        descricao,
        id_autor,
        id_demanda
    };

    const resposta = await Conexao.query("insert into historico (descricao, id_autor, id_demanda) values (?,?,?)", [novoHistorico.descricao, novoHistorico.id_autor, novoHistorico.id_demanda])
    console.log("Resposta do banco de dados:", resposta);
    //returna novo Historico
    return res.status(201).json(novoHistorico);
});

export default router;