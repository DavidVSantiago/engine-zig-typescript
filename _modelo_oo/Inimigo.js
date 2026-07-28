var inimigo_atual;
var inimigo_raio = 50;
var inimigo_velX = 3;
var inimigo_velY = 3;
var inimigo_posX = (LARGURA_TELA / 2) - inimigo_raio;
var inimigo_posY = (ALTURA_TELA / 2) - inimigo_raio;
var inimigo_centroX = inimigo_posX + inimigo_raio;
var inimigo_centroY = inimigo_posY + inimigo_raio;

function carregarSpritesInimigo(sprite){
	cortarImagem(400,100,100,100,sprite).then((valor) => {inimigo_atual = valor;});
}