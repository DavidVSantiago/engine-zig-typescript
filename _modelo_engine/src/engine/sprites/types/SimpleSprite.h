#pragma once
#include "../Sprite.h"

using namespace std;

/** A Implementação mais simples de um Sprite.
 *  Possui apenas um único quadro de sprite. */
class SimpleSprite: public Sprite{
public:
    /* CONSTRUTORES E DESTRUTORES -------------------------------------------------*/
    SimpleSprite(string sprite_descriptor); // recebe a ref da imagem do sprite
    virtual ~SimpleSprite();

    /** MÉTODOS */
    
};