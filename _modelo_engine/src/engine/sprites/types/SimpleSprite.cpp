#include "SimpleSprite.h"

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES
//---------------------------------------------------------------------------------------------------------
SimpleSprite::SimpleSprite(string sprite_descriptor):Sprite(sprite_descriptor) {
    
    /* Um SimpleSprite possui apenas um único quadro.
    *  Por isso, os Recs de origem e destino são mais simples de se definir */

    // define o array de Rects de origem para recorte do sprite
    originArray.push_back(new SDL_Rect()); // apenas um único quadro
    originArray[0]->w = tileWidth;
    originArray[0]->h = tileHeight;
    originArray[0]->x = originArray[0]->y = 0;

    // define o Rect de destino para desenhar o sprite na tela
    destArray.push_back(new SDL_Rect()); // apenas um único quadro
    destArray[0]->w = tileWidth;
    destArray[0]->h = tileHeight;
    destArray[0]->x = destArray[0]->y = 0.0;
}
SimpleSprite::~SimpleSprite(){}

/** MÉTODOS */


