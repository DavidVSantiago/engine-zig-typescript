#include "Resources.h"

//---------------------------------------------------------------------------------------------------------
// ATRIBUTOS privados
//---------------------------------------------------------------------------------------------------------
Resources *Resources::instance = nullptr; // inicialização da instância (específico do C++)

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES privados
//---------------------------------------------------------------------------------------------------------
Resources::Resources(){
    isRunning = true;
    vk_up = vk_down = vk_left = vk_right = false;
    deltaTime = 0;
    renderer = nullptr;
    PATH_IMGS_ASSETS = "";
}
Resources::~Resources(){}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS
//---------------------------------------------------------------------------------------------------------
Resources* Resources::getInstance(){
    if (instance == nullptr) instance = new Resources();
    return instance;
}

void Resources::initDisplay(uint16_t width, uint16_t height, uint32_t pixelFormat, bool fullscreen){
    display = new Display(width,height,fullscreen);
    imageIO = ImageIO::getInstance();
    imageIO->init(pixelFormat);
}

void Resources::setRenderer(SDL_Renderer* renderer){
    this->renderer=renderer;
    imageIO->setRenderer(renderer);
}
SDL_Renderer* Resources::getRenderer(){
    return renderer;
}

void Resources::setImagesAsset(string path){
    PATH_IMGS_ASSETS = path;
}
string Resources::getImagesAsset(){
    return PATH_IMGS_ASSETS;
}

uint64_t Resources::getTimeTick(){return SDL_GetPerformanceCounter();}
uint64_t Resources::getTimeTickFrequency(){return SDL_GetPerformanceFrequency();}

bool Resources::loadImage(string fileName, string fileExt){

    formatFileExt(fileExt); // converte para caixa baixa e retira ponto inical do texto da extensão do arquivo
    string source = PATH_IMGS_ASSETS + fileName + "." + fileExt; // prepara a string de consulta no arquivo  

    // carrega e decodifica os dados brutos da imagem a partir do arquivo.
    unsigned width, height;
    unsigned char* imageData = nullptr;
    if(fileExt=="png") imageData = imageIO->decode_PNG_File(source,&width,&height); // decodifica arquivos .PNG
   
    SDL_Texture* newTexture = nullptr; // textura da imagem na memória
    // converte os dados brutos da imagem PNG para uma Textura SDL
    newTexture = imageIO->load_Texture(imageData,width,height);

    delete[] imageData; // Liberar memória de imageData
    
    this->imagesMap[fileName] = newTexture; // adiciona a imagem no mapa
    return true; // indica o sucesso da operação
}

SDL_Texture* Resources::getImage(string imageName){
    if (this->imagesMap.find(imageName) != this->imagesMap.end())
        return this->imagesMap[imageName];
    printf("imagem não encontrada para a chave %s!\n",imageName.c_str());
    return nullptr;
}
void Resources::clearImagens(){
    for (auto& pair : imagesMap) { // percorre todos os pares do mapa
        delete pair.second; // Libera a memória do SDL_Texture*
    }
    imagesMap.clear(); // Remove todas as chaves e valores do mapa
}
void Resources::formatFileExt(string &str){
    if (!str.empty() && str[0] == '.') str.erase(0, 1);  // Remove o ponto no início, se houver
    transform(str.begin(), str.end(), str.begin(), [](unsigned char c) { return std::tolower(c); }); // converte para caixa baixa
}

Display* Resources::getDisplay(){return display;}