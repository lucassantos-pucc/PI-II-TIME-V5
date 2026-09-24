
// Feito por: Vitor Kenzo Pina Takemasa
// RA: 26007167

function CreateDemanda(json) { //Função para criar as demandas na pagina
    const info = JSON.parse('{"nome":"Teste", "tipo":"Defeito", "prioridade":"Baixa"}'); // Lista temporaria
    
    const Dem_Cr = document.createElement('button'); // Demanda Criada

    Dem_Cr.classList.add("demanda-card");

    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode(info.nome));
    Dem_Cr.appendChild(h3);

    Dem_Cr.addEventListener("click", () => ShowDialog(Dem_Cr)); 
    document.getElementById("secao-demanda").appendChild(Dem_Cr);
    // !! Não funciona ainda, testar mais dps
    // * Tudo aquele sofrimento pq tava dando append antes de adicionar o eventListener e adicionando no h3 ao inves do botao
    // * e tinha que colocar com arrow function :)
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


// Obtém os elementos de prioridade com base na classe geral de prioridade
const ElementosPrioridade = document.getElementsByClassName("prioridade-gen");
    
// Itera por todos as prioridades
for (const prioridade of ElementosPrioridade) {
    PriorityColor(prioridade);
}
