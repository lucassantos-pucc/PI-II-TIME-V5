/*
    Feito por: Lucas de Oliveira Santos
    RA: 26887166
    Modificado por: Arthur Cardoso Martin
    RA: 26006506
*/

//importando dados testes

import { Request, Response, Router } from "express";
import { ProjetoRow } from "../dados/dados";
import Conexao from "../dados/database";

const router = Router();

// GET PROJETOS
router.get("/", async (req: Request, res: Response) => {
    //retorna todos os projetos
    const id  = Number(req.query.id);
    const id_projeto  = Number(req.query.id_projeto);
    let [projetos] = await Conexao.query<ProjetoRow[]>(
        "SELECT projeto.id_projeto, projeto.titulo, projeto.id_lider, usuario.nome " +
        "FROM projeto INNER JOIN usuario ON projeto.id_lider = usuario.id_usuario;");

    if (id){
        [projetos] = await Conexao.query<ProjetoRow[]>(
            "SELECT projeto.id_projeto, projeto.titulo, projeto.id_lider, usuario.nome " +
            "FROM projeto INNER JOIN usuario ON projeto.id_lider = usuario.id_usuario " +
            "INNER JOIN usuario_projeto_participa ON projeto.id_projeto = usuario_projeto_participa.id_projeto " +
            "WHERE usuario_projeto_participa.id_usuario = ?;", [id] );
    }

    else if(id_projeto){
        [projetos] = await Conexao.query<ProjetoRow[]>("select * from projeto where id_projeto = ?", [id_projeto]);
    }

    const nome = req.query.nome; 
    const lider = req.query.lider; 
    let [filtro] = [projetos];

    if (nome) { filtro = filtro.filter((i) => i.titulo.includes(nome.toString())); }

    if (lider) { filtro = filtro.filter((i) => i.nome.includes(lider)); };

    return res.status(200).json(filtro);
});

router.post("/", (req: Request, res: Response) => {

});

router.put("/:id", (req: Request, res: Response) => {

});

export default router;