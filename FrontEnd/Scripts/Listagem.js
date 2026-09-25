
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

function CreateDemanda(json) {
    const info = JSON.parse(json);
    
    const Dem_Cr = document.createElement('button'); // Demanda Criada
    Dem_Cr.classList.add("demanda-card");

    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode(info.nome));
    Dem_Cr.appendChild(h3);

    Dem_Cr.appendChild(document.createElement('hr'));

    const box = document.createElement('div');
    box.classList.add("caixa");

    box.appendChild(DemandaContent("tipo-gen", "Tipo: " + info.tipo));
    box.appendChild(DemandaContent("prioridade-gen", "Prioridade: " + info.prioridade));
    box.appendChild(DemandaContent("status-gen", "Status: " + info.status));
    box.appendChild(DemandaContent("projeto-gen", "Projeto: " + info.projeto));
    box.appendChild(DemandaContent("responsavel-gen", "Responsável: " + info.responsavel));
    box.appendChild(DemandaContent("DTcriacao-gen", "Data de criacao: " + info.DTcriacao));
    box.appendChild(DemandaContent("prazo-gen", "Prazo: " + info.prazo));

    Dem_Cr.appendChild(box);

    
    //Dem_Cr.addEventListener("click", function() {ShowDialog(this);});
    Dem_Cr.addEventListener("click", () => ShowDialog(Dem_Cr)); 

    document.getElementById("secao-demanda").appendChild(Dem_Cr);
}

function DemandaContent(classe, texto) {
    const content = document.createElement('div');
    content.classList.add("gen");
    content.classList.add(classe);

    const p = document.createElement('p');
    p.appendChild(document.createTextNode(texto));

    content.appendChild(p);
    
    return content;
}

function PriorityColor(p) {
    if (!p) { //So coloquei isso para evitar problema de estar vazio
        return;
    }

    const prio = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe
    
    // Aplica as cores de fundo respectivas
    if (prio.includes("baixa")) {
        p.classList.add("prioridade-b-gen");
    }
        
    else if (prio.includes("média")) {
        p.classList.add("prioridade-m-gen");
    }
        
    else if (prio.includes("alta")) {
        p.classList.add("prioridade-a-gen");
    }
        
    else if (prio.includes("crítica")) {
        p.classList.add("prioridade-c-gen");
    }
}

// Cria as demandas dinamicamente na tela a partir de arquivos JSON
const jsondemandas = []; // !! Temporario
jsondemandas[0] = '{"nome":"Teste1", "tipo":"Defeito", "prioridade":"Baixa", "status":"Em andamento", "projeto":"Exemplo", "responsavel":"Sr. Exemplilson", "DTcriacao":"25/09/2026", "prazo":"30/09/2026"}';
jsondemandas[1] = '{"nome":"Teste2", "tipo":"Defeito", "prioridade":"Média", "status":"Em andamento", "projeto":"Exemplo", "responsavel":"Sr. Exemplilson", "DTcriacao":"25/09/2026", "prazo":"30/09/2026"}';
jsondemandas[2] = '{"nome":"Teste3", "tipo":"Defeito", "prioridade":"Alta", "status":"Em andamento", "projeto":"Exemplo", "responsavel":"Sr. Exemplilson", "DTcriacao":"25/09/2026", "prazo":"30/09/2026"}';
jsondemandas[3] = '{"nome":"Teste4", "tipo":"Defeito", "prioridade":"Crítica", "status":"Em andamento", "projeto":"Exemplo", "responsavel":"Sr. Exemplilson", "DTcriacao":"25/09/2026", "prazo":"30/09/2026"}';

for (const demanda of jsondemandas) {
    CreateDemanda(demanda);
}


// Obtém os elementos de prioridade com base na classe geral de prioridade
const ElementosPrioridade = document.getElementsByClassName("prioridade-gen");
    
// Itera por todos as prioridades
for (const prioridade of ElementosPrioridade) {
    PriorityColor(prioridade);
}
