#pragma once
#include <SDL2/SDL.h>
#include <stdio.h>
#include <vector>
#include <string>
#include "engine/scenes/types/SimpleScene.h"
#include "engine/Engine.h"
#include "engine/sprites/types/SimpleSprite.h"
#include "engine/sprites/types/MultiSimpleSprite.h"
#include "engine/sprites/types/AnimatedSprite.h"

using namespace std;

class Cenario: public SimpleScene{
public:
    /* ATRIBUTOS ----------------------------------------------*/
    Sprite *bg,*inimigo,*inimigo2,*inimigo3,*person;
    /* CONSTRUTORES E DESTRUTORES -----------------------------*/
    Cenario(string name);
    ~Cenario();
    
    /* MÉTODOS DO GAMELOOP ------------------------------------*/
    void handleEvents() override;
    void update() override;

    /* MÉTODOS SOBRESCRITOS ------------------------------------------------*/
    void checkCollisions();
};