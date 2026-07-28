#include <iostream>
#include <cstdlib>
#include <stdio.h>
#include <fstream>
#include <sstream>
#include <vector>
#include "rapidxml.hpp"

using namespace std;

class CollisionBox{
public:
    int x,y,w,h;
};

class Frame{
public:
    vector<CollisionBox*> set;
    void addBox(CollisionBox* box){
        set.push_back(box);
    }
};


string splitFileName(const std::string& source) {
    size_t pos = source.find_last_of('.'); // Localiza a última ocorrência de '.' na string
    if (pos == string::npos) return source; // Se não encontrar o ponto, retorna o nome inteiro
    return source.substr(0, pos); // obtem  e retorna o nome
}
string splitFileFormat(const std::string& source) {
    size_t pos = source.find_last_of('.'); // Localiza a última ocorrência de '.' na string
    if (pos == string::npos) return ""; // Se não encontrar o ponto, retorna a extensão vazia
    return source.substr(pos+1); // obtem  e retorna a extensão
}

int main(int argc, char* argv[]){
    // verifica os argumentos do programa
    if (argc != 3) {
        cout << "Numero invalido de argumentos!" << endl;
        cerr << "Uso: ./sprite-json-formatter" << " input_file.tsx output_file.json \n";
        return 1; // Código de erro
    }
    // extrai os argumentos
    string input_file = argv[1];
    string output_file = argv[2];

    // Carregar o arquivo XML em uma string ---------------------------------------------------------------
    ifstream file(input_file);
    if (!file.is_open()) {
        std::cerr << "Erro ao abrir o tentar abrir o arquivo \""<<input_file<<"\".\n";
        return 1;
    }
    std::vector<char> buffer((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    buffer.push_back('\0'); // RapidXML exige que o buffer termine com '\0'
    file.close();
  
    // cria o documento XML e faz o parse ----------------------------------------------------------------
    rapidxml::xml_document<> doc;
    try {
        doc.parse<0>(&buffer[0]); // Analisa o conteúdo do buffer
    }catch(const rapidxml::parse_error& e) {
        std::cerr << "Erro ao analisar o XML: " << e.what() << '\n';
        return 1;
    }

    // Após feito o parse, podemos extrair as informações ------------------------------------------------
    rapidxml::xml_node<>* tileset = doc.first_node("tileset");
    if (!tileset) {
        std::cerr << "Erro: nó raiz não encontrado.\n";
        return 1;
    }

    // Obtem os dados gerais do tileset
    rapidxml::xml_attribute<>* tilewidth = tileset->first_attribute("tilewidth");
    rapidxml::xml_attribute<>* tileheight = tileset->first_attribute("tileheight");
    rapidxml::xml_attribute<>* columns = tileset->first_attribute("columns");

    // Obtem o nó <image>
    rapidxml::xml_node<>* image = tileset->first_node("image");
    rapidxml::xml_attribute<>* imagesource = image->first_attribute("source");
    rapidxml::xml_attribute<>* imagewidth = image->first_attribute("width");
    rapidxml::xml_attribute<>* imageheight = image->first_attribute("height");

    // Iterar pelos elementos "<tile>" e extrai os frames
    vector<Frame*> frames; // lista de frames
    for (rapidxml::xml_node<>* tile = tileset->first_node("tile"); tile; tile = tile->next_sibling("tile")) {
        Frame* frame = new Frame();
        // extrai cada uma das caixas de colisão
        rapidxml::xml_node<>* objGroup = tile->first_node("objectgroup");
        for (rapidxml::xml_node<>* object = objGroup->first_node("object"); object; object = object->next_sibling("object")) {
            rapidxml::xml_attribute<>* x = object->first_attribute("x");
            rapidxml::xml_attribute<>* y = object->first_attribute("y");
            rapidxml::xml_attribute<>* w = object->first_attribute("width");
            rapidxml::xml_attribute<>* h = object->first_attribute("height");

            // captura os dados da caixa de colisão
            CollisionBox* colBox = new CollisionBox();
            colBox->x= atoi(x->value());
            colBox->y=atoi(y->value());
            colBox->w=atoi(w->value());
            colBox->h=atoi(h->value());

            frame->addBox(colBox); // adiciona a caixa de colisão ao frame
        }
        frames.push_back(frame); // adiciona o novo frame 
    }

    // Converte os dados para JSON ------------------------------------------------------------------
    

    stringstream framesStream;
    for(int i=0;i<frames.size();i++){
        Frame* frame = frames[i];
        framesStream << "        {\n";
        framesStream << "            \"index\": 0,\n";
        framesStream << "            \"boxes\": [\n";
        for(int i=0;i<frame->set.size();i++){
            CollisionBox* box = frame->set[i];
            stringstream boxStream;
            framesStream << "                {"<<"\"x\":\""<<box->x<<"\", \"y\":\""<<box->y<<"\", \"w\":\""<<box->w<<"\", \"h\":\""<<box->h<<"\"}";
            if(i!=frame->set.size()-1) framesStream << ",\n"; // se não for o ultimo objeto
        }
        framesStream << "\n            ]\n";
        framesStream << "\n        }";
        if(i!=frames.size()-1) framesStream << ","; // se não for o ultimo objeto
        framesStream << "\n";
    }

    

    stringstream  json;
    json << "{\n    \"filename\":\""<<splitFileName(imagesource->value())<<"\","
    <<"\n    \"fileformat\":\""<<splitFileFormat(imagesource->value())<<"\","
    <<"\n    \"img-width\":\""<<imagewidth->value()<<"\","
    <<"\n    \"img-height\":\""<<imageheight->value()<<"\","
    <<"\n    \"tile-width\":\""<<tilewidth->value()<<"\","
    <<"\n    \"tile-height\":\""<<tileheight->value()<<"\","
    <<"\n    \"tile-count\":\""<<frames.size()<<"\",\n"
    <<"    \"frames\": [\n"
    <<framesStream.str()
    <<"    ]\n"
    <<"}";

   

    // Uma vez criado o arquivo json, vamos salvá-lo ----------------------------------------------------
    std::ofstream jsonFile(output_file);
    if (!jsonFile) {
        std::cerr << "Erro ao tentar criar o arquivo JSON \""<<output_file<<"\".\n";
        return 1;
    }
    // Escrevendo os dados JSON no arquivo
    jsonFile << json.str();
    jsonFile.close();

    return 0;
}