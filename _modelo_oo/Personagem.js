var person_parada;
var person_direita;
var person_esquerda;
var person_cima;
var person_baixo;
var person_direita_baixo;
var person_direita_cima;
var person_esquerda_baixo;
var person_esquerda_cima;
var person_atual = person_parada;
var person_raio = 50;
var person_velX = 3;
var person_velY = 3;
var person_posX = 100;
var person_posY = 100;
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