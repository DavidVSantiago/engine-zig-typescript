# Script de Geração de Apresentação e Vídeo (NotebookLM)

Faça o upload do arquivo `hardware_sob_a_lente_programador.md` no seu NotebookLM. Depois, copie e cole os prompts abaixo, um por vez no chat, para extrair os slides e o roteiro do vídeo.

---

### Prompt 1: Configuração Inicial e Aulas 0 e 1 (A Base)
**Copie e cole:**
> "Aja como um produtor de vídeos educativos e designer instrucional especializado em ciência da computação. O meu objetivo é criar uma série de apresentações em vídeo usando EXCLUSIVAMENTE o documento fonte fornecido.
> 
> A estrutura para cada slide ou cena do vídeo deve ser estritamente:
> **[Número do Slide/Cena] - [Título da Cena]**
> *   **Visualização em Tela:** (Sugira de forma clara e criativa qual diagrama, animação, texto ou arte deve aparecer na tela neste momento, baseando-se nos fluxogramas e artes ASCII do texto).
> *   **Tópicos (Bullets):** (No máximo 3 pontos curtos de grande impacto para colocar no slide).
> *   **Roteiro (Fala do Apresentador):** (O texto exato e engajador que deve ser falado pelo narrador).
> 
> Para começar, gere o roteiro completo para a **Aula 0 (O computador não executa abstrações)** e para a **Aula 1 (O Abismo da Memória)**. Limite a 4 ou 5 slides no total para essas duas aulas."

---

### Prompt 2: Aula 2 (Data-Oriented Design)
**Copie e cole:**
> "Excelente. Agora, mantendo o mesmo formato (Título, Visualização, Tópicos e Roteiro), gere o conteúdo para a **Aula 2: Dados são parte do algoritmo**. 
>
> Destaque visualmente a diferença entre *Array of Structures (AoS)* e *Structure of Arrays (SoA)*, e dê atenção à 'Mensagem da aula' no roteiro do apresentador. Limite a 3 ou 4 slides."

---

### Prompt 3: Aulas 3 e 4 (Software Rendering e Paralelismo)
**Copie e cole:**
> "Muito bom. Vamos agrupar a renderização e o paralelismo. Gere o conteúdo para a **Aula 3 (Desenhando na força bruta)** e a **Aula 4 (Quando escalar significa paralelizar)**.
> 
> Sugira visuais que demonstrem o Blitting (copiar blocos de memória para a tela) e mostre a grande diferença arquitetônica entre o processamento escalar da CPU e o massivamente paralelo (SIMD/GPU). Limite a cerca de 5 slides para essas duas aulas combinadas."

---

### Prompt 4: Aulas 5 e 6 (Gargalos e o Apple Silicon)
**Copie e cole:**
> "Maravilha. Vamos entrar no hardware moderno. Gere o roteiro para a **Aula 5 (O preço de separar CPU e GPU)** e a **Aula 6 (A quebra do modelo: Apple Silicon)**.
>
> É crucial sugerir visuais que contrastem a ponte do PCI-Express (o gargalo) da Aula 5 com a Memória Unificada (UMA) do Apple Silicon da Aula 6. Deixe claro no roteiro que 'zero-copy não significa zero-cost'. Limite a 5 slides no total."

---

### Prompt 5: Aulas 7, 8 e Encerramento (Sinfonia de Performance)
**Copie e cole:**
> "Para finalizar a nossa série de vídeos, gere o conteúdo da **Aula 7 (Programando para o silício)** e da **Aula 8 (A verdadeira sinfonia de performance)**.
> 
> Mostre visualmente como o *Tagged Union* funciona em oposição ao polimorfismo clássico. A última cena (Aula 8) deve ser um fechamento épico reunindo tudo em um único fluxo de pensamento, enfatizando que a verdadeira otimização é colocar o dado certo, na hora certa, no hardware certo. Limite a 5 slides."

---

### Bônus: Ideias Práticas
**Copie e cole (Se quiser dicas para o projeto acompanhante):**
> "Atuando como um orientador de projetos, pegue a seção 'Exercício transversal sugerido' do final do documento e detalhe brevemente, em formato de tabela, qual pequeno desafio de programação eu posso passar para os meus alunos em cada uma das 9 etapas para sedimentar o conhecimento."
