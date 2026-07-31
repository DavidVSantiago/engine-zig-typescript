carregarSpritesPerson(document.getElementById("sprite_person_bola"));
carregarSpritesInimigo(document.getElementById("sprite_inimigo"));
carregarSpritesBolinha(document.getElementById("sprite_person_bola"));

var bg = document.getElementById("bg"); // imagem de fundo
var splash_logo = document.getElementById("splash_logo"); // imagem da tela de splash

// mudanças de ESTADOS do jogo
var ESTADO = 'S';
agendarTransicao(3000, 'E');

// variáveis de normalização de tempo
var tempoAtual;
var tempoAnterior = performance.now(); // obtém o tempo inicial (do primeiro quadro)
var deltaTime;

// variáveis usadas no gerenciamento das teclas direcionais
var k_cima = false;
var k_baixo = false;
var k_esquerda = false;
var k_direita = false;

// registra os eventos de pressionamento e soltura das teclas
window.addEventListener('keydown', keyPressed, false);
window.addEventListener('keyup', keyReleased, false);

carregarSons(); // carrega os sons utilizados no jogo

function gameLoop() {
    tempoAtual = performance.now(); // obtém o tempo atual
    deltaTime = (tempoAtual - tempoAnterior) * (6e-2);
    handlerEvents();
    update(deltaTime);
    render();
    tempoAnterior = tempoAtual; // atualiza o tempo anterior (para o próximo quadro)
}

// 1ª função do gameloop
function handlerEvents() {
    if (ESTADO == 'E') {
        handlerEventsPerson(k_cima, k_baixo, k_esquerda, k_direita);
        handlerEventsInimigo();
    }
}

// 2ª função do gameloop
function update(deltaTime) {
    if (ESTADO == 'E') {
        update_personagem(deltaTime);
        update_inimigo(deltaTime);
        update_bolinha(deltaTime);
        testeColisoes(deltaTime);
        testeFimJogo();
    } else if (ESTADO == 'G') {
        ESTADO = 'R';
        reiniciar();
        agendarTransicao(2000, 'E');
    }
}

// 3ª função do gameloop
function render() {
    if (ESTADO == 'S') { // se o ESTADO atual for o SPLASH
        context.drawImage(splash_logo, 0, 0); // desenha a tela de splash
    } else if (ESTADO == 'R') { // se estiver no ESTADO REINICIANDO
        context.fillStyle = 'black';
        context.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA); // desenha um fundo preto na tela
        context.font = "bold 50px Arial narrow";
        context.fillStyle = 'white';
        context.fillText(msgFim, 150, 200);
    } else { // ESTADO PAUSADO ou EXECUTANDO
        context.drawImage(bg, 0, 0); // desenha o fundo do jogo
        context.fillStyle = 'gray';
        context.fillRect(LIMITE_DIREITO, 0, 5, ALTURA_TELA); // desenha o limite do Personagem
        context.fillRect(LIMITE_ESQUERDO, 0, 5, ALTURA_TELA); // desenha o limite do Inimigo
        context.drawImage(person_atual, person_posX, person_posY);
        context.drawImage(inimigo_atual, inimigo_posX, inimigo_posY);
        context.drawImage(bolinha_atual, bolinha_posX, bolinha_posY);
        if (ESTADO == 'E') { // se estiver no ESTADO EXECUTANDO
            context.font = "40px Arial narrow";
            context.fillStyle = 'white';
            context.textAlign = "left";
            context.fillText(pontosInimigo + "pts", 140, 40);
            context.fillText(pontosJogador + "pts", 440, 40);
        } else { // ESTADO PAUSADO
            context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            context.fillRect(0, 0, LARGURA_TELA, ALTURA_TELA); // desenha um fundo preto transparente sobre a tela do jogo
            // desenha os elementos do menu de pause
            context.font = "bold 50px Arial narrow";
            context.fillStyle = 'white';
            context.fillText("JOGO PAUSADO", 150, 80);
            context.fillText("Continuar", 220, 200);
            context.fillText("Sair", 220, 270);
            // desenha o seletor de opções
            if (pauseOpt == 0) { // se o valor do seletor for 0
                context.fillRect(180, 170, 30, 30);
            } else { // se o valor do seletor for 0
                context.fillRect(180, 240, 30, 30);
            }
        }
    }
}

function agendarTransicao(tempo, novo_ESTADO) { // agenda uma transição para o 'novo_ESTADO' após 'tempo'
    setTimeout(function () { ESTADO = novo_ESTADO }, tempo);
}

function testeFimJogo() {
    if (pontosJogador == maxPontos) {
        msgFim = "VOCÊ VENCEU!";
        ESTADO = 'G';
    } else if (pontosInimigo == maxPontos) {
        msgFim = "VOCÊ PERDEU!";
        ESTADO = 'G';
    }
}

function reiniciar() {
    // reinicia os atributos do inimigo
    inimigo_posX = LARGURA_TELA * (1.0 / 8.0) - inimigo_raio;
    inimigo_posY = (ALTURA_TELA / 2) - inimigo_raio;
    inimigo_velY = 0;
    pontosInimigo = 0;
    // reinicia os atributos do Jogador
    person_posX = LARGURA_TELA * (7.0 / 8.0) - person_raio;
    person_posY = ALTURA_TELA / 2 - person_raio;
    pontosJogador = 0;
    // reinicia os atributos da bolinha
    bolinha_velX = bolinha_velBase / 2;
    bolinha_velY = bolinha_velBase / 2;
    bolinha_posX = (LARGURA_TELA / 2) - bolinha_raio;
    bolinha_posY = (ALTURA_TELA / 2) - bolinha_raio;
    // reinicia os valores da variáveis das teclas direcionais
    k_cima = false;
    k_baixo = false;
    k_esquerda = false;
    k_direita = false;
}

// função invocada para testar as colisões
function testeColisoes(deltaTime) {
    // testa as colisões entre o personagem e os cantos direito e esquerdo da tela
    if (person_posX + (person_raio * 2) >= LARGURA_TELA || person_posX <= 0) {
        desmover_X_personagem(deltaTime);
    }
    // testa as colisões entre o personagem e os cantos superior e inferior da tela
    if (person_posY + (person_raio * 2) >= ALTURA_TELA || person_posY <= 0) {
        desmover_Y_personagem(deltaTime);
    }

    // colisão do jogador com o limite direito do campo ------------------------------
    if (person_posX <= LIMITE_DIREITO) {
        desmover_X_personagem(deltaTime);
    }

    // colisão da bolinha com o lado direito do campo ------------------------------
    if (bolinha_posX + (bolinha_raio * 2) >= LARGURA_TELA) {
        bolinha_velX *= -1; // inverte a velocidde horizontal
        bolinha_posX = LARGURA_TELA / 2 - (bolinha_raio) + 90; // reposiciona a bolinha no meio
        pontosInimigo++; // adiciona ponto para o inimigo
    }

    // colisão da bolinha com o lado esquerdo do campo ------------------------------
    if (bolinha_posX <= 0) {
        bolinha_velX *= -1; // inverte a velocidde horizontal
        bolinha_posX = LARGURA_TELA / 2 - (bolinha_raio) - 90; // reposiciona a bolinha no meio
        pontosJogador++ // adiciona ponto para o jogador
    }

    // colisão da bolinha com o lado superior do campo ------------------------------
    if (bolinha_posY <= 0) {
        bolinha_velY *= -1; // inverte a velocidde vertical
        bolinha_posY = 0; // reposiciona a bolinha no limite do lado superior
        clipSet.play();
    }

    // colisão da bolinha com o lado inferior do campo ------------------------------
    if (bolinha_posY + (bolinha_raio * 2) >= ALTURA_TELA) {
        bolinha_velY *= -1; // inverte a velocidde vertical
        bolinha_posY = ALTURA_TELA - (bolinha_raio * 2); // reposiciona a bolinha no limite do lado inferior
        clipSet.play();
    }

    // colisão da bolinha com o personagem
    var ladoHorizontal = person_centroX - bolinha_centroX;
    var ladoVertical = person_centroY - bolinha_centroY;
    var hipotenusa = Math.sqrt((ladoHorizontal ** 2) + (ladoVertical ** 2));
    if (hipotenusa <= person_raio + bolinha_raio) {
        desmover_X_personagem(deltaTime);
        desmover_Y_personagem(deltaTime);
        var seno = ladoVertical / hipotenusa;
        var cosseno = ladoHorizontal / hipotenusa;
        bolinha_velX = (-bolinha_velBase) * cosseno;
        bolinha_velY = (-bolinha_velBase) * seno;
        clipSet.play();
    }

    // colisão da bolinha com o inimigo
    ladoHorizontal = inimigo_centroX - bolinha_centroX;
    ladoVertical = inimigo_centroY - bolinha_centroY;
    hipotenusa = Math.sqrt((ladoHorizontal ** 2) + (ladoVertical ** 2));
    if (hipotenusa <= inimigo_raio + bolinha_raio) {
        desmover_X_inimigo(deltaTime);
        desmover_Y_inimigo(deltaTime);
        var seno = ladoVertical / hipotenusa;
        var cosseno = ladoHorizontal / hipotenusa;
        bolinha_velX = (-bolinha_velBase) * cosseno;
        bolinha_velY = (-bolinha_velBase) * seno;
        clipSet.play();
    }
}

// função invocada quando uma tecla é pressionada
function keyPressed(e) {
    var code = e.keyCode;
    if (ESTADO == 'E') {
        switch (code) {
            case 37: k_esquerda = true; break; //Left key
            case 38: k_cima = true; break; //Up key
            case 39: k_direita = true; break; //Right key
            case 40: k_baixo = true; break; //Down key
            case 27:
                ESTADO = 'P';
                clipMenu.play();
                break; //Down key
        }
    } else if (ESTADO == 'P') {
        switch (code) {
            case 38: //Up key
                clipMenu.play();
                pauseOpt = 0;
                break;
            case 40: //Down key
                clipMenu.play();
                pauseOpt = 1;
                break;
            case 13: //Enter key
                clipMenu.play();
                if (pauseOpt == 0) {
                    ESTADO = 'E';
                    k_cima = false;
                    k_baixo = false;
                    k_esquerda = false;
                    k_direita = false;
                } else { // pauseOpt == 1
                    window.close();
                }
                break;
            case 27: //Esc Key
                clipMenu.play();
                ESTADO = 'E';
                k_cima = false;
                k_baixo = false;
                k_esquerda = false;
                k_direita = false;
                break;
        }
    }
}

// função invocada quando uma tecla é solta
function keyReleased(e) {
    var code = e.keyCode;
    if (ESTADO == 'E') {
        switch (code) {
            case 37: k_esquerda = false; break; //Left key
            case 38: k_cima = false; break; //Up key
            case 39: k_direita = false; break; //Right key
            case 40: k_baixo = false; break; //Down key
        }
    }
}

setInterval(gameLoop, 17); // define as repetições do gameloop