// engine_ts/memory.ts
export class FileIO {

    /** Recebe uma lista de caminhos de sprites (.spr) e retorna uma lista (promise) dos objetos carregados */
    public static async loadSpriteFiles<T = any>(pathList: string[]): Promise<T[]> {
        const promises = pathList.map(async (path) => {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erro ao carregar sprite: ${path}`);
            }
            const text = await response.text();
            try {
                return JSON.parse(text) as T;
            } catch (error) {
                throw new Error(`Erro de formatação/sintaxe no arquivo sprite: ${path}. Verifique se o conteúdo está correto.`);
            }
        });

        return Promise.all(promises);
    }

    /** Recebe uma lista de caminhos de imagens e retorna uma lista (promisse) das imagens carregadas */
    public static async loadImages(pathList: string[]): Promise<HTMLImageElement[]> {
        const promises = pathList.map(path => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.src = path;
                img.onload = () => resolve(img);
                img.onerror = () => reject(`Erro ao carregar: ${path}`);
            });
        });

        // Baixa todas as imagens em paralelo e espera a última terminar!
        return Promise.all(promises);
    }
}
