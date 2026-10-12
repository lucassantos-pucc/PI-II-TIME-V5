/*
    Feito por Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
*/

import { Request, Response } from "express";
import {Usuarios, Usuario, TipoUsuario} from "../dados/dados";
const express = require("express");
const router = express.Router();

const semSenha = (usuario: Usuario) => ({
  id: usuario.id,
  usuario: usuario.usuario,
  tipo: usuario.tipo,
});

// POST "/login"
/* Exemplo
{
  "usuario": "admin@exemplo.com",
  "senha": "Admin_123"
}
  */
router.post("/login", (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  if (!usuario || typeof usuario !== "string" || usuario.trim() === "") {
    return res.status(400).json({ mensagem: "O e-mail é obrigatório." });
  }

  if (!senha || typeof senha !== "string" || senha.trim() === "") {
    return res.status(400).json({ mensagem: "A senha é obrigatória." });
  }

  const usuarioEncontrado = Usuarios.find(
    (u) =>
      u.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
      u.senha === senha.trim()
  );

  if (!usuarioEncontrado) {
    return res.status(401).json({ mensagem: "Usuário ou senha inválidos." });
  }

  return res.status(200).json({ usuario: usuarioEncontrado, mensagem: "Login bem-sucedido." });
});

// GET /usuarios
router.get("/", (req: Request, res: Response) => {
  const lista = Usuarios;

  if (lista.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum usuário encontrado." });
  }

  return res.status(200).json({ usuarios: lista, mensagem: "Usuários encontrados." });
});

// POST /usuarios
/*
{
  "usuario": "admin@exemplo.com",
  "senha": "Admin_123",
  "tipo": "Administrador"
}
  */
router.post("/", (req: Request, res: Response) => {
  const { usuario, senha, tipo } = req.body || {};

  if (!usuario || typeof usuario !== "string" || usuario.trim() === "") {
    return res.status(400).json({ mensagem: "O e-mail é obrigatório." });
  }

  if (!senha || typeof senha !== "string" || senha.trim() === "") {
    return res.status(400).json({ mensagem: "A senha é obrigatória." });
  }

  if (!tipo || typeof tipo !== "string" || tipo.trim() === "") {
    return res.status(400).json({ mensagem: "O tipo é obrigatório." });
  }

  const tiposValidos: TipoUsuario[] = ["Administrador", "Lider de Projeto", "Membro da equipe"];
  const tipoNormalizado = tipo.trim() as TipoUsuario;

  if (!tiposValidos.includes(tipoNormalizado)) {
    return res.status(400).json({ mensagem: "Tipo de usuário inválido." });
  }

  const usuarioJaExiste = Usuarios.some(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
  );

  if (usuarioJaExiste) {
    return res.status(400).json({ mensagem: "Usuário já cadastrado." });
  }

  const novoUsuario: Usuario = {
    id: Usuarios.length + 1,
    usuario: usuario.trim(),
    senha: senha.trim(),
    tipo: tipoNormalizado,
  };

  Usuarios.push(novoUsuario);

  return res.status(201).json({ usuario: semSenha(novoUsuario), mensagem: "Usuário cadastrado com sucesso." });
});

export default router;