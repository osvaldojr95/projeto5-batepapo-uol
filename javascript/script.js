let nome = "Junior";
let pessoasOnline = [];
let mensagens = []

let loopConexao = null
let loopMensagens = null

buscaMensagens();

// ----------- FUNÇÕES -----------

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
    const todasRespostas = resposta.data;

    for(let contador=0; contador<todasRespostas.length; contador++){

        const mensagem = todasRespostas[contador];
        mensagens.push({
            from: mensagem.from,
            text: mensagem.text,
            time: mensagem.time,
            to: mensagem.to,
            type: mensagem.type
        });
    }

    adicionaMensagensTela();
}

function adicionaMensagensTela(){
    const main = document.querySelector("main");

    for(let contador=0; contador<mensagens.length; contador++){

        const mensagem = mensagens[contador];
        let mensagemHTML = null;

        if(minhaMensagem(mensagem) === true){
            if(mensagem.type === "message"){
                mensagemHTML = `<article class="mensagem-normal">
                                    <span class="horario">(${mensagem.time})</span>
                                    <strong>${mensagem.from}</strong> para <strong>Todos</strong>: 
                                    ${mensagem.text}
                                </article>`
            }
            else if(mensagem.type === "status"){
                mensagemHTML = `<article class="mensagem-status">
                                    <span class="horario">(${mensagem.time})</span>
                                    <strong>${mensagem.from}</strong> ${mensagem.text}
                                </article>`
            }
            else {
                mensagemHTML = `<article class="mensagem-reservada">
                                    <span class="horario">(${mensagem.time})</span>
                                    <strong>${mensagem.from}</strong> reservadamente para <strong>${mensagem.to}</strong>: 
                                    ${mensagem.text}
                                </article>`
            }

            main.innerHTML = main.innerHTML + mensagemHTML;
        }
    }
}

function minhaMensagem(mensagem){
    if(mensagem.to === "Todos" || mensagem.to === nome || mensagem.from === nome)
        return true;
    else
        return false;
}

function enviarMensagem(){
    const objeto = {
        from: "Junior",
        text: "Boa Tarde galera",
        to: "Todos",
        type: "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages",objeto);
    promise.then(objeto);
}

function mostrarTela(teste){
    console.log(teste);
}