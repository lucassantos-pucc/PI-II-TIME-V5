/*
    Feito por Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
*/

import { Request, Response } from "express";

const express = require("express");
const RouterLogin = express.Router();

// !! TEMPORÁRIO: lista em memória será substituida quado tiver consulta ao banco de dados(a ser implementado)
const usuarios = [
    { id: 1, usuario: "admin@exemplo.com", senha: "Admin_123", tipo: "Administrador" },
    { id: 2, usuario: "lider@exemplo.com", senha: "Lider_123", tipo: "Lider de Projeto" },
    { id: 3, usuario: "membro@exemplo.com", senha: "Membro_123", tipo: "Membro da equipe" },
];

// POST "/login"
RouterLogin.post("/login", (req: Request, res: Response) => {
    const { usuario, senha } = req.body || {};

    // Validação dos campos obrigatórios
    if (!usuario || typeof usuario !== "string" || usuario.trim() === "") {
        return res.status(400).json({ mensagem: "O E-mail é obrigatório." });
    }
    if (!senha || typeof senha !== "string" || senha.trim() === "") {
        return res.status(400).json({ mensagem: "A senha é obrigatória." });
    }

    // Validação das credenciais
    const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario.trim() && u.senha === senha.trim()
    );

    if (!usuarioEncontrado) {
        return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
    }

    // Retorna os dados do usuário, sem expor a senha
    return res.status(200).json({
        id: usuarioEncontrado.id,
        usuario: usuarioEncontrado.usuario,
        tipo: usuarioEncontrado.tipo,
    });
});

// GET "/usuarios"
RouterLogin.get("/usuarios", (req: Request, res: Response) => {
    // Retorna todos os usuários, sem expor a senha
    const lista = usuarios.map((u) => ({
        id: u.id,
        usuario: u.usuario,
        tipo: u.tipo,
    }));

    if (lista.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum usuário encontrado." });
    }


    return res.status(200).json(lista);
});

export default RouterLogin;