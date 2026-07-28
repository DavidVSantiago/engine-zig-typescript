// engine_ts/memory.ts
export class Memory {

    /** Recebe uma lista de caminhos de JSONs e retorna uma lista (promise) dos objetos JSON carregados */
    public static async loadJsons<T = any>(pathList: string[]): Promise<T[]> {
        const promises = pathList.map(async (path) => {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Erro ao carregar JSON: ${path}`);
            }
            return response.json() as Promise<T>;
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
