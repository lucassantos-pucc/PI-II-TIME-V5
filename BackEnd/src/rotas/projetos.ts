//Feito por: Lucas de Oliveira Santos
//RA: 26887166


//importando dados testes

import { Request, Response, Router } from "express";
import { projetos, demandas } from "../dados/dados";

const router = Router();

// GET PROJETOS
router.get("/", (req: Request, res: Response) => {
    //retorna todos os projetos
    for (const projeto of projetos) {
        projeto.demandas = 0;
        for (const demanda of demandas) {
            if (demanda.id_projeto === projeto.id) {
                projeto.demandas = Number(projeto.demandas) + 1; // !! Provavelmente essa contagem pode ser só um count no banco de dados
            }
        }
    }
    return res.status(200).json(projetos);
});

router.post("/", (req: Request, res: Response) => {

});

router.put("/:id", (req: Request, res: Response) => {

});

export default router;