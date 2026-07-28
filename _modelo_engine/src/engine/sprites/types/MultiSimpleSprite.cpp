#include "MultiSimpleSprite.h"

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES
//---------------------------------------------------------------------------------------------------------
MultiSimpleSprite::MultiSimpleSprite(string sprite_descriptor):Sprite(sprite_descriptor) {
    
    /* Um MultiSimpleSprite possui vários quadros.
    *  Por isso, os rects precisam ser definidos um a um.
    *  apesar da imagem ser recebida em matriz, os quadros são armazenados em um array */

    uint8_t lines = imageHeight/tileHeight; // calcula a quantidade de linhas
    uint8_t cols = imageWidth/tileWidth; // calcula a quantidade de colunas
    
    // define o array de Rects de origem para recorte do sprite
    uint16_t count = frameCount; // contador de quadros
    for(int l=0;l<lines;l++){
        for(int c=0;c<cols;c++){
            if(count==0) break; // evita adicionar recortes para frames inexistentes do sprites (frames transparentes no final do sprite)
            SDL_Rect* rect = new SDL_Rect();
            rect->w=tileWidth;
            rect->h=tileHeight;
            rect->x=tileWidth*c;
            rect->y=tileHeight*l;
            originArray.push_back(rect);
            count--;
        }
    }
    frameIndex = 0;

    // define o Rect de destino para desenhar o sprite na tela
    for(int l=0;l<lines;l++){
        for(int c=0;c<cols;c++){
            SDL_Rect* rect = new SDL_Rect();
            rect->w=tileWidth;
            rect->h=tileHeight;
            rect->x=rect->y=0;
            destArray.push_back(rect);

        }
    }
}
MultiSimpleSprite::~MultiSimpleSprite(){}
