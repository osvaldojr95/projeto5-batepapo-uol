function abreFechaSidebar(){
    const background = document.querySelector(".fundo-escuro");
    const sidebar = document.querySelector(".sidebar");

    background.classList.toggle("esconder");
    sidebar.classList.toggle("esconder");
}