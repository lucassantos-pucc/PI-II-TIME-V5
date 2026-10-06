/*
    Feito por: Kauã Gaiofato Santana Lima de Jesus
    RA: 26000195
*/

 
// Carrega o Menu.html e coloca o conteúdo dentro da página atual
async function LoadMenu() {
    // Busca o arquivo Menu.html
    const response = await fetch("Menu.html");
 
    // Transforma a resposta em texto (o código HTML do menu)
    const html = await response.text();
 
    // Insere o HTML do menu no final do <body> da página
    document.body.insertAdjacentHTML("beforeend", html);
 
    // O botão que abre o menu foi inserido no body, mas precisa ficar dentro do header
    // ("body > header" ignora o <header> que existe dentro do popup de detalhes)
    const header = document.querySelector("body > header");
    header.appendChild(document.getElementById("MenuButton"));
 
    // Fecha o menu ao clicar fora dele (no fundo escuro)
    // Quando clica no fundo, o alvo do clique é o próprio <dialog>
    const dialog = document.getElementById("MenuBox");
    dialog.addEventListener("click", function (event) {
        if (event.target === dialog) {
            HideMenu();
        }
    });
 
    // Destaca o botão da página em que o usuário está
    MarkCurrentPage();
}
 
// Abre o menu (chamada pelo botão ☰ através do onclick no Menu.html)
function ShowMenu() {
    const dialog = document.getElementById("MenuBox");
 
    // Remove a classe da animação de saída, caso o menu tenha sido fechado antes
    dialog.classList.remove("closing");
 
    // Abre o dialog em modo modal: escurece o fundo e o Esc fecha o menu
    dialog.showModal();
}
 
// Fecha o menu (chamada pelo botão "Fechar Menu" e pelo clique no fundo)
function HideMenu() {
    const dialog = document.getElementById("MenuBox");
 
    // Ativa a animação de saída (definida no Menu.css)
    dialog.classList.add("closing");
 
    // Espera a animação terminar (400ms) para fechar de verdade
    setTimeout(() => {
        dialog.close();
        dialog.classList.remove("closing");
    }, 400);
}
 
// Marca com a classe "atual" o link que aponta para a página aberta
function MarkCurrentPage() {
    // Pega só o nome do arquivo da URL, ex: ".../HTML/Usuarios.html" vira "usuarios.html"
    const paginaAtual = location.pathname.split("/").pop().toLowerCase();
 
    // Pega todos os links do menu
    const links = document.querySelectorAll(".MenuLinks a");
 
    for (const link of links) {
        // Compara o href do link com o nome da página (tudo em minúsculo, para ignorar maiúsculas)
        if (link.getAttribute("href").toLowerCase() === paginaAtual) {
            link.classList.add("atual"); // O estilo roxo está no Menu.css
        }
    }
}
 
// Só carrega o menu em páginas que têm header (Login e SignUp ficam sem menu)
if (document.querySelector("body > header")) {
    LoadMenu();
}
