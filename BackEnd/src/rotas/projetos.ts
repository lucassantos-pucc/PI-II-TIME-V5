//Feito por: Lucas de Oliveira Santos
//RA: 26887166


//importando dados testes

import { Request, Response, Router } from "express";
import { projetos } from "../dados/dados";

const router = Router();

// GET PROJETOS
router.get("/", (req: Request, res: Response) => {
    //retorna todos os projetos
    return res.status(200).json(projetos);
});

router.post("/", (req: Request, res: Response) => {

});

router.put("/:id", (req: Request, res: Response) => {

});

export default router;