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
    console.log("Faltam configurações no arquivo .env");
    console.log(host, user, senha, banco);
    throw new Error("Faltam configurações no arquivo .env");
}

const conexao = mysql.createPool({
    host: host,
    user: user,
    password: senha,
    database: banco,
    port: porta
});

async function testarConexao() {
    try {
        const conexaoTeste = await conexao.getConnection();
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
        const [linhas] = await conexao.query("select * from usuario;");
        console.log(linhas);
        console.log("Consulta de teste realizada com sucesso!");
        conexaoTeste.release();
    } catch (erro) {
        console.error("Erro ao conectar ao banco de dados:", erro);
    }
}


const TestarConexao = false;
if (TestarConexao) {
    testarConexao();
}

export default conexao;