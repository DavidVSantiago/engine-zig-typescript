var bolinha_atual;
var bolinha_raio = 15;
var bolinha_velBase = 5;
var bolinha_velX = bolinha_velBase/2;
var bolinha_velY = bolinha_velBase/2;
var bolinha_posX = (LARGURA_TELA / 2) - bolinha_raio;
var bolinha_posY = (ALTURA_TELA / 2) - bolinha_raio;
var bolinha_centroX = bolinha_posX + bolinha_raio;
var bolinha_centroY = bolinha_posY + bolinha_raio;

function carregarSpritesBolinha(sprite){
	cortarImagem(400,100,30,30,sprite).then((valor) => {bolinha_atual = valor;});
}

function update_bolinha(deltaTime){
	mover_bolinha(deltaTime);
	bolinha_centroX = bolinha_posX + bolinha_raio;
	bolinha_centroY = bolinha_posY + bolinha_raio;
}

function mover_bolinha(deltaTime){
	bolinha_posX += (bolinha_velX*deltaTime);
	bolinha_posY += (bolinha_velY*deltaTime);
}

function desmover_X_bolinha(deltaTime){
	bolinha_posX -= (bolinha_velX*deltaTime);
}

function desmover_Y_bolinha(deltaTime){
	bolinha_posY -= (bolinha_velY*deltaTime);
}