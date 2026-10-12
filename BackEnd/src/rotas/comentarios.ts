import {Router, Request, Response} from "express";
import {Comentarios, Comentario, demandas} from "../dados/dados";

const router = Router({mergeParams: true});
router.get("", (req: Request, res: Response) => {
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

router.post("", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const demanda = demandas.find((d) => d.id === id);

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

export default router;