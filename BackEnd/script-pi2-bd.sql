create database PI2;
use PI2;

-- ****************************************************
-- criação de tabelas 
-- ****************************************************

create table usuario(
	id_usuario int primary key auto_increment,
	nome varchar(150) not null,
    email varchar(50) not null unique,
    senha varchar(50) not null,
    papel varchar(50) not null check (papel in ('Administrador', 'Lider de Projeto', 'Membro da equipe'))
);

create table projeto(
	id_projeto int primary key auto_increment,
    titulo varchar(150) not null,
    id_lider int,
    constraint fk_id_Lider foreign key (id_lider) references usuario(id_usuario) ON DELETE CASCADE
);

create table usuario_projeto_participa(    
    id_usuario int not null,
    constraint fk_id_usuario foreign key (id_usuario) references usuario(id_usuario) ON DELETE CASCADE,
    
    id_projeto int not null,
    constraint fk_id_projeto foreign key (id_projeto) references projeto(id_projeto) ON DELETE CASCADE,
    
    constraint pk_usuario_projeto primary key (id_usuario, id_projeto)
);

create table demanda(
    id_demanda int primary key auto_increment,
    titulo varchar(150) not null,
    tipo varchar(50) not null check (tipo in ('Defeito', 'Tarefa', 'Melhoria', 'Documentação')),
    dataCriacao datetime not null default current_timestamp(),
    prazoFinalizacao datetime,
    statusDemanda varchar(50) not null check (statusDemanda in ('Aberta', 'Em andamento', 'Em revisão', 'Concluída')),
    prioridade varchar(50) not null,
    dataAlteracao datetime not null default current_timestamp() on update current_timestamp(),
    descricao text,
    
	id_responsavel int,
    constraint fk_id_usuario_demanda foreign key (id_responsavel) references usuario(id_usuario) ON DELETE CASCADE,
    
    id_projeto int not null,
    constraint fk_id_projeto_demanda foreign key (id_projeto) references projeto(id_projeto) ON DELETE CASCADE
    
);

create table historico(
	id_historico int primary key auto_increment,
    dataHora datetime not null default current_timestamp(),
    descricao text,

    id_autor int not null,
	constraint fk_id_usuario_historico foreign key (id_autor) references usuario(id_usuario) ON DELETE CASCADE,
    
	id_demanda int not null,
    constraint fk_id_demanda foreign key (id_demanda) references demanda(id_demanda) ON DELETE CASCADE
);

create table comentario(
	id_comentario int primary key auto_increment,
    dataHora datetime not null default current_timestamp(),
    conteudo text,
    id_demanda int,
    id_autor int,
    constraint fk_id_demanda_comentario foreign key (id_demanda) references demanda(id_demanda) ON DELETE CASCADE,
    constraint fk_id_usuario_comentario foreign key (id_autor) references usuario(id_usuario) ON DELETE CASCADE
);

-- ****************************************************
-- inserindo usuarios
-- ****************************************************

insert into usuario (nome, email, senha, papel) values
('lucas silva', 'lucas@gmail.com', 'Senha_123', 'Administrador'),
('mariana santos', 'mariana@gmail.com', 'Senha_456', 'Lider de Projeto'),
('pedro costa', 'pedro@gmail.com', 'Senha_789', 'Lider de Projeto'),
('ana silva', 'ana@gmail.com', 'Senha_321', 'Membro da equipe'),
('joao souza', 'joao@gmail.com', 'Senha_654', 'Membro da equipe');

-- ****************************************************
-- inserindo projetos
-- ****************************************************

insert into projeto (titulo, id_lider) values
('sistema de gerenciamento de tarefas', 2),
('sistema de controle financeiro',2),
('plataforma de estudos',3);

-- ****************************************************
-- inserindo participacoes dos usuarios nos projetos
-- ****************************************************

insert into usuario_projeto_participa
(id_usuario, id_projeto) values
(1, 1),
(3, 1),
(4, 1),
(2, 2),
(5, 2),
(3, 3),
(5, 3);

