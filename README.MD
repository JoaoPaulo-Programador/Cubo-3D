Onde fica o Código HTML/JavaScript?
Caminho do código:

Entre na pasta Codigos, depois entre na pasta Codigo.

O arquivo index.html estará lá, e na pasta js estará o arquivo scripts.js.

Como Rodar a Aplicação
Iniciar o servidor de backend (JSON Server):

Abra o terminal do VSCode e execute o comando:

bash
Copiar
json-server --watch db.json --port 3000
Isso irá iniciar o servidor do banco de dados na porta 3000.

Iniciar o servidor frontend:

Em outro terminal, execute o comando:

bash
Copiar
parcel ./Codigos/codigo/index.html
Isso irá iniciar a aplicação na sua máquina local.

Acessar a aplicação:

Abra o navegador e entre na porta fornecida pelo Parcel para acessar a aplicação.

Estrutura do Projeto
Bibliotecas Utilizadas
Three.js: Biblioteca para carregar e renderizar objetos 3D.

Dat.GUI: Biblioteca para criar uma interface interativa para controlar parâmetros da cena.

OrbitControls: Biblioteca para controlar o objeto 3D com o mouse.

Parcel: Ferramenta para carregar a aplicação no servidor local.

JSON Server: Simula um banco de dados para persistir as configurações da cena.

Descrição dos Arquivos
Frontend:

index.html: Estrutura básica da página, onde a cena 3D é renderizada pelo Three.js.

scripts.js: Código principal que inicializa o Three.js, dat.GUI e interage com a API do backend.

Backend:

db.json: Contém os dados das configurações salvas.

Outros Arquivos:

package.json: Define as dependências (Three.js, dat.GUI, json-server) e scripts para rodar o projeto.

Rodando o Projeto
1. Instalar Dependências
Execute o comando abaixo para instalar as dependências do projeto:

bash
Copiar
npm install three dat.gui json-server
2. Iniciar o Backend (JSON Server)
Inicie o backend para fornecer as configurações e dados persistidos:

bash
Copiar
json-server --watch db.json --port 3000
3. Iniciar o Frontend (Servidor Local)
Inicie o servidor local para rodar a aplicação:

bash
Copiar
parcel ./Codigos/codigo/index.html
Explicação sobre a Comunicação Frontend-Backend
A comunicação entre o frontend (Three.js) e o backend (JSON Server) é feita por meio de requisições HTTP utilizando a API Fetch.

Carregamento Inicial das Configurações
Exemplo de requisição GET:

javascript
Copiar
async function loadCubeSettings() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar configurações.");
        const data = await response.json();

        Object.assign(cubeSettings, data);

        cubo.material.color.set(cubeSettings.Cor_Cubo);
        cena.background = new THREE.Color(cubeSettings.Cor_Fundo);
        ambiente.intensity = cubeSettings.Luz_Ambiente;
        cubo.position.set(cubeSettings.x, cubeSettings.y, cubeSettings.z);

        gui.updateDisplay();
    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
    }
}
O que acontece: O frontend busca os dados de configuração do cubo no backend (arquivo db.json). Caso haja erro, é exibida uma mensagem de erro. Os dados são aplicados ao cubo e ao ambiente 3D, e a interface é atualizada.

Salvando Configurações Automaticamente
Exemplo de requisição PATCH:

javascript
Copiar
async function saveCubeSettings() {
    try {
        await fetch(API_URL, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cubeSettings)
        });
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
    }
}
O que acontece: Sempre que o usuário altera alguma configuração, os dados são enviados automaticamente para o backend para persistir as mudanças.

Resetando as Configurações
Exemplo de código para resetar configurações e atualizar o backend:

javascript
Copiar
async function resetCubeSettings() {
    const defaultConfig = {
        Cor_Cubo: "#00FF00",
        Cor_Fundo: "#FFFFFF",
        Luz_Ambiente: 100,
        x: 0,
        y: 0,
        z: 0
    };

    Object.assign(cubeSettings, defaultConfig);

    cubo.material.color.set(cubeSettings.Cor_Cubo);
    cena.background = new THREE.Color(cubeSettings.Cor_Fundo);
    ambiente.intensity = cubeSettings.Luz_Ambiente;
    cubo.position.set(cubeSettings.x, cubeSettings.y, cubeSettings.z);

    await saveCubeSettings();
    gui.updateDisplay();
}
O que acontece: O usuário pode restaurar as configurações padrão. As mudanças são aplicadas no frontend e os dados são salvos novamente no backend.

Resumo do Funcionamento
GET: O frontend solicita as configurações do cubo ao backend quando a página é carregada.

PATCH: Sempre que o usuário altera uma configuração no GUI, o frontend atualiza os dados no backend.

RESET: O usuário pode restaurar as configurações padrão, o que é refletido tanto no frontend quanto no backend.

Essas interações garantem que as configurações sejam persistidas e possam ser recuperadas mesmo após o usuário sair e voltar à aplicação.

Possíveis Melhorias Futuras
1. Armazenamento em Banco de Dados Real
O que: Substituir o JSON Server por um banco de dados real, como MySQL, MongoDB ou PostgreSQL.

Por que: O JSON Server é útil para protótipos, mas um banco de dados real oferece persistência de dados mais robusta e escalabilidade para produção.

2. Interface de Configuração Avançada
O que: Adicionar mais controles para personalização da cena 3D, como animações de luz, câmeras personalizáveis, sombras, etc.

Por que: Melhorar a experiência do usuário, permitindo configurações avançadas para a cena e o cubo.

3. Backup e Restauração de Configurações
O que: Implementar uma funcionalidade para backup e restauração das configurações.

Por que: Oferecer maior segurança, permitindo ao usuário restaurar configurações anteriores caso algo dê errado.

Decisões Adotadas no Projeto
Uso de Three.js para a Criação da Cena 3D
Three.js foi escolhido pela sua robustez e flexibilidade para criar gráficos 3D no navegador, permitindo integração fácil com outras bibliotecas como OrbitControls e dat.GUI.

Uso de dat.GUI para Interface de Usuário
dat.GUI é ideal para criar interfaces gráficas interativas e permite a modificação em tempo real dos parâmetros da cena e do cubo, proporcionando uma experiência intuitiva para o usuário.

JSON Server como Backend Simples
O JSON Server foi utilizado como uma solução rápida para persistência de dados. Ele simula um banco de dados e é uma excelente escolha para protótipos e testes, antes de implementar um banco de dados real.

Atualização Automática das Configurações no Backend
As configurações são salvas automaticamente sempre que há alterações na interface, garantindo que o estado da aplicação seja persistido sem a necessidade de um botão "Salvar".
