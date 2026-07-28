#pragma once
#include <SDL2/SDL.h>
#include <string>
#include <cstdint>
#include "../Resources.h"
#include "utils/SceneLayer.h"

using namespace std;

/***********************************************************************************/
/* CLASSE ABSTRATA QUE REPRESENTA A BASE DAS CENAS */
/***********************************************************************************/
class Scene {
protected:
    /* ATRIBUTOS protegidos ------------------------------------------------------------------*/
    string name; // nome da cena, para fins de testes
    Resources* res;
    SceneLayer** layersList; // lista de layers da cena
    uint8_t layersListCapacity; // capacidade máxima da lista de layers da cena (inicial = 5)
    uint8_t layersListSize; // quantidade de layers atualmente na cena

public:
    /* CONSTRUTORES E DESTRUTORES*/
    Scene(string name);
    virtual ~Scene();

    /* MÉTODOS DO GAMELOOP */
    virtual void handleEvents()=0; // pure virtual (sem implementação aqui. deve ser implementada na derivada)
    virtual void update(); // pure virtual (sem implementação aqui. deve ser implementada na derivada)
    virtual void render();

    /* MÉTODOS */
    void addLayer(vector<Sprite*> spriteList);
    SceneLayer* getLayer(int index);
    virtual void move();
};