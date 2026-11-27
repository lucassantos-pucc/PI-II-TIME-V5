/*
Autores:

    Feito por: 
        Lucas de Oliveira Santos - RA: 26887166

    Modificado por:
        Arthur Cardoso Martin - RA: 26006506
*/


//conexao do backend com o banco

// Configuração da conexão do Backend com o banco de dados

import mysql from "mysql2/promise"; // Importa a biblioteca mysql2, que permite a comunicação com o banco de dados utilizando Promises, possibilitando o uso de async e await
import dotenv from "dotenv"; // Importa a biblioteca dotenv, que permite carregar as configurações armazenadas no arquivo .env

// Carrega as informações do arquivo .env para serem utilizadas no código
dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const senha = process.env.DB_PASSWORD;
const banco = process.env.DB_NAME;
const porta = Number(process.env.DB_PORT) || 3306;

// Verifica se as configurações essenciais do arquivo .env foram preenchidas
if (!host || !user || !senha || !banco) {
    console.log("Faltam configurações no arquivo .env");
    console.log(host, user, senha, banco);
    throw new Error("Faltam configurações no arquivo .env");
}

// Cria um pool de conexões com o banco de dados, permitindo que as conexões sejam reutilizadas e gerenciadas conforme a necessidade do Backend
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
        conexaoTeste.release(); // Devolve a conexão individual ao pool para que ela possa ser reutilizada
    } catch (erro) {
        console.error("Erro ao conectar ao banco de dados:", erro);
    }
}

