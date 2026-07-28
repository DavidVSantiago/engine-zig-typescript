#pragma once

#include <vector>
#include <fstream>
#include "../Resources.h"
#include "utils/CollisionSet.h"
#include "../utils/libs/picojson.h"

using namespace std;

/** Implementação abstrata de um Sprite.
 * Elementos básicos de todos os tipos de Sprites. */
class Sprite{
public:
    /* ATRIBUTOS ------------------------------------------------------------------*/
    SDL_Texture* image; // referência ao sprite na memória que será desenhado
    uint16_t imageWidth, imageHeight; // dimensões do sprite
    uint16_t tileWidth, tileHeight; // dimensões do frame
    
    vector<SDL_Rect*> originArray; // Array de Rects de origem para renderização
    vector<SDL_Rect*> destArray; // Array de Rcts de destino para renderização
    uint16_t frameIndex; // indice do quadro a ser renderizado
    uint16_t frameCount; // numero total de frames do sprite
    vector<CollisionSet*> collSetArray; // Array de conjuntos de caixas de colisão
    float posX, posY;
    float speedX;
    float speedY;
    Resources *res;

    /* CONSTRUTORES E DESTRUTORES -------------------------------------------------*/
    Sprite(string sprite_descriptor); // recebe o nome do descritor da imagem do sprite
    virtual ~Sprite();

    /* GETTERS & SETTERS ----------------------------------------------------------*/
    virtual SDL_Rect* getOrigin(); // Retorna a informação do Frame do sprite a ser desenhado
    virtual SDL_Rect* getDest(); // Retorna a informação da destino de desenho na tela

    /* MÉTODOS DO GAMELOOP --------------------------------------------------------*/
    virtual void update();
    virtual void render();

    /* MÉTODOS --------------------------------------------------------------------*/
    void move();
    void unmove();
    void updateCollBoxes(); // atualiza as posições das caixas de colisão
    void parseSpriteDescriptor(string sprite_descriptor); // faz o parse do arquivo .json descritor do sprite
};