#include "Scene.h"

//---------------------------------------------------------------------------------------------------------
/* CONSTRUTORES E DESTRUTORES PRIVADOS*/
//---------------------------------------------------------------------------------------------------------
Scene::Scene(std::string name){
    this->name = name; // toda Scene possui um nome associado a ela
    this->res = Resources::getInstance();
    layersListCapacity = 5; // valor padrão da capacidade de layers da cena
    layersList = new SceneLayer*[layersListCapacity];
    layersListSize=0; // a princípio, nenhum layer adicionado
}
Scene::~Scene(){}

/* MÉTODOS DO GAMELOOP */
void Scene::update(){
    for(size_t i=0;i<layersListSize;i++){ // renderiza todos os layer da cena
        layersList[i]->update();
    }
}
void Scene::render(){
    for(size_t i=0;i<layersListSize;i++){ // renderiza todos os layer da cena
        layersList[i]->render();
    }
}
 
/* MÉTODOS */
void Scene::addLayer(vector<Sprite*> spriteList){
    SceneLayer* layer = new SceneLayer();
    for(size_t i=0;i<spriteList.size();i++){
        layer->addSprite(spriteList.at(i)); // adiciona cada sprite ao novo layer
    }
    layersList[layersListSize++]=layer; // adiciona o novo layer (com seus sprites) à lista de layers
}

SceneLayer* Scene::getLayer(int index){
    return layersList[index];
}

void Scene::move(){
    for(uint8_t i=0; i<layersListSize;i++){ // percorre a lista de layers da cena
        layersList[i]->move(); // move cada um dos layers
    }
}