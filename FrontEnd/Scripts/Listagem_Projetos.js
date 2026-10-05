
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

function CreateProjeto(json) {
    const info = JSON.parse(json);
    
    const Proj_Cr = document.createElement('button'); // !! Projeto Criado || Não sei se o projeto tem q ser uma div ou botão, deixei como tava no demandas mas podem mudar
    Proj_Cr.classList.add("projeto-card");

    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode(info.nome));
    Proj_Cr.appendChild(h3);

    Proj_Cr.appendChild(document.createElement('hr'));

    const box = document.createElement('div');
    box.classList.add("caixa");

    box.appendChild(ProjetoContent("lider-gen", "Lider: " + info.lider));
    box.appendChild(ProjetoContent("status-gen", "Status: " + info.status));
    box.appendChild(ProjetoContent("demandas-gen", "Total de Demandas: " + info.demandas));
    box.appendChild(ProjetoContent("DTcriacao-gen", "Data de criacao: " + info.DTcriacao));
    box.appendChild(ProjetoContent("descricao-gen", "Descrição: " + info.descricao));

    Proj_Cr.appendChild(box);

    
    //Proj_Cr.addEventListener("click", function() {ShowDialog(this);});
    Proj_Cr.addEventListener("click", () => ShowDialog(Proj_Cr)); 

    document.getElementById("secao-projeto").appendChild(Proj_Cr);
}

function ProjetoContent(classe, texto) {
    const content = document.createElement('div');
    content.classList.add("gen");
    content.classList.add(classe);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(texto));

    content.appendChild(p);
    
    return content;
}

function StatusColor(p) { // !! Função um tanto redundante por existir em dois arquivos, alg tenta importar isso de listagem demandas dps
    if (!p) { //So coloquei isso para evitar problema de estar vazio
        return;
    }

    const stat = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe
    
    // Aplica as cores de fundo respectivas
    if (stat.includes("ativo")) {
        p.classList.add("status-ativo");
    }
        
    else if (stat.includes("andamento")) {
        p.classList.add("status-andamento");
    }
        
    else if (stat.includes("concluido")) {
        p.classList.add("status-concluido");
    }
        
    else if (stat.includes("cancelado")) {
        p.classList.add("status-cancelado");
    }
}

// Cria os projetos dinamicamente na tela a partir de arquivos JSON
const jsonprojetos = []; // !! Temporario
jsonprojetos[0] = '{"nome":"Teste1", "lider":"Sr.Exemplilson", "status":"Ativo", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 1"}';
jsonprojetos[1] = '{"nome":"Teste2", "lider":"Sr.Exemplilson", "status":"Em andamento", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 2"}';
jsonprojetos[2] = '{"nome":"Teste3", "lider":"Sr.Exemplilson", "status":"Concluido", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 3"}';
jsonprojetos[3] = '{"nome":"Teste4", "lider":"Sr.Exemplilson", "status":"Cancelado", "demandas":"3", "DTcriacao":"25/09/2026", "descricao":"Exemplo 4"}';

for (const projeto of jsonprojetos) {
    CreateProjeto(projeto);
}

// Obtém os elementos de status com base na classe geral de status
const ElementosStatus = document.getElementsByClassName("status-gen");
    
// Itera por todos os status
for (const status of ElementosStatus) {
    StatusColor(status);
}