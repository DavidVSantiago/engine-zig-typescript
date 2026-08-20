export class FileIO {

    /** Recebe o caminho de um arquivo JSON e retorna (promise) o objeto carregado */
    public static async loadJsonFromFile<T = any>(path: string): Promise<T> {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Erro ao carregar JSON: ${path}`);
        }
        const text = await response.text();
        try {
            return JSON.parse(text) as T;
        } catch (error) {
            throw new Error(`Erro de formatação/sintaxe no arquivo JSON: ${path}. Verifique se o conteúdo está correto.`);
        }
    }
}

