var person_parada;
var person_direita;
var person_esquerda;
var person_cima;
var person_baixo;
var person_direita_baixo;
var person_direita_cima;
var person_esquerda_baixo;
var person_esquerda_cima;
var person_atual;
var person_raio = 50;
var person_velBase = 3;
var person_velX = 0;
var person_velY = 0;
var person_posX = LARGURA_TELA * (7.0/8.0) - person_raio;
var person_posY = ALTURA_TELA / 2 - person_raio;
var person_centroX = person_posX + person_raio;
var person_centroY = person_posY + person_raio;

function carregarSpritesPerson(sprite){
	cortarImagem(100,0,100,100,sprite).then((valor) => {person_cima = valor;});
	cortarImagem(0,100,100,100,sprite).then((valor) => {person_baixo = valor;});
	cortarImagem(200,100,100,100,sprite).then((valor) => {person_esquerda = valor;});
	cortarImagem(300,0,100,100,sprite).then((valor) => {person_direita = valor;});
	cortarImagem(300,100,100,100,sprite).then((valor) => {person_parada = valor;});
	cortarImagem(100,100,100,100,sprite).then((valor) => {person_esquerda_baixo = valor;});
	cortarImagem(0,0,100,100,sprite).then((valor) => {person_esquerda_cima = valor;});
	cortarImagem(400,0,100,100,sprite).then((valor) => {person_direita_baixo = valor;});
	cortarImagem(200,0,100,100,sprite).then((valor) => {person_direita_cima = valor;});
}

function handlerEventsPerson(k_cima, k_baixo, k_esquerda, k_direita) {
	person_velX = 0;
    person_velY = 0;
    person_atual = person_parada;
    if (k_cima == true) {
        person_atual = person_cima;
        person_velY = -person_velBase;
        if (k_direita == true) {
            person_atual = person_direita_cima;
            person_velX = person_velBase;
        }
        if (k_esquerda == true) {
            person_atual = person_esquerda_cima;
            person_velX = -person_velBase;
        }
    } else if (k_baixo == true) {
        person_atual = person_baixo;
        person_velY = person_velBase;
        if (k_direita == true) {
            person_atual = person_direita_baixo;
            person_velX = person_velBase;
        }
        if (k_esquerda == true) {
            person_atual = person_esquerda_baixo;
            person_velX = -person_velBase;
        }
    } else if (k_esquerda == true) {
        person_atual = person_esquerda;
        person_velX = -person_velBase;
    } else if (k_direita == true) {
        person_atual = person_direita;
        person_velX = person_velBase;
    }
}

function update_personagem(deltaTime){
	mover_personagem(deltaTime);
	person_centroX = person_posX + person_raio;
	person_centroY = person_posY + person_raio;
}

function mover_personagem(deltaTime){
	person_posX += (person_velX*deltaTime);
	person_posY += (person_velY*deltaTime);
}

function desmover_X_personagem(deltaTime){
	person_posX -= (person_velX*deltaTime);
}

function desmover_Y_personagem(deltaTime){
	person_posY -= (person_velY*deltaTime);
}