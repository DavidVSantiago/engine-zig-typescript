#include "ImageIO.h"

//---------------------------------------------------------------------------------------------------------
// ATRIBUTOS privados
//---------------------------------------------------------------------------------------------------------
ImageIO *ImageIO::instance = nullptr; // inicialização da instância (específico do C++)

//---------------------------------------------------------------------------------------------------------
// CONSTRUTORES E DESTRUTORES privados
//---------------------------------------------------------------------------------------------------------
ImageIO::ImageIO(){}
ImageIO::~ImageIO(){}

//---------------------------------------------------------------------------------------------------------
// MÉTODOS
//---------------------------------------------------------------------------------------------------------
ImageIO* ImageIO::getInstance(){
    if (instance == nullptr) {
        instance = new ImageIO;
    }
    return instance;
}

void ImageIO::init(uint32_t pixelFormat){
    this->pixelFormat = pixelFormat;
}
void ImageIO::setRenderer(SDL_Renderer* renderer){
    this->renderer=renderer;
}

unsigned char* ImageIO::decode_PNG_File(string source, unsigned* width,unsigned* height){
    unsigned char* imageData = nullptr; // dados brutos a serem retornados

    // Lê o arquivo PNG, a partir do arquivo, como um vetor de bytes
    std::ifstream file(source, ios::binary);
    if (!file) std::cerr << "Erro ao abrir o arquivo: " << source << std::endl;
    std::vector<unsigned char> fileData((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    file.close(); // fecha o stream de leitura do arquivo

    LodePNGState state; // para armazenar as informações do PNG
    lodepng_state_init(&state);  // Inicializa o estado do LodePNG
    
    // descodifica em RGBA os bytes da imagem carregada
    unsigned error = lodepng_decode(&imageData, width, height, &state, fileData.data(), fileData.size());
    if(error) printf("Erro ao descodificar a imagem PNG %s: %s\n",source.c_str(),lodepng_error_text(error));

    lodepng_state_cleanup(&state); // limpa os dados do estado
    return imageData;
}

SDL_Texture* ImageIO::load_Texture(unsigned char* imageData,unsigned width,unsigned height){

    uint32_t sdlPixelFormat;

    // obtem o formato usado para criar a textura SDL
    if (pixelFormat==RGBA5551) sdlPixelFormat = SDL_PIXELFORMAT_RGBA5551;
    else if (pixelFormat==RGBA4444) sdlPixelFormat = SDL_PIXELFORMAT_RGBA4444;
    else sdlPixelFormat = SDL_PIXELFORMAT_RGBA32;
     
    // cria a nova textura apropriada
    SDL_Texture* newTexture = nullptr; // textura a ser retornada
    newTexture = SDL_CreateTexture(renderer, sdlPixelFormat, SDL_TEXTUREACCESS_STATIC, width, height);
    if (!newTexture) std::cerr << "Erro ao criar a textura SDL: " << SDL_GetError() << std::endl;

    // atualiza a textura co os dados convertivos
    if (pixelFormat==RGBA5551){
        std::cout << "Formato GRBA5551." << std::endl;
        SDL_UpdateTexture(newTexture, nullptr, convertPixelsTo_RGBA5551(imageData,width,height).data(), width * sizeof(unsigned short));
    }else if (pixelFormat==RGBA4444){
        std::cout << "Formato GRBA4444." << std::endl;
        SDL_UpdateTexture(newTexture, nullptr, convertPixelsTo_RGBA4444(imageData,width,height).data(), width * sizeof(unsigned short));
    }else{ // RGBA32
        std::cout << "Formato GRBA32." << std::endl;
        SDL_UpdateTexture(newTexture, nullptr, imageData, width * 4);
    }

    if (SDL_SetTextureBlendMode(newTexture, SDL_BLENDMODE_BLEND) < 0) std::cerr << "Erro ao configurar o blending mode: " << SDL_GetError() << std::endl;
    return newTexture;

}


vector<unsigned short> ImageIO::convertPixelsTo_RGBA4444(unsigned char* imageData,unsigned width,unsigned height){
    
    // Converte a imagem RGBA para o formato RGBA4444
    vector<unsigned short> rgba4444Data(width * height);
    for (unsigned y = 0; y < height; ++y) {
        for (unsigned x = 0; x < width; ++x) {
            // Cada pixel na imagem é RGBA (4 bytes por pixel)
            unsigned char r = imageData[(y * width + x) * 4 + 0];  // Red
            unsigned char g = imageData[(y * width + x) * 4 + 1];  // Green
            unsigned char b = imageData[(y * width + x) * 4 + 2];  // Blue
            unsigned char a = imageData[(y * width + x) * 4 + 3];  // Alpha

            // Converte a cor para o formato RGBA4444 (4 bits por canal)
            unsigned short rgba4444 = ((r >> 4) << 12) | ((g >> 4) << 8) | ((b >> 4) << 4) | (a >> 4);
            rgba4444Data[y * width + x] = rgba4444;
        }
    }
    return rgba4444Data;
}

vector<unsigned short> ImageIO::convertPixelsTo_RGBA5551(unsigned char* imageData, unsigned width, unsigned height){
    
    // Converte a imagem RGBA para o formato RGBA5551
    vector<unsigned short> rgba5551Data(width * height);
    for (unsigned y = 0; y < height; ++y) {
        for (unsigned x = 0; x < width; ++x) {
            // Cada pixel na imagem é RGBA (4 bytes por pixel)
            unsigned char r = imageData[(y * width + x) * 4 + 0];  // Red
            unsigned char g = imageData[(y * width + x) * 4 + 1];  // Green
            unsigned char b = imageData[(y * width + x) * 4 + 2];  // Blue
            unsigned char a = imageData[(y * width + x) * 4 + 3];  // Alpha

            // Converte a cor para o formato RGBA5551 (5 bits por canal de cor, 1 bit para alfa)
            unsigned short rgba5551 = ((r >> 3) << 11) | ((g >> 3) << 6) | ((b >> 3) << 1) | (a > 127 ? 1 : 0);
            rgba5551Data[y * width + x] = rgba5551;
        }
    }
    return rgba5551Data;
}