/*
    Feito por: Kauã Gaiofato Santana Lima de Jesus 
    RA: 26000195
    Modificado por: Arthur Cardoso Martin
    RA: 26006506
*/

import { Request, Response } from "express";
import {Usuario, TipoUsuario, UsuarioRow} from "../dados/dados";


import conexao from "../dados/database";
const express = require("express");
const router = express.Router();

const semSenha = (usuario: Omit<Usuario, 'id_usuario'>) => ({
  nome: usuario.nome,
  email: usuario.email,
  papel: usuario.papel
});

// POST "/login"
/* 
Teste valido
{
  "email": "lucas@gmail.com",
  "senha": "Senha_123"
}

Teste invalido
{
  "email": "lucas@gmail.com",
  "senha": "senha_incorreta"
}
*/

router.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ mensagem: "O e-mail é obrigatório." });
  }

  if (!senha || typeof senha !== "string" || senha.trim() === "") {
    return res.status(400).json({ mensagem: "A senha é obrigatória." });
  }
  const [Usuarios] = await conexao.query<UsuarioRow[]>("SELECT * FROM usuario;");
  const usuarioEncontrado = Usuarios.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.senha === senha.trim()
  );

  if (!usuarioEncontrado) {
    return res.status(401).json({ mensagem: "Email ou senha inválidos." });
  }

  return res.status(200).json({ usuario: semSenha(usuarioEncontrado), mensagem: "Login bem-sucedido." });
});

// GET /usuarios
router.get("/", async (req: Request, res: Response) => {
  const [lista] = await conexao.query<UsuarioRow[]>("SELECT * FROM usuario;");

  if (lista.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum usuário encontrado." });
  }

  return res.status(200).json({ usuarios: lista, mensagem: "Usuários encontrados." });
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [lista] = await conexao.query<UsuarioRow[]>("SELECT * FROM usuario where id_usuario = ?;", [id]);

  if (lista.length === 0) {
    return res.status(404).json({ mensagem: "Nenhum usuário encontrado." });
  }

  return res.status(200).json({ usuario: lista[0], mensagem: "Usuário encontrado." });
});

// POST /usuarios
/* 
Teste valido
{
  "nome" : "Administrador 4",
  "email": "admin4@exemplo.com",
  "senha": "Admin_123",
  "papel": "Administrador"
}

Teste invalido
{
  "nome": "Administrador 1",
  "email": "admin1@exemplo.com",
  "senha": "Admin",
  "papel": "Administrador"
}
*/
router.post("/", async (req: Request, res: Response) => {
  const {nome, email, senha, papel } = req.body || {};

  if (!nome || typeof nome !== "string" || nome.trim() === "") {
    return res.status(400).json({ mensagem: "O nome é obrigatório." });
  }

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ mensagem: "O e-mail é obrigatório." });
  }

  if (!senha || typeof senha !== "string" || senha.trim() === "") {
    return res.status(400).json({ mensagem: "A senha é obrigatória." });
  }

  if (!papel || typeof papel !== "string" || papel.trim() === "") {
    return res.status(400).json({ mensagem: "O papel é obrigatório." });
  }

  const papéisValidos: TipoUsuario[] = ["Administrador", "Lider de Projeto", "Membro da equipe"];
  const papelNormalizado = papel.trim() as TipoUsuario;

  if (!papéisValidos.includes(papelNormalizado)) {
    return res.status(400).json({ mensagem: "Papel de usuário inválido." });
  }

  const [Usuarios] = await conexao.query<UsuarioRow[]>("SELECT * FROM usuario;");
  const usuarioJaExiste = Usuarios.some(
    (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() ||
     u.nome.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  if (usuarioJaExiste) {
    return res.status(400).json({ mensagem: "Usuário já cadastrado." });
  }

  const novoUsuario: Omit<Usuario, 'id_usuario'> = {
    nome: nome.trim(),
    email: email.trim(),
    senha: senha.trim(),
    papel: papelNormalizado,
  };

  const [resultado] = await conexao.query(
    "INSERT INTO usuario (nome, email, senha, papel) VALUES (?, ?, ?, ?);",
    [novoUsuario.nome, novoUsuario.email, novoUsuario.senha, novoUsuario.papel]
  );
  console.log(resultado);
  return res.status(201).json({ usuario: semSenha(novoUsuario), mensagem: "Usuário cadastrado com sucesso." });
});

export default router;