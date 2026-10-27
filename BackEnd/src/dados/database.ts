//Feito por: Lucas de Oliveira Santos
//RA: 26887166

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const senha = process.env.DB_PASSWORD;
const banco = process.env.DB_NAME;
const porta = Number(process.env.DB_PORT) || 3306;

// se ao consultar os valores no .env faltar algo mostra o erro
if (!host || !user || !senha || !banco) {
    throw new Error("Faltam configurações no arquivo .env");
}

const conexao = mysql.createPool({
    host: host,
    user: user,
    password: senha,
    database: banco,
    port: porta
});

export default conexao;