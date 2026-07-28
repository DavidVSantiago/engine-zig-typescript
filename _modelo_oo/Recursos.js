// obtêm informações sobre as dimensões da tela
var canvas = document.getElementById('tela');
var context = canvas.getContext('2d');
var LARGURA_TELA = canvas.width;
var ALTURA_TELA = canvas.height;

function cortarImagem(x, y, largura, altura, sprite) {
	var imagemCortada = createImageBitmap(sprite, x, y, largura, altura);
    return imagemCortada;
};