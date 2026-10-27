create database pi2;
use pi2;

-- ****************************************************
-- criação de tabelas 
-- ****************************************************

create table usuario(
	id_usuario int primary key auto_increment,
	nome varchar(150) not null,
    email varchar(50) not null unique,
    senha varchar(50) not null
);

create table administrador(
	id_administrador int primary key,
    constraint fk_id_administrador foreign key (id_administrador) references usuario(id_usuario)
);

create table projeto(
	id_projeto int primary key auto_increment,
    titulo varchar(150) not null
);

create table usuario_projeto_participa(
	papel varchar(50) not null,
    
    id_usuario int not null,
    constraint fk_id_usuario foreign key (id_usuario) references usuario(id_usuario),
    
    id_projeto int not null,
    constraint fk_id_projeto foreign key (id_projeto) references projeto(id_projeto),
    
    constraint pk_usuario_projeto primary key (id_usuario, id_projeto)
);

create table demanda(
    id_demanda int primary key auto_increment,
    descricao text,
    titulo varchar(150) not null,
    tipo varchar(50) not null,
    dataCriacao datetime not null,
    prazofinalizacao datetime not null,
    statusDemanda varchar(50) not null,
    prioridade varchar(50) not null,
    data_alteracao datetime not null,
    
	id_usuario int not null,
    constraint fk_id_usuario_demanda foreign key (id_usuario) references usuario(id_usuario),
    
    id_projeto int not null,
    constraint fk_id_projeto_demanda foreign key (id_projeto) references projeto(id_projeto)
    
);

create table historico(
	id_historico int primary key auto_increment,
    data_hora datetime not null,
    descricao text,

    id_usuario int not null,
	constraint fk_id_usuario_historico foreign key (id_usuario) references usuario(id_usuario),
    
	id_demanda int not null,
    constraint fk_id_demanda foreign key (id_demanda) references demanda(id_demanda)
);

create table comentario(
	id_comentarios int primary key auto_increment,
    dataHora datetime not null,
    conteudo text,
    id_demanda int,
    constraint fk_id_demanda_comentario foreign key (id_demanda) references demanda(id_demanda),
    id_usuario int,
    constraint fk_id_usuario_comentario foreign key (id_usuario) references usuario(id_usuario)
);

-- ****************************************************
-- inserindo usuarios
-- ****************************************************

insert into usuario (nome, email, senha) values
('lucas silva', 'lucas@gmail.com', 'senha123'),
('mariana santos', 'mariana@gmail.com', 'senha456'),
('pedro costa', 'pedro@gmail.com', 'senha789'),
('ana silva', 'ana@gmail.com', 'senha321'),
('joao souza', 'joao@gmail.com', 'senha654');

-- ****************************************************
-- inserindo administradores
-- ****************************************************

insert into administrador (id_administrador) values
(1),
(2);

-- ****************************************************
-- inserindo projetos
-- ****************************************************

insert into projeto (titulo) values
('sistema de gerenciamento de tarefas'),
('sistema de controle financeiro'),
('plataforma de estudos');

-- ****************************************************
-- inserindo participacoes dos usuarios nos projetos
-- ****************************************************

insert into usuario_projeto_participa
(papel, id_usuario, id_projeto) values
('lider', 5, 1),
('membro', 2, 1),
('membro', 3, 1),
('lider', 4, 2),
('membro', 5, 2),
('lider', 3, 3),
('membro', 5, 3);

-- ****************************************************
-- inserindo demandas
-- ****************************************************

insert into demanda
(descricao, titulo, tipo, dataCriacao, prazofinalizacao,
 statusDemanda, prioridade, data_alteracao, id_usuario, id_projeto)
values
('criar a tela de login do sistema', 'tela de login',
 'tarefa', '2026-10-20 08:00:00', '2026-11-05 18:00:00',
 'em andamento', 'alta', '2026-10-22 10:00:00', 1, 1),

('corrigir erros na validacao dos formularios', 'validacao de formularios',
 'defeito', '2026-10-21 09:30:00', '2026-11-08 18:00:00',
 'aberta', 'media', '2026-10-21 09:30:00', 2, 1),

('desenvolver a pagina inicial', 'pagina inicial',
 'tarefa', '2026-10-22 10:00:00', '2026-11-10 18:00:00',
 'em revisao', 'alta', '2026-10-24 14:00:00', 3, 1),

('adicionar relatorio mensal', 'relatorio mensal',
 'melhoria', '2026-10-23 11:00:00', '2026-11-15 18:00:00',
 'aberta', 'baixa', '2026-10-23 11:00:00', 4, 2),

('documentar as funcionalidades', 'documentacao do sistema',
 'documentacao', '2026-10-24 13:00:00', '2026-11-20 18:00:00',
 'concluida', 'media', '2026-10-25 16:00:00', 5, 3);

-- ****************************************************
-- inserindo historicos
-- ****************************************************

insert into historico (data_hora, descricao, id_usuario, id_demanda) values
('2026-10-20 08:00:00', 'demanda criada', 1, 1),
('2026-10-21 09:30:00', 'demanda criada', 2, 2),
('2026-10-22 14:00:00', 'status alterado para em revisao', 3, 3),
('2026-10-23 11:00:00', 'demanda criada', 4, 4),
('2026-10-25 16:00:00', 'demanda marcada como concluida', 5, 5),
('2026-10-26 10:00:00', 'prioridade da demanda alterada', 1, 1);

-- ****************************************************
-- inserindo comentarios
-- ****************************************************

insert into comentario (dataHora, conteudo, id_demanda, id_usuario) values
('2026-10-21 10:00:00', 'ja comecei a desenvolver a tela de login', 1, 1),
('2026-10-22 11:30:00', 'encontrei um erro na validacao do formulario', 2, 3),
('2026-10-23 15:00:00', 'a pagina inicial esta quase pronta', 3, 2),
('2026-10-24 09:00:00', 'vou iniciar o desenvolvimento do relatorio', 4, 4),
('2026-10-25 17:00:00', 'a documentacao foi finalizada', 5, 5),
('2026-10-26 10:30:00', 'podemos revisar essa demanda juntos', 1, 2);

-- ****************************************************
-- selects das tabelas
-- ****************************************************
-- todos os usuarios
select * from usuario;

-- todos os adms
select * from administrador;

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
select id_usuario, nome, email, senha from usuario where id_usuario in (select id_administrador from administrador);

-- select de qual usuario esta em que projeto e qual o seu papel-- usuarios, projetos e seus papeis
select usuario.nome, projeto.titulo, usuario_projeto_participa.papel
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
select historico.data_hora, historico.descricao, usuario.nome
from historico, usuario
where historico.id_usuario = usuario.id_usuario
and historico.id_demanda = 1;


-- comentarios da demanda com nome do usuario
select comentario.dataHora, comentario.conteudo, usuario.nome
from comentario, usuario
where comentario.id_usuario = usuario.id_usuario
and comentario.id_demanda = 1;

-- historico geral do projeto com demanda e usuario
select historico.data_hora, historico.descricao,
       demanda.titulo, usuario.nome
from historico, demanda, usuario
where historico.id_demanda = demanda.id_demanda
and historico.id_usuario = usuario.id_usuario
and demanda.id_projeto = 1;



