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
    const [projetos] = await Conexao.query<ProjetoRow[]>("SELECT * FROM projeto");
    return res.status(200).json(projetos);
});

// GET PROJETO por usuario
router.get("/:id", async (req: Request, res: Response) => {
    const id  = Number(req.params.id);
    const [projetos] = await Conexao.query<ProjetoRow[]>(
        "select Distinct projeto.id_projeto, projeto.titulo, projeto.id_lider " +
        "from usuario, usuario_projeto_participa, projeto " +
        "where ? = usuario_projeto_participa.id_usuario " + 
        "and projeto.id_projeto = usuario_projeto_participa.id_projeto;", [id]
    );
    return res.status(200).json(projetos);
});

router.post("/", (req: Request, res: Response) => {

});

router.put("/:id", (req: Request, res: Response) => {

});

export default router;