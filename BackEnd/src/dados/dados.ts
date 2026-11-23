//Feito por: Lucas de Oliveira Santos
//RA: 26887166

/*
Modificado por; Arthur Cardoso Martin
RA: 26006506
*/

//Importando o pacote RowdataPacket do mysql2
import { RowDataPacket } from "mysql2";

// DEFININDO INTERFACE DE DEMANDA E DE PROJETOS
export type Tipo = "Defeito" | "Tarefa" | "Melhoria" | "Documentação" 
export type Status = "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada" 
export type Prioridade = "Baixa"  | "Média"  | "Alta" | "Crítica"  
export type TipoUsuario = "Administrador"  | "Lider de Projeto"  | "Membro da equipe" 

export interface Usuario {
    id_usuario: number;
    nome: string;
    email: string;
    senha: string;
    papel: TipoUsuario;
}
export interface UsuarioRow extends RowDataPacket, Usuario {}


export interface Projeto{
    id_projeto: number,
    titulo: string
}
export interface ProjetoRow extends RowDataPacket, Projeto {}


export interface Demanda {
    id_demanda: number,
    titulo: string,
    tipo: Tipo,
    dataCriacao: Date,
    prazoFinalizacao: Date | null,
    statusDemanda: Status,
    prioridade: Prioridade,
    dataAlteracao: Date,
    descricao: string,
    id_responsavel: number | null,
    id_projeto: number
}
export interface DemandaRow extends RowDataPacket, Demanda {}


export interface Comentario {
    id_comentario: number;
    dataHora: Date;
    conteudo: string;
    id_demanda: number;
    id_autor: number;
};
export interface ComentarioRow extends RowDataPacket, Comentario {}


export interface Historico extends RowDataPacket {
    id_historico: number;
    dataHora: Date;
    descricao: string;
    id_autor: number;
    id_demanda: number;
}
export interface HistoricoRow extends RowDataPacket, Historico {}