-- ****************************************************
-- inserindo demandas
-- ****************************************************

insert into demanda
(descricao, titulo, tipo, prazoFinalizacao,
 statusDemanda, prioridade,  id_responsavel, id_projeto)
values
('criar a tela de login do sistema', 'tela de login',
 'tarefa', '2026-11-05 18:00:00',
 'em andamento', 'alta', 1, 1),

('corrigir erros na validacao dos formularios', 'validacao de formularios',
 'defeito', '2026-11-08 18:00:00',
 'aberta', 'media', 2, 1),

('desenvolver a pagina inicial', 'pagina inicial',
 'tarefa', '2026-11-10 18:00:00',
 'em revisao', 'alta', 3, 1),

('adicionar relatorio mensal', 'relatorio mensal',
 'melhoria', '2026-11-15 18:00:00',
 'aberta', 'baixa', 4, 2),

('documentar as funcionalidades', 'documentacao do sistema',
 'documentacao', '2026-11-20 18:00:00',
 'concluida', 'media', 5, 3),

('documentar as funcionalidades do sistema', 'documentacao',
 'documentacao', '2026-12-20 18:00:00',
 'concluida', 'media', NULL, 3);

-- ****************************************************
-- inserindo historicos
-- ****************************************************

insert into historico (descricao, id_autor, id_demanda) values
('demanda criada', 1, 1),
('demanda criada', 2, 2),
('status alterado para em revisao', 3, 3),
('demanda criada', 4, 4),
('demanda marcada como concluida', 5, 5),
('prioridade da demanda alterada', 1, 1);

-- ****************************************************
-- inserindo comentarios
-- ****************************************************

insert into comentario (conteudo, id_demanda, id_autor) values
( 'ja comecei a desenvolver a tela de login', 1, 1),
('encontrei um erro na validacao do formulario', 2, 3),
('a pagina inicial esta quase pronta', 3, 2),
('vou iniciar o desenvolvimento do relatorio', 4, 4),
('a documentacao foi finalizada', 5, 5),
('podemos revisar essa demanda juntos', 1, 2);

-- ****************************************************
-- selects das tabelas
-- ****************************************************
-- todos os usuarios
select * from usuario;

-- todos os projetos
select * from projeto;

-- todos os usuarios e seus papeis em cada projeto
select * from usuario_projeto_participa;

-- todas as demandas
select * from demanda;

-- todos os historicos
select * from historico;

-- todos os todos os comentarios
select * from comentario;

-- usuarios que sao administradores
select * from usuario where papel = 'Administrador';

-- select de qual usuario esta em que projeto e qual o seu papel-- usuarios, projetos e seus papeis
select usuario.nome, projeto.titulo, usuario.papel
from usuario, usuario_projeto_participa, projeto
where usuario.id_usuario = usuario_projeto_participa.id_usuario
and projeto.id_projeto = usuario_projeto_participa.id_projeto;

-- select demandas especificas de um projeto
select demanda.titulo, demanda.descricao, usuario.nome, projeto.titulo
from demanda, usuario, projeto
where demanda.id_usuario = usuario.id_usuario
and demanda.id_projeto = projeto.id_projeto
and demanda.id_projeto = 1;

-- historico da demanda 1
select * from historico where id_demanda = 1;

-- historico da demanda com nome do usuario
select historico.dataHora, historico.descricao, usuario.nome
from historico, usuario
where historico.id_usuario = usuario.id_usuario
and historico.id_demanda = 1;


-- comentarios da demanda com nome do usuario
select comentario.dataHora, comentario.conteudo, usuario.nome
from comentario, usuario
where comentario.id_usuario = usuario.id_usuario
and comentario.id_demanda = 1;

-- historico geral do projeto com demanda e usuario
select historico.dataHora, historico.descricao,
       demanda.titulo, usuario.nome
from historico, demanda, usuario
where historico.id_demanda = demanda.id_demanda
and historico.id_usuario = usuario.id_usuario
and demanda.id_projeto = 1;