async function ReiniciarBanco(){
    // Função para deletar e recriar o banco e fazer os inserts iniciais
    try {
        let resposta = await conexao.query("Drop table if exists historico, comentario, demanda, usuario_projeto_participa, projeto, usuario;");
        console.log(resposta)
        resposta = await conexao.query("create table usuario(id_usuario int primary key auto_increment,nome varchar(150) not null,email varchar(50) not null unique,senha varchar(50) not null,papel varchar(50) not null check (papel in ('Administrador', 'Lider de Projeto', 'Membro da equipe')));");
        console.log(resposta)
        resposta = await conexao.query("create table projeto(id_projeto int primary key auto_increment,titulo varchar(150) not null,id_lider int,constraint fk_id_Lider foreign key (id_lider) references usuario(id_usuario) ON DELETE CASCADE);");
        console.log(resposta)
        resposta = await conexao.query("create table usuario_projeto_participa(id_usuario int not null,constraint fk_id_usuario foreign key (id_usuario) references usuario(id_usuario) ON DELETE CASCADE,id_projeto int not null,constraint fk_id_projeto foreign key (id_projeto) references projeto(id_projeto) ON DELETE CASCADE,constraint pk_usuario_projeto primary key (id_usuario, id_projeto));");
        console.log(resposta)
        resposta = await conexao.query("create table demanda(id_demanda int primary key auto_increment,titulo varchar(150) not null,tipo varchar(50) not null check (tipo in ('Defeito', 'Tarefa', 'Melhoria', 'Documentação')),dataCriacao datetime not null default current_timestamp(),prazoFinalizacao date,statusDemanda varchar(50) not null check (statusDemanda in ('Aberta', 'Em andamento', 'Em revisão', 'Concluída', 'cancelada')), prioridade varchar(50) not null check (prioridade in ('Baixa', 'Média', 'Alta', 'Crítica')),dataAlteracao datetime not null default current_timestamp() on update current_timestamp(),descricao text,id_responsavel int,constraint fk_id_usuario_demanda foreign key (id_responsavel) references usuario(id_usuario) ON DELETE SET NULL,id_projeto int not null,constraint fk_id_projeto_demanda foreign key (id_projeto) references projeto(id_projeto) ON DELETE CASCADE);");
        console.log(resposta)
        resposta = await conexao.query("create table historico(id_historico int primary key auto_increment,dataHora datetime not null default current_timestamp(),descricao text,id_autor int not null,constraint fk_id_usuario_historico foreign key (id_autor) references usuario(id_usuario) ON DELETE CASCADE,id_demanda int not null,constraint fk_id_demanda foreign key (id_demanda) references demanda(id_demanda) ON DELETE CASCADE);");
        console.log(resposta)
        resposta = await conexao.query("create table comentario(id_comentario int primary key auto_increment,dataHora datetime not null default current_timestamp(),conteudo text,id_demanda int,id_autor int,constraint fk_id_demanda_comentario foreign key (id_demanda) references demanda(id_demanda) ON DELETE CASCADE,constraint fk_id_usuario_comentario foreign key (id_autor) references usuario(id_usuario) ON DELETE CASCADE);");
        console.log(resposta)
        resposta = await conexao.query("insert into usuario (nome, email, senha, papel) values('Lucas Silva', 'lucas@gmail.com', 'Senha_123', 'Administrador'),('Mariana Santos', 'mariana@gmail.com', 'Senha_456', 'Lider de Projeto'),('Pedro Costa', 'pedro@gmail.com', 'Senha_789', 'Lider de Projeto'),('Ana Silva', 'ana@gmail.com', 'Senha_321', 'Membro da equipe'),('João Souza', 'joao@gmail.com', 'Senha_654', 'Membro da equipe');");
        console.log(resposta)
        resposta = await conexao.query("insert into projeto (titulo, id_lider) values('Sistema de gerenciamento de tarefas', 2),('Sistema de controle financeiro',2),('Plataforma de estudos',3);");
        console.log(resposta)
        resposta = await conexao.query("insert into usuario_projeto_participa(id_usuario, id_projeto) values(2, 1),(2, 2),(3, 3),(4, 1),(4, 2),(5, 2),(5, 3);");
        console.log(resposta)
        resposta = await conexao.query("insert into demanda(descricao, titulo, tipo, prazoFinalizacao,statusDemanda, prioridade,  id_responsavel, id_projeto)values('Criar a tela de login do sistema', 'Tela de login','Tarefa', '2027-11-05','Em andamento', 'Alta', 2, 1),('Corrigir erros na validacao dos formularios', 'Validacao de formularios','Defeito', '2027-11-08','Aberta', 'Média', 3, 2),('Desenvolver a pagina inicial', 'Pagina inicial','Tarefa', '2027-11-10','Em revisão', 'Alta', 4, 1),('Desenvolver a pagina de login', 'Pagina de login','Tarefa', '2027-11-30','Aberta', 'Crítica', 4, 2),('Adicionar relatorio mensal', 'Relatorio mensal','Melhoria', '2027-11-15','Aberta', 'Baixa', 5, 2),('Documentar as funcionalidades', 'Documentacao do sistema','Documentação', '2027-11-20','Em andamento', 'Média', 5, 3),('Documentar as Regras de negócio', 'Documentacao','Documentação', '2027-12-20','Concluída', 'Média', 5, 3);");
        console.log(resposta)
        resposta = await conexao.query("insert into historico (descricao, id_autor, id_demanda) values('Demanda criada', 1, 1),('Demanda criada', 1, 2),('Demanda criada', 1, 3),('Demanda criada', 1, 4),('Demanda criada', 1, 5),('Demanda criada', 1, 6),('Demanda criada', 1, 7)    ;");
        console.log(resposta)
        resposta = await conexao.query("insert into comentario (conteudo, id_demanda, id_autor) values( 'Ja comecei a desenvolver a tela de login', 1, 1),('Encontrei um erro na validacao do formulario', 2, 3),('A pagina inicial esta quase pronta', 3, 2),('Vou iniciar o desenvolvimento do relatorio', 4, 4),('A documentacao foi finalizada', 5, 5),('Podemos revisar essa demanda juntos', 1, 2);");
        console.log(resposta)
    }catch(erro){
        console.error("Erro ao conectar ao banco de dados:", erro);

    }
}

// Variaveis para testar a conexão e reiniciar o banco de dados
const TestarConexao = false;
const Reiniciar = true;

if (TestarConexao) {
    testarConexao();
}
if (Reiniciar) {
    ReiniciarBanco();
}

export default conexao;