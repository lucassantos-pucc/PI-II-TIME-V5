import { ListarUsuariosApi } from "./Api.js";

const form = document.querySelector("form");
const campoEmail = document.querySelector("#email");
const campoSenha = document.querySelector("#senha");
const erroEmail = document.querySelector("#erroEmail");
const erroSenha = document.querySelector("#erroSenha");


localStorage.removeItem("UsuarioLogado"); // Remove o usuário logado do localStorage ao carregar a página
const camposComErro = [
    campoEmail,
    campoSenha
];

const mensagensDeErro = [
    erroEmail,
    erroSenha
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
    const senha = campoSenha.value.trim();

    // Validar e-mail
    if (email === "") {
        ErroValidation(campoEmail, erroEmail, "O E-mail é obrigatório.");
        Validation = false;
    } else if (!email.includes("@")) {
        ErroValidation(campoEmail, erroEmail, "O E-mail é inválido.");
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
    } else if (!possuiEspecial || !possuiNumero || !possuiMaiuscula || !possuiMinuscula) {
        ErroValidation(campoSenha, erroSenha, "A senha invalida.");
        Validation = false;
    }

    // Se houver algum erro, interrompe a execução
    if (!Validation) {
        return;
    }

    const login = {
        email: campoEmail.value,
        senha: campoSenha.value
    };
    const usuarios = await ListarUsuariosApi();
    if(usuarios.usuarios.length === 0){
        console.log("Nenhum usuario encontrado");
    }
    let valido = false;
    for (const usuario of usuarios.usuarios){
        console.log(usuario);
        if(usuario.email === login.email && usuario.senha === login.senha){
            valido = true;
            localStorage.setItem("UsuarioLogado", JSON.stringify(usuario));
            console.log("Logando Usuario");
        }
    }
    if(!valido){
        ErroValidation(campoEmail, erroEmail, "Usuário ou senha inválidos.");
        ErroValidation(campoSenha, erroSenha, "Usuário ou senha inválidos.");
    }
    open("Listagem_Projeto.html", "_self");
});