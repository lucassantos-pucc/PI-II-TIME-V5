/*
    Feito por Arthur Cardoso Martin
    RA: 26006506
*/
const form = document.querySelector("form");

const titulo = document.getElementById("titulo_id");
const prazo = document.getElementById("prazo_id");
const responsavel = document.getElementById("Responsavel_id");
const descricao = document.getElementById("descricao_id");

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

    const demanda = { //Preparar a estrutura para json
        titulo: titulo.value.trim(),
        tipo: document.getElementById("tipos_id").value,
        prazo: prazo.value,
        status: document.getElementById("status_id").value,
        prioridade: document.getElementById("prioridade_id").value,
        responsavel: responsavel.value.trim(),
        descricao: descricao.value.trim()
    };

    const demandasSalvas = JSON.parse(localStorage.getItem("demandas") || "[]");
    // Pega as demandas que ja foram salvas para nao perder acidentalmente
    demandasSalvas.push(demanda); // Armazena a nova demanda


    localStorage.setItem("demandas", JSON.stringify(demandasSalvas));// transforma o array em json

    alert("Demanda Salva com sucesso!")
    form.reset();
});