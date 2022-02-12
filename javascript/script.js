let nome = null;
let pessoasOnline = [];
let mensagens = []

let loopConexao = null
let loopMensagens = null

let target = "Todos";
let visibilidade = "message";

// ----------- FUNÇÕES -----------

function entrar(){
    nome = document.querySelector(".input-nome").value;
    
    if(nome){
        const objeto = {name: nome};
        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants",objeto);

        const input = document.querySelector(".input-nome");
        const entrar = document.querySelector("button");
        const loading = document.querySelector(".loading");
        const mensagemErro = document.querySelector(".mensagem-erro");
        if(!mensagemErro.classList.contains("esconder")){
            mensagemErro.classList.add("esconder");
        }
    
        loading.classList.toggle("esconder");
        input.classList.toggle("esconder")
        entrar.classList.toggle("esconder")

        promise.then(entrarSucesso);
        promise.catch(entrarFalhou)
    }
}

function entrarSucesso(){
    buscaMensagens();
    iniciaProcedimento();

    const telaLogin = document.querySelector(".login");
    telaLogin.classList.add("esconder");
}

function entrarFalhou(){
    const mensagemErro = document.querySelector(".mensagem-erro");
    const input = document.querySelector(".input-nome");
    const entrar = document.querySelector("button");
    const loading = document.querySelector(".loading");

    loading.classList.toggle("esconder");
    mensagemErro.classList.toggle("esconder");
    input.classList.toggle("esconder")
    entrar.classList.toggle("esconder")
}

function abreFechaSidebar(){
    const background = document.querySelector(".fundo-escuro");
    const sidebar = document.querySelector(".sidebar");

    background.classList.toggle("esconder");
    sidebar.classList.toggle("esconder");
}

function iniciaProcedimento(){
    loopConexao = setInterval(manterConexao,5000);
    loopMensagens = setInterval(buscaMensagens,3000);
}

function manterConexao(){
    const objeto = {name: nome}
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",objeto);
}

function buscaMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(salvaMensagens);
}

function salvaMensagens(resposta){
    mensagens = [];
    const todasMensagens = [...resposta.data];

    mensagens = todasMensagens.map(converteMensagem);
    mensagens = mensagens.filter(filtrarMensagens)

    adicionaMensagensTela();
}

function converteMensagem(mensagem){
    const mensagemConvertida = {
        from: mensagem.from,
        text: mensagem.text,
        time: mensagem.time,
        to: mensagem.to,
        type: mensagem.type
    };

    return mensagemConvertida;
}

function filtrarMensagens(mensagem){
    if(mensagem.to === "Todos" || mensagem.to === nome || mensagem.from === nome)
        return true;
    else
        return false;
}

function adicionaMensagensTela(){

    const main = document.querySelector("main");
    main.innerHTML = "";

    for(let contador=0; contador<mensagens.length-1; contador++){
        const mensagem = mensagens[contador];
        mostrarMensagem(mensagem,"");
    }
    
    rodarTelaUltimaMensagem();
}

function mostrarMensagem(mensagem,ultima){
    
    let mensagemHTML = null;

    if(mensagem.type === "message"){
        mensagemHTML = `<article class="mensagem-normal ${ultima}">
                            <span class="horario">(${mensagem.time})</span>
                            <strong>${mensagem.from}</strong> para <strong>Todos</strong>: 
                            ${mensagem.text}
                        </article>`
    }
    else if(mensagem.type === "status"){
        mensagemHTML = `<article class="mensagem-status ${ultima}"">
                            <span class="horario">(${mensagem.time})</span>
                            <strong>${mensagem.from}</strong> ${mensagem.text}
                        </article>`
    }
    else {
        mensagemHTML = `<article class="mensagem-reservada ${ultima}"">
                            <span class="horario">(${mensagem.time})</span>
                            <strong>${mensagem.from}</strong> reservadamente para <strong>${mensagem.to}</strong>: 
                            ${mensagem.text}
                        </article>`
    }

    const main = document.querySelector("main");
    main.innerHTML = main.innerHTML + mensagemHTML;
}

function rodarTelaUltimaMensagem(){
    const mensagem = mensagens[mensagens.length-1];
    mostrarMensagem(mensagem,"ultima");

    const ultimaMensagem = document.querySelector(".ultima");
    ultimaMensagem.scrollIntoView();
}

function enviarMensagem(){

    const texto = document.querySelector(".input-message").value;

    if(texto){
        const objeto = {
            from: nome,
            text: texto,
            to: target,
            type: visibilidade
        };

        const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",objeto);
        promise.then(enviarMensagemSucesso);
        promise.catch(enviarMensagemFalhou)
    }
}

function enviarMensagemSucesso(promise){
    buscaMensagens();
    const input = document.querySelector(".input-message");
    input.value = "";
}

function enviarMensagemFalhou(promise){

}