#include "Sprite.h"

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES
//---------------------------------------------------------------------------------------------------------
Sprite::Sprite(string sprite_descriptor) {
    res = Resources::getInstance();
    frameCount = 0; // antes de ler o descritor do sprite, zeramosa contagem de frames
    parseSpriteDescriptor(sprite_descriptor); // faz o parse do descritor do sprite

    posX = 0.0;
    posY = 0.0;
    speedX = 0.0;
    speedY = 0.0;
    
    frameIndex=0;
}
Sprite::~Sprite(){}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS DO GAMELOOP
//---------------------------------------------------------------------------------------------------------
void Sprite::update(){
    // atualiza a Rect Base
    destArray[frameIndex]->x=(int)posX;
    destArray[frameIndex]->y=(int)posY;
}

void Sprite::render(){
    SDL_RenderCopy(this->res->renderer, this->image,this->getOrigin(),this->getDest());
    collSetArray[frameIndex]->render(); // desenha a caixa de colisão do frame atual
}

//---------------------------------------------------------------------------------------------------------
// GETTERS & SETTERS
//---------------------------------------------------------------------------------------------------------
SDL_Rect* Sprite::getOrigin(){
    return originArray[frameIndex]; // retorna o quadro único
}
SDL_Rect* Sprite::getDest(){
    return destArray[frameIndex];
}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS
//---------------------------------------------------------------------------------------------------------
void Sprite::move(){
    posX+=(speedX*this->res->deltaTime);
    posY+=(speedY*this->res->deltaTime);
    updateCollBoxes();
}

void Sprite::unmove(){
    posX-=((speedX*this->res->deltaTime));
    posY-=((speedY*this->res->deltaTime));
    updateCollBoxes();
    
}

// atualiza as posições das caixas de colisão
void Sprite::updateCollBoxes(){
    for(size_t i=0; i<collSetArray.size();i++){
        collSetArray[i]->updateBoxes(posX,posY);
    }
}

void Sprite::parseSpriteDescriptor(string sprite_descriptor){
    // carrega o arquivo json ----------------------------------------------------------
    ifstream file(res->getImagesAsset() + sprite_descriptor);
    if (!file.is_open()) {
        std::cerr << "Erro ao abrir o tentar abrir o arquivo descritor \""<<res->getImagesAsset() + sprite_descriptor<<"\".\n";
        return;
    }
    std::vector<char> buffer((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    std::string jsonData(buffer.begin(), buffer.end());
    file.close();

    // faz o parse do arquivo .json aberto ---------------------------------------------
    picojson::value json;
    string erro = picojson::parse(json, jsonData);
    if(!erro.empty()){
        std::cerr << "Erro ao fazer o parse do JSON!" << std::endl;
        return;
    }
    image = res->getImage(json.get("filename").get<string>()); // faz a busca da imagem carregada em memória, a partir do nome obtido no descritor
    imageWidth = static_cast<uint16_t>(stoi(json.get("img-width").get<string>())); // faz a leitura da largura do sprite no descritor
    imageHeight = static_cast<uint16_t>(stoi(json.get("img-height").get<string>())); // faz a leitura da altura do sprite no descritor
    tileWidth = static_cast<uint16_t>(stoi(json.get("tile-width").get<string>())); // faz a leitura da largura do sprite no descritor
    tileHeight = static_cast<uint16_t>(stoi(json.get("tile-height").get<string>())); // faz a leitura da altura do sprite no descritor
    frameCount = static_cast<uint16_t>(stoi(json.get("tile-count").get<string>())); // faz a leitura da quantidade de frames no descritor
    
    // extrai o array dos frames para inserir as caixas de colisão ------------
    const picojson::array& frames = json.get("frames").get<picojson::array>();
    for (const auto& frame : frames) { // itera sobre os frames

        const picojson::object& obj = frame.get<picojson::object>(); // obtem cada frame
        const picojson::array& boxes = obj.at("boxes").get<picojson::array>(); // extrai o array de caixas de colisão de cada frame
        CollisionSet *collisionSet = new CollisionSet(); // conjunto de caixas de colisão para cada frame
    
        for (const auto& box : boxes) { // itera sobre as caixas de colisão
            const picojson::object& obj = box.get<picojson::object>(); // obtem cada caixa
            // extrai os dados de cada caixa
            uint16_t x = static_cast<uint16_t>(stoi(obj.at("x").get<string>()));
            uint16_t y = static_cast<uint16_t>(stoi(obj.at("y").get<string>()));
            uint16_t w = static_cast<uint16_t>(stoi(obj.at("w").get<string>()));
            uint16_t h = static_cast<uint16_t>(stoi(obj.at("h").get<string>()));
            collisionSet->addBox(x,y,w,h); // adiciona uma nova box ao conjunto
        }
        collSetArray.push_back(collisionSet); // adiciona o conjunto ao array de conjuntos
    }
}
