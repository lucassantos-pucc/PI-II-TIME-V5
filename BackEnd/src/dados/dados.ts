//Feito por: Lucas de Oliveira Santos
//RA: 26887166


// DEFININDO INTERFACE DE DEMANDA E DE PROJETOS
export type Tipo = "Defeito" | "Tarefa" | "Melhoria" | "Documentação" 
export type Status = "Aberta" | "Em andamento" | "Em revisão" | "Concluída" | "Cancelada" 
export type Prioridade = "Baixa"  | "Média"  | "Alta" | "Crítica"  

export interface Demanda{
    id: number,
    titulo: string
    tipo: Tipo
    data_criacao: Date,
    data_ultima_alteracao: Date,
    prazo_finalizacao: Date | null,
    status: Status,
    prioridade: Prioridade,
    id_projeto: number,
    responsavel: string | null,
    descricao: string
}

export interface Projeto{
    id: number,
    titulo: string
}

// DEFININDO DADOS DE TESTE

export let demandas: Demanda[]=[
    {
        id: 1,
        titulo: 'Erro ao processar pagamento via Pix',
        tipo: 'Defeito',
        data_criacao: new Date('2026-10-10T14:00:00Z'),
        data_ultima_alteracao: new Date('2026-10-12T09:30:00Z'),
        prazo_finalizacao: new Date('2026-10-13T18:00:00Z'),
        status: 'Em andamento',
        prioridade: 'Alta',
        id_projeto: 1,
        responsavel: 'josé',
        descricao: 'Os clientes estão relatando que, após escanear o QR Code do Pix, o sistema retorna um erro de timeout e a tela trava. O problema começou após a última atualização do gateway de pagamento.'
    },
    {
        id: 2,
        titulo: 'Implementar Modo Escuro (Dark Mode) no painel',
        tipo: 'Melhoria',
        data_criacao: new Date('2026-10-01T08:00:00Z'),
        data_ultima_alteracao: new Date('2026-10-05T11:00:00Z'),
        prazo_finalizacao: new Date('2026-11-01T23:59:59Z'),
        status: 'Aberta',
        prioridade: 'Baixa',
        id_projeto: 2,
        responsavel: 'matheus',
        descricao: 'Solicitação da equipe de design para melhorar a acessibilidade e o conforto visual dos usuários que utilizam a plataforma durante a noite. Será necessário mapear todas as variáveis de cores existentes.'
    },
    {   
        id: 3,
        titulo: 'Reset de senha de administrador travado',
        tipo: 'Melhoria',
        data_criacao: new Date('2026-10-12T08:15:00Z'),
        data_ultima_alteracao: new Date('2026-10-12T10:00:00Z'),
        prazo_finalizacao: new Date('2026-10-12T18:00:00Z'),
        status: 'Em andamento',
        prioridade: 'Média',
        id_projeto: 3,
        responsavel: 'picolo',
        descricao: 'O usuário master do cliente XPTO errou a senha 3 vezes e bloqueou a conta. O e-mail de recuperação não está chegando na caixa de entrada dele. Solicita o reset manual via banco de dados.'
    },
    {
        id: 4,
        titulo: 'Botão de salvar desalinhado no Safari mobile',
        tipo: 'Defeito',
        data_criacao: new Date('2026-10-11T16:00:00Z'),
        data_ultima_alteracao: new Date('2026-10-11T16:00:00Z'),
        prazo_finalizacao: new Date('2026-10-16T18:00:00Z'),
        status: 'Aberta',
        prioridade: 'Baixa',
        id_projeto: 3,
        responsavel: 'mendeleck',
        descricao: 'No navegador Safari do iPhone, o botão de salvar o formulário de cadastro de demandas fica cortado pela barra de navegação inferior. No Chrome e Android o comportamento está normal.'
    },
]

export let projetos: Projeto[] = [
    {
        id: 1,
        titulo: 'Desenvolvimento do Aplicativo Mobile Corporativo'
    },
    {
        id: 2,
        titulo: 'Migração do Banco de Dados para Nuvem (AWS)'
    },
    {
        id: 3,
        titulo: 'Implementação do Portal de Autoatendimento do Cliente'
    },
    {
        id: 4,
        titulo: 'Modernização da API de Pagamentos Integrados'
    }
]

export interface Comentario {
    id: number;
    demandaId: number;
    autor: string;
    conteudo: string;
    data: Date;
};

export let Comentarios: Comentario[] = [ // !! Lista temporária
    {
        id: 1,
        demandaId: 1,
        autor: "Usario Exemplo 1",
        conteudo: "Comentário de teste 1",
        data: new Date(2026, 10, 11)
    },
    {
        id: 2,
        demandaId: 1,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 3,
        demandaId: 2,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 4,
        demandaId: 2,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    },
    {
        id: 4,
        demandaId: 3,
        autor: "Usario Exemplo 2",
        conteudo: "Comentário de teste 2",
        data: new Date(2026, 10, 12)
    }
];