#include "SceneLayer.h"

SceneLayer::SceneLayer(){
    res = Resources::getInstance();
    posX = posY=0.0;
    spriteListCapacity = 50; // valor padrão da capacidade de sprites da cena
    spriteList = new Sprite*[spriteListCapacity];
    spriteListSize=0; // a princípio, nenhum sprite adicionado
}
SceneLayer::~SceneLayer(){}

/* MÉTODOS DO GAMELOOP */

// atualiza todos os sprites de 'spriteList'
void SceneLayer::update(){
    for(size_t i=0;i<spriteListSize;i++){
        spriteList[i]->update();
    }
}
void SceneLayer::render(){
    for(size_t i=0;i<spriteListSize;i++){
        spriteList[i]->render();
    }
}

/* MÉTODOS */
void SceneLayer::addSprite(Sprite* sprite){
    spriteList[spriteListSize++]=sprite;
}
Sprite* SceneLayer::getSprite(int index){
    return spriteList[index];
}
void SceneLayer::move(){
    for(uint8_t i=0; i<spriteListSize;i++){ // percorre a lista de layers da cena
        spriteList[i]->move(); // move cada um dos layers
    }
}