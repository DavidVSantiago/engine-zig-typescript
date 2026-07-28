carregarSpritesPerson(document.getElementById("sprite"));
carregarSpritesInimigo(document.getElementById("sprite"));

// variáveis usadas no gerenciamento das teclas direcionais
var k_cima = false;
var k_baixo = false;
var k_esquerda = false;
var k_direita = false;

// registra os eventos de pressionamento e soltura das teclas
window.addEventListener('keydown', keyPressed, false);
window.addEventListener('keyup', keyReleased, false);

function gameLoop() {
    handlerEvents();
    update();
    render();
}

// 1ª função do gameloop
function handlerEvents() {
    person_velX = 0;
    person_velY = 0;
    person_atual = person_parada;
    if (k_cima == true) {
        person_atual = person_cima;
        person_velY = -3;
        if (k_direita == true) {
            person_atual = person_direita_cima;
            person_velX = 3;
        }
        if (k_esquerda == true) {
            person_atual = person_esquerda_cima;
            person_velX = -3;
        }
    } else if (k_baixo == true) {
        person_atual = person_baixo;
        person_velY = 3;
        if (k_direita == true) {
            person_atual = person_direita_baixo;
            person_velX = 3;
        }
        if (k_esquerda == true) {
            person_atual = person_esquerda_baixo;
            person_velX = -3;
        }
    } else if (k_esquerda == true) {
        person_atual = person_esquerda;
        person_velX = -3;
    } else if (k_direita == true) {
        person_atual = person_direita;
        person_velX = 3;
    }
}

// 2ª função do gameloop
function update() {
    person_posX += person_velX;
    person_posY += person_velY;
    person_centroX = person_posX + person_raio;
    person_centroY = person_posY + person_raio;
    testeColisoes();
}

// 3ª função do gameloop
function render() {
    context.fillStyle = "#cccccc";
    context.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA);
    context.drawImage(person_atual, person_posX, person_posY);
    context.drawImage(inimigo_atual, inimigo_posX, inimigo_posY);

}

// função invocada para testar as colisões
function testeColisoes() {
    // testa as colisões entre o personagem e os cantos direito e esquerdo da tela
    if (person_posX + (person_raio * 2) >= LARGURA_TELA || person_posX <= 0) {
        person_posX -= person_velX;
    }
    // testa as colisões entre o personagem e os cantos superior e inferior da tela
    if (person_posY + (person_raio * 2) >= ALTURA_TELA || person_posY <= 0) {
        person_posY -= person_velY;
    }

    // testa a colisão circular (entre o personagem e o inimigo)
    var catetoH = person_centroX - inimigo_centroX;
    var catetoV = person_centroY - inimigo_centroY;
    var hypotenusa = Math.sqrt((catetoH ** 2) + (catetoV ** 2));
    if (hypotenusa < (person_raio + inimigo_raio)) {
        person_posX -= person_velX;
        person_posY -= person_velY;
    }
}


// função invocada quando uma tecla é pressionada
function keyPressed(e) {
    var code = e.keyCode;
    switch (code) {
        case 37: k_esquerda = true; break; //Left key
        case 38: k_cima = true; break; //Up key
        case 39: k_direita = true; break; //Right key
        case 40: k_baixo = true; break; //Down key
    }
}

// função invocada quando uma tecla é solta
function keyReleased(e) {
    var code = e.keyCode;
    switch (code) {
        case 37: k_esquerda = false; break; //Left key
        case 38: k_cima = false; break; //Up key
        case 39: k_direita = false; break; //Right key
        case 40: k_baixo = false; break; //Down key
    }
}

setInterval(gameLoop, 17); // define as repetições do gameloop
