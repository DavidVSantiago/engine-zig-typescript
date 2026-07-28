#include "cenario.h"

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES
//---------------------------------------------------------------------------------------------------------
Cenario::Cenario(string name):SimpleScene(name){

    res->setImagesAsset("src/assets/imgs/"); // define o diretório dos arquivos de imagem

    // carrega as imagens
    res->loadImage("bg","pNG");
    res->loadImage("sprite_inimigo",".Png");
    res->loadImage("parada",".png");

    // Criar uma lista de sprites
    vector<Sprite*> listaSprites;
    bg = new SimpleSprite("bg.json");
    listaSprites.push_back(bg);
    inimigo = new AnimatedSprite("sprite_inimigo.json");
    inimigo->posX=10;
    inimigo->posY=200;
    inimigo->speedY=100; // 100px/s
    listaSprites.push_back(inimigo);
    inimigo2 = new AnimatedSprite("sprite_inimigo.json");
    inimigo2->posX=130;
    inimigo2->posY=300;
    inimigo2->speedY=100; // 100px/s
    listaSprites.push_back(inimigo2);
    inimigo3 = new MultiSimpleSprite("sprite_inimigo.json");
    inimigo3->posX=240;
    inimigo3->posY=100;
    inimigo3->speedY=100; // 100px/s
    listaSprites.push_back(inimigo3);
    person = new SimpleSprite("parada.json");
    person->posX=480;
    person->posY=180;
    person->speedY=50;
    person->speedX=-20;
    listaSprites.push_back(person);

    // adiciona um layer com os sprites
    addLayer(listaSprites);
}
Cenario::~Cenario(){}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS DO GAMELOOP
//---------------------------------------------------------------------------------------------------------
void Cenario::handleEvents(){

}
void Cenario::update(){
    SimpleScene::update(); // obrigatório
    checkCollisions();
}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS
//---------------------------------------------------------------------------------------------------------

void Cenario::checkCollisions(){
    if(inimigo->posY<=0){
        inimigo->posY=1;
        inimigo->speedY*=-1;
    }
    if((inimigo->posY+inimigo->tileHeight)>=res->getDisplay()->screenHeight){
        inimigo->posY=res->getDisplay()->screenHeight-inimigo->tileHeight-1;
        inimigo->speedY*=-1;
    }

    if(inimigo2->posY<=0){
        inimigo2->posY=1;
        inimigo2->speedY*=-1;
    }
    if((inimigo2->posY+inimigo2->tileHeight)>=res->getDisplay()->screenHeight){
        inimigo2->posY=res->getDisplay()->screenHeight-inimigo2->tileHeight-1;
        inimigo2->speedY*=-1;
    }

    if(inimigo3->posY<=0){
        inimigo3->posY=1;
        inimigo3->speedY*=-1;
    }
    if((inimigo3->posY+inimigo3->tileHeight)>=res->getDisplay()->screenHeight){
        inimigo3->posY=res->getDisplay()->screenHeight-inimigo3->tileHeight-1;
        inimigo3->speedY*=-1;
    }

    if(person->posY<=0){
        person->posY=1;
        person->speedY*=-1;
        Engine::getInstance()->playAudio();
    }
    if((person->posY+person->tileHeight)>=res->getDisplay()->screenHeight){
        person->posY=res->getDisplay()->screenHeight-person->tileHeight-1;
        person->speedY*=-1;
    }
}