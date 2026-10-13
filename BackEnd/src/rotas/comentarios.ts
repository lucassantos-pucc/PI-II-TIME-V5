import {Router, Request, Response} from "express";
import {Comentarios, Comentario, demandas} from "../dados/dados";

const router = Router({mergeParams: true});

/*
Teste valido
http://localhost:3000/demandas/2/comentarios

Teste invalido
http://localhost:3000/demandas/999/comentarios
*/
router.get("/", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const comentarios = Comentarios.filter((c) => c.demandaId === id) || [];
    if (comentarios.length === 0) {
        return res.status(404).json({ error: "Nenhum comentário encontrado para esta demanda" });
    }
    return res.status(200).json(comentarios);
});

/*
Teste valido
http://localhost:3000/demandas/2/comentarios
{
    "autor": "João",
    "conteudo": "Teste!"
}

Teste invalido
http://localhost:3000/demandas/999/comentarios
{
    "autor": "João",
    "conteudo": ""
}
*/
router.post("/", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = demandas.find((d) => d.id === id);

    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    const { autor, conteudo } = req.body;
    if (!autor || typeof autor !== "string" || autor.trim() === "") {
        return res.status(400).json({ error: "O autor é obrigatório." });
    }

    if (!conteudo || typeof conteudo !== "string" || conteudo.trim() === "") {
        return res.status(400).json({ error: "O conteúdo é obrigatório." });
    }
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

export default router;