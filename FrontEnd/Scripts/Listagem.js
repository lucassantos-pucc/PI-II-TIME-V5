
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

function CreateDemanda(json) {
    const info = JSON.parse('{"nome":"Teste", "tipo":"Defeito", "prioridade":"Baixa", "status":"Em andamento", "projeto":"Exemplo", "responsavel":"Sr. Exemplilson", "DTcriacao":"25/09/2026", "prazo":"30/09/2026"}'); // Lista temporaria
    
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

    
    Dem_Cr.addEventListener("click", function() {ShowDialog(this);});

    document.getElementById("secao-demanda").appendChild(Dem_Cr);
}

function asd(a) {
    console.log(a)
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

    prio = p.textContent.toLowerCase(); // Variável de simplificação da sintaxe
    
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

CreateDemanda("temp");


// Obtém os elementos de prioridade com base na classe geral de prioridade
const ElementosPrioridade = document.getElementsByClassName("prioridade-gen");
    
// Itera por todos as prioridades
for (i in ElementosPrioridade) {
    PriorityColor(ElementosPrioridade[i]);
}
