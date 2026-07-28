#pragma once
#include <cstdint>
#include "../Sprite.h"

using namespace std;

/** Uma Implementação simples de um Sprite com vários quadros com a mesma dimensão.
 *  Cada quadro é usado para representar um estado, não quadros de uma animação! */
class MultiSimpleSprite: public Sprite{
public:

    /* CONSTRUTORES E DESTRUTORES -------------------------------------------------*/
    // recebe a ref da imagem do sprite, junto com as quantidades de linhas e colunas do sprite
    // de onde serão cortados os quadros (máximo de 255 linhas e 255 colunas)
    MultiSimpleSprite(string sprite_descriptor);
    virtual ~MultiSimpleSprite();
};