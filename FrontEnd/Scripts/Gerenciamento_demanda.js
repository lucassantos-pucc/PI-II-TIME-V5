/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/

//! TEMPORARIO
localStorage.setItem("projetoSelecionado", "Projeto Exemplo");

const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("Responsavel_id");
const descricao = document.getElementById("descricao_id");

dataAtual = new Date().getDate() + "/" + (new Date().getMonth()<10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "/" + new Date().getFullYear();

if (localStorage.getItem("DemandaAtual") && localStorage.getItem("DemandaAtual") !== "{}") { // Pega os valores armazenados no localStorage e coloca nos inputs
    const demandaAtual = JSON.parse(localStorage.getItem("DemandaAtual"));
    titulo.value = demandaAtual.nome;
    prazo.value = demandaAtual.prazo.split('/').reverse().join('-'); // Inverte a data para o formato yyyy-mm-dd
    document.getElementById("prioridade_id").value = demandaAtual.prioridade;
    document.getElementById("status_id").value = demandaAtual.status;
    document.getElementById("tipos_id").value = demandaAtual.tipo;
    responsavel.value = demandaAtual.responsavel;
    descricao.value = demandaAtual.descricao;
}


form.addEventListener("submit", function (event) {
    event.preventDefault();

    const erros = [];
    if (titulo.value.trim().length < 3) {
        erros.push("O título deve ter pelo menos 3 caracteres.");
    }
    else if(titulo.value.trim().length > 30){
        erros.push("O título não deve ter mais de 30 caracteres.")
    }
    if (!prazo.value) {
        erros.push("Informe o prazo da demanda.");
    } else if (new Date(prazo.value) <= new Date()) { //Verifica data futura
        erros.push("O prazo deve ser uma data futura.");
    }

    // TODO: Fazer ele consultar o backend para validar se o responsavel existe
    if (responsavel.value.trim().length < 3) {
        erros.push("Informe um responsável válido.");
    }

    if (descricao.value.trim().length < 5) {
        erros.push("A descrição deve ter pelo menos 5 caracteres.");
    }

    if (erros.length > 0) {
        alert(erros.join("\n")); //juntos os elementos do array seperando por \n
        return;
    }

    alert("Demanda validada com sucesso!");
    const newPrazo = prazo.value.trim().split('-').reverse().join('/'); // Inverte a data para o formato dd/mm/yyyy

    const demanda = { //Preparar a estrutura para json
        DTcriacao: dataAtual,
        nome: titulo.value.trim(),
        prazo: newPrazo,
        prioridade: document.getElementById("prioridade_id").value,
        projeto: localStorage.getItem("projetoSelecionado"),
        responsavel: responsavel.value.trim(),
        status: document.getElementById("status_id").value,
        tipo: document.getElementById("tipos_id").value,
        descricao: descricao.value.trim()
    };

    const demandasSalvas = JSON.parse(localStorage.getItem("demandas") || "[]");
    // Pega as demandas que ja foram salvas para nao perder acidentalmente
    demandasSalvas.push(demanda); // Armazena a nova demanda


    localStorage.setItem("demandas", JSON.stringify(demandasSalvas));// transforma o array em json

    alert("Demanda Salva com sucesso!")
    form.reset();
    localStorage.setItem("DemandaAtual", JSON.stringify({})); // Limpa a demanda atual
    open("Listagem_Demandas.html", "_self");
});