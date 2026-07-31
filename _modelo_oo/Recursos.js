// obtêm informações sobre as dimensões da tela
var canvas = document.getElementById('tela');
var context = canvas.getContext('2d');
var LARGURA_TELA = canvas.width;
var ALTURA_TELA = canvas.height;
var LIMITE_DIREITO = 420;
var LIMITE_ESQUERDO = 215;

// pontuação do jogo
var pontosJogador = 0;
var pontosInimigo = 0;
var maxPontos = 5;
var msgFim = "";
var pauseOpt = 0;

// recursos de audio
var clipMenu;
var clipSet;

function cortarImagem(x, y, largura, altura, sprite) {
	var imagemCortada = createImageBitmap(sprite, x, y, largura, altura);
    return imagemCortada;
};

function carregarSons(){
    // cria os elementos de audio
    clipMenu = document.createElement("audio");
    clipSet = document.createElement("audio");
    // carrega o arquivo de audio
    clipMenu.src = "menu.wav"; 
    clipSet.src = "set.wav"; 
    // define os atributos do audio
    clipMenu.setAttribute("preload", "auto");
    clipSet.setAttribute("preload", "auto");
    clipMenu.setAttribute("controls", "none");
    clipSet.setAttribute("controls", "none");
    clipMenu.style.display = "none";
    clipSet.style.display = "none";
    // adiciona o audio no jogo
    document.body.appendChild(clipMenu);
    document.body.appendChild(clipSet);
}

function gerarAleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}