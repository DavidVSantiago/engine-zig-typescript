#include <SDL2/SDL.h>
#include <stdio.h>
#include "engine/Engine.h"
#include "cenario.h"

int main(int argc, char **argv) {
    
    // incializa a engine
    Engine* engine = Engine::getInstance();
    engine->init(640,480,false);

    // cria o cenario inicial
    Cenario* cenario = new Cenario("Cenario");
    
    // dispara o gameloop passando o cenário inicial
    engine->start(cenario,0);

    // dispara a engine e o gameloop
    return 0;
}