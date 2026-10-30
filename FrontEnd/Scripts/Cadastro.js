import { CadastrarUsuarioApi } from "./Api.js";

const form = document.querySelector("form");
const campoEmail = document.querySelector("#email");
const campoNome = document.querySelector("#nome");
const campoSenha = document.querySelector("#senha");
const campoConf_senha = document.querySelector("#conf_senha");
const campoTipo = document.querySelector("#Tipo");

const erroEmail = document.querySelector("#erroEmail");
const erroNome = document.querySelector("#erroNome");
const erroSenha = document.querySelector("#erroSenha");
const erroConf_Senha = document.querySelector("#erroConf_Senha");
const erroTipo = document.querySelector("#erroTipo");

const camposComErro = [
    campoEmail,
    campoNome,
    campoSenha,
    campoConf_senha,
    campoTipo
];

const mensagensDeErro = [
    erroEmail,
    erroNome,
    erroSenha,
    erroConf_Senha,
    erroTipo
];

// Função para mostrar erro e mudar estilo do campo
function ErroValidation(campo, elementoErro, mensagem) {
    campo.classList.add("is-invalid");
    elementoErro.innerText = mensagem;
}

// Função para limpar erros de validações anteriores
function limparErros() {
    camposComErro.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });

    mensagensDeErro.forEach(function (elementoErro) {
        elementoErro.innerText = "";
    });
}

form.addEventListener("submit", async function(event) {
    // 1. Evita que a página recarregue ao clicar em enviar
    event.preventDefault();

    // 2. Limpa os erros do envio anterior
    limparErros();

    let Validation = true;

    const email = campoEmail.value.trim();
    const nome = campoNome.value.trim();
    const senha = campoSenha.value.trim();
    const conf_senha = campoConf_senha.value.trim();
    const tipo = campoTipo.value.trim();
    console.log(nome);
    // Validar e-mail
    if (email === "") {
        ErroValidation(campoEmail, erroEmail, "O E-mail é obrigatório.");
        Validation = false;
    } else if (!email.includes("@")) {
        ErroValidation(campoEmail, erroEmail, "O E-mail é inválido.");
        Validation = false;
    }

    // Validar nome
    if (nome === "") {
        ErroValidation(campoNome, erroNome, "O nome é obrigatório.");
        Validation = false;
    } else if (nome.length < 3 ) {
        ErroValidation(campoNome, erroNome, "O nome é curto demais.");
        Validation = false;
    }

    // Validar senha
    const possuiMaiuscula = /[A-Z]/.test(senha);
    const possuiMinuscula = /[a-z]/.test(senha);
    const possuiNumero = /[0-9]/.test(senha);
    const possuiEspecial = /[_@!?]/.test(senha);
    if (senha === "") {
        ErroValidation(campoSenha, erroSenha, "A senha é obrigatória.");
        Validation = false;
    } else if (!possuiEspecial) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter caractere especial (_@!?).");
        Validation = false;
    } else if (!possuiMaiuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter letra maiúscula.");
        Validation = false;
    } else if (!possuiMinuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter letra minúscula.");
        Validation = false;
    } else if (!possuiNumero) {
        ErroValidation(campoSenha, erroSenha, "A senha deve conter número.");
        Validation = false;
    }

    // Confirmar senha
    if (conf_senha === "") {

        ErroValidation(campoConf_senha, erroConf_Senha, "A confirmação de senha é obrigatória.");
        Validation = false;
    } else if (conf_senha !== senha) {
        ErroValidation(campoConf_senha, erroConf_Senha, "As senhas não coincidem.");
        Validation = false;
    }

    if (tipo === "") {
        ErroValidation(campoTipo, erroTipo, "O tipo de usuário é obrigatório.");
        Validation = false;
    }

    // Se houver algum erro, interrompe a execução
    if (!Validation) {
        return;
    }
    const user = {
        nome: campoEmail.value,
        email: campoEmail.value,
        senha: campoSenha.value,
        papel: campoTipo.value
    };
    console.log(await CadastrarUsuarioApi(user));
    open("Login.html", "_self");

});