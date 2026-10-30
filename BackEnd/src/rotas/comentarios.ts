/*
    Feito por: Arthur Cardoso Martin
    RA: 26006506
*/

import {Router, Request, Response} from "express";
import {ComentarioRow, DemandaRow} from "../dados/dados";
import {ResultSetHeader} from "mysql2";
import Conexao from "../dados/database";

const router = Router({mergeParams: true});


// Select para todas de uma demanda
/*
Teste valido
http://localhost:3000/demandas/2/comentarios

Teste invalido
http://localhost:3000/demandas/999/comentarios
*/
router.get("/", async(req: Request, res: Response) => {
    const id = Number(req.params.id);
    const [comentarios] = await Conexao.query<ComentarioRow[]>("SELECT * FROM comentario where comentario.id_demanda = ?", [id]);

    if (!comentarios) {
        return res.status(404).json({ error: "Comentários não encontrados" });
    }
    return res.status(200).json(comentarios);
});

/*
Teste valido
http://localhost:3000/demandas/2/comentarios
{
    "id_autor": "João",
    "conteudo": "Teste!"
}

Teste invalido
http://localhost:3000/demandas/999/comentarios
{
    "autor": "João",
    "conteudo": ""
}
*/
router.post("/", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = await Conexao.query<DemandaRow[]>("SELECT * FROM demanda where id_demanda = ?", [id]);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const { id_autor, conteudo } = req.body;
    if (!id_autor) {
        return res.status(400).json({ error: "O autor é obrigatório." });
    }

    if (!conteudo || typeof conteudo !== "string" || conteudo.trim() === "") {
        return res.status(400).json({ error: "O conteúdo é obrigatório." });
    }
    const [resultado] = await Conexao.query<ResultSetHeader>("INSERT INTO comentario (id_demanda, id_autor, conteudo) VALUES (?, ?, ?)", [id, id_autor, conteudo]);
    const [comentario] = await Conexao.query<ComentarioRow[]>("SELECT * FROM comentario where id_comentario = ?", [resultado.insertId]);
    return res.status(201).json({ message: "Comentário criado com sucesso!", comentario: comentario[0] });
});

export default router;