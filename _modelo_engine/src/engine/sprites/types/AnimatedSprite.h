#pragma once
#include "MultiSimpleSprite.h"

using namespace std;

/** Uma Implementação simples de um Sprite Animado com vários quadros com a mesma dimensão.
 *  Cada quadro é usado para representar um quadro da animação. */
class AnimatedSprite: public MultiSimpleSprite{
private:
    /* MÉTODOS privados -----------------------------------------------------------*/
    void changeFrame(); // calcula e muda o quadro do jogo

public:
    /* ATRIBUTOS ------------------------------------------------------------------*/
    // possui uma lista de RectOrig, pois precisa armazenar um rect para cada quadro
    float frameTime; // tempo, em segundos, de duração de cada frame
    float accTime; // tempo. em segundos, decorridos desde a ultima mudança de frame
    
    /* CONSTRUTORES E DESTRUTORES -------------------------------------------------*/
    // recebe a ref da imagem do sprite, junto com as quantidades de linhas e colunas do sprite
    // de onde serão cortados os quadros da animação (máximo de 255 linhas e 255 colunas)
    AnimatedSprite(string sprite_descriptor);
    virtual ~AnimatedSprite();

    /* MÉTODOS DO GAMELOOP --------------------------------------------------------*/
    void update() override;

};

    