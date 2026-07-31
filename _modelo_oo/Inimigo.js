var inimigo_parada;
var inimigo_direita;
var inimigo_esquerda;
var inimigo_cima;
var inimigo_baixo;
var inimigo_direita_baixo;
var inimigo_direita_cima;
var inimigo_esquerda_baixo;
var inimigo_esquerda_cima;
var inimigo_atual;
var inimigo_raio = 50;
var inimigo_velBase = 3;
var inimigo_velX = 0;
var inimigo_velY = 0;
var inimigo_posX = LARGURA_TELA * ( 1.0 / 8.0 ) - inimigo_raio;
var inimigo_posY = (ALTURA_TELA / 2) - inimigo_raio;
var inimigo_centroX = inimigo_posX + inimigo_raio;
var inimigo_centroY = inimigo_posY + inimigo_raio;
var acumuladorTempoVertical = 0;
var acumuladorTempoHorizontal = 0;

function carregarSpritesInimigo(sprite){
	cortarImagem(100,0,100,100,sprite).then((valor) => {inimigo_cima = valor;});
	cortarImagem(0,100,100,100,sprite).then((valor) => {inimigo_baixo = valor;});
	cortarImagem(200,100,100,100,sprite).then((valor) => {inimigo_esquerda = valor;});
	cortarImagem(300,0,100,100,sprite).then((valor) => {inimigo_direita = valor;});
	cortarImagem(300,100,100,100,sprite).then((valor) => {inimigo_parada = valor;});
	cortarImagem(100,100,100,100,sprite).then((valor) => {inimigo_esquerda_baixo = valor;});
	cortarImagem(0,0,100,100,sprite).then((valor) => {inimigo_esquerda_cima = valor;});
	cortarImagem(400,0,100,100,sprite).then((valor) => {inimigo_direita_baixo = valor;});
	cortarImagem(200,0,100,100,sprite).then((valor) => {inimigo_direita_cima = valor;});
}

function handlerEventsInimigo() {
	testeColisoesInimigo();
	acumuladorTempoVertical += Math.floor(tempoAtual-tempoAnterior);
	acumuladorTempoHorizontal += Math.floor(tempoAtual-tempoAnterior);
	if(acumuladorTempoVertical >= gerarAleatorio(80,120)){
		acumuladorTempoVertical = 0;
		movimentoVerticalInimigo();
	}

	if(acumuladorTempoHorizontal >= gerarAleatorio(400,600)){
		acumuladorTempoHorizontal = 0;
		movimentoHorizontalInimigo();
	}
	mudarSprite();
}

function testeColisoesInimigo(){
	if(inimigo_colideBaixo() == true){
		inimigo_velY = 0;
		inimigo_posY = ALTURA_TELA - (inimigo_raio*2);
	}
	if(inimigo_colideCima() == true){
		inimigo_velY = 0;
		inimigo_posY = 0;
	}
	if(inimigo_colideEsquerda()==true){
		inimigo_velX = 0;
		inimigo_posX = 0;
	}
	if(inimigo_colideDireita()==true){
		inimigo_velX = 0;
		inimigo_posX = LIMITE_ESQUERDO - (inimigo_raio*2);
	}
}

function movimentoVerticalInimigo(){
	inimigo_velY = 0;
	var diferencaY = inimigo_centroY - bolinha_centroY;
	var limite = inimigo_raio * (gerarAleatorio(4,8) / 10);
	if(diferencaY < -limite){ //verifica se a bolinha está abaixo do inimigo
		inimigo_velY = inimigo_velBase;
	}else if(diferencaY > limite){ // verifica se a bolinha está acima do inimigo
		inimigo_velY = -inimigo_velBase;
	}
}

function movimentoHorizontalInimigo(){
	inimigo_velX = 0;
	var distanciaBolinhaX = Math.abs(inimigo_centroX - bolinha_centroX);
	var distanciaBolinhaY = Math.abs(inimigo_centroY - bolinha_centroY);
	var aceleracao = distanciaBolinhaY/120;
	if(distanciaBolinhaX > 211){
		inimigo_velX = inimigo_velBase*aceleracao;
	}else{
		inimigo_velX = -inimigo_velBase*aceleracao;
	}
}

function inimigo_colideCima(){
	// retorna VERDADEIRO se o inimigo colide com a parte superior
	// caso contrário, retorna FALSO
	return inimigo_posY <= 0;
}

function inimigo_colideBaixo(){
	// retorna VERDADEIRO se o inimigo colide com a parte inferior
	// caso contrário, retorna FALSO
	return inimigo_posY + (inimigo_raio*2) >= ALTURA_TELA;
}

function inimigo_colideDireita(){
	// retorna VERDADEIRO se o inimigo colide com a parte direita
	// caso contrário, retorna FALSO
	return inimigo_posX + (inimigo_raio*2) >= LIMITE_ESQUERDO;
}

function inimigo_colideEsquerda(){
	// retorna VERDADEIRO se o inimigo colide com a parte esquerda
	// caso contrário, retorna FALSO
	return inimigo_posX <= 0;
}

function mudarSprite (){
	inimigo_atual = inimigo_parada;
	if(inimigo_velY < 0){
		inimigo_atual = inimigo_cima;
		if(inimigo_velX > 0){
			inimigo_atual = inimigo_direita_cima;
		}
		if(inimigo_velX < 0){
			inimigo_atual = inimigo_esquerda_cima;
		}
	} else if(inimigo_velY > 0){
		inimigo_atual = inimigo_baixo;
		if(inimigo_velX > 0){
			inimigo_atual = inimigo_direita_baixo
		}
		if(inimigo_velX < 0){
			inimigo_atual = inimigo_esquerda_baixo;
		}
	} else if(inimigo_velX < 0){
		inimigo_atual = inimigo_esquerda;
	} else if(inimigo_velX > 0){
		inimigo_atual = inimigo_direita;
	}
}

function update_inimigo(deltaTime){
	mover_inimigo(deltaTime);
	inimigo_centroX = inimigo_posX + inimigo_raio;
	inimigo_centroY = inimigo_posY + inimigo_raio;
}

function mover_inimigo(deltaTime){
	inimigo_posX += (inimigo_velX*deltaTime);
	inimigo_posY += (inimigo_velY*deltaTime);
}

function desmover_X_inimigo(deltaTime){
	inimigo_posX -= (inimigo_velX*deltaTime);
}

function desmover_Y_inimigo(deltaTime){
	inimigo_posY -= (inimigo_velY*deltaTime);
}