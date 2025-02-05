COMO RODAR A APLICAÇÃO:

1º - Abrir o terminal do VsCode e digitar o comando -> json-server --watch db.json --port 3000 (Para abrir o servidor do Bando de Dados);
2º - Em outro terminal digitar o comando -> parcel ./Codigos/codigo/index.html (Para abrir a porta local do servidor);
3º - Entrar no porta que o parcel disponibilizar

---------------------------------------------------------------------------------------------

Estrutura do projeto:

Bibliotecas. Sendo elas:{
    *Three - Biblioteca para carregar objetos 3d;
    *Dat.Gui - Biblioteca para acessar uma inteface interativa;
    *OrbitControls - Biblioteca para conseguir controlar com o mouse o objeto 3d;
    *Parcel - Conseguir carregar o Localhost;
    *Json Server - Conseguir atualizar o banco de dados;
}

Descrição dos Arquivos:{
    FRONTEND:{
        index.html -> Estrutura básica da página, onde Three.js renderiza a cena.
        scripts.js -> Código principal que inicializa Three.js, dat.GUI e interage com a API.
    }
    BACKEND:{
        db.json -> Contém os dados das configurações salvas.
    }
    Outros Arquivos:{
        Packege.json -> Define as dependências (three, dat.gui, json-server) e scripts para rodar o projeto.
    }
}

Rodando o Projeto:{
    Instalar Dependências: npm install three dat.gui json-server
    Iniciar o BACKEND (JSON SERVER): json-server --watch db.json --port 3000
    Iniciar o FRONTEND (SERVER LOCAL): parcel ./Codigos/codigo/index.html
}

---------------------------------------------------------------------------------------------

Explicação sobre a comunicação frontend-backend: 

A comunicação entre o frontend (Three.js) e o backend (JSON Server) é feita por meio de requisições HTTP utilizando a API Fetch. O frontend envia e recupera dados do backend para garantir que as configurações do cubo sejam persistidas e recuperadas corretamente.

Carregamento Inicial das Configurações: Exemplo de requisição GET
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
( O fetch busca os dados do backend (db.json).
Se houver erro na requisição, ele lança uma mensagem de erro.
O objeto cubeSettings é atualizado com os valores do backend.
Os valores são aplicados ao cubo e ao ambiente na cena 3D. )


Salvando Configurações Automaticamente: Exemplo de PATCH
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
( O método PATCH envia somente os valores modificados.
O Content-Type: application/json indica que os dados estão em formato JSON.
Sempre que o usuário altera um valor no GUI, o saveCubeSettings() é chamado automaticamente. )


Resetando as Configurações: Adicionando botão de reset no GUI
gui.add({ Resetar: () => resetCubeSettings() }, 'Resetar');

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
( A função resetCubeSettings() redefine os valores para os padrões iniciais.
Os valores são aplicados ao cubo e ao ambiente.
O saveCubeSettings() salva as configurações no JSON Server.
O gui.updateDisplay() garante que o GUI mostre os valores atualizados. )

RESUMINDO {
GET → O frontend solicita as configurações do cubo no backend ao iniciar.
PATCH → Cada vez que o usuário muda uma configuração no GUI, o frontend atualiza os valores no backend.
RESET → O usuário pode restaurar as configurações padrão, atualizando os valores tanto no frontend quanto no backend.  

Isso garante que, mesmo que o usuário saia e volte, as configurações sejam mantidas.
}

---------------------------------------------------------------------------------------------

Possíveis melhorias futuras:

Armazenamento em Banco de Dados Real (Não Apenas JSON Server){
    O que: Substituir o JSON Server por um banco de dados real, como MySQL, MongoDB ou PostgreSQL.
    Por que: O JSON Server é útil para protótipos, mas não é ideal para produção. Um banco de dados real oferece persistência de dados mais robusta e escalabilidade.
}

Interface de Configuração Avançada{
    O que: Adicionar mais controles e opções para o cubo e o ambiente (como animações de luz, câmeras personalizáveis, sombras, etc.).
    Por que: Permite uma personalização ainda mais avançada da cena 3D e melhora a experiência do usuário.
}

Backup e Restauração de Configurações{
    O que: Adicionar uma funcionalidade para backup e restauração das configurações, permitindo que o usuário faça backup de seu trabalho e o restaure posteriormente.
    Por que: Isso oferece segurança adicional, permitindo ao usuário restaurar as configurações anteriores caso algo dê errado.  
}

---------------------------------------------------------------------------------------------

Decisões Adotadas no Projeto:

Uso de Three.js para a Criação da Cena 3D{
    Three.js é uma biblioteca poderosa e amplamente utilizada para criar gráficos 3D no navegador. Sua flexibilidade e integração com outras ferramentas (como OrbitControls e dat.GUI) facilitaram o desenvolvimento de uma cena interativa.
}

Uso de dat.GUI para Interface de Usuário{
    dat.GUI é uma solução simples e eficiente para criar interfaces gráficas de controle de parâmetros em tempo real, o que se alinha com a necessidade de permitir ao usuário modificar as propriedades da cena e do cubo facilmente.
}

JSON Server como Backend Simples{
    Para protótipos rápidos, JSON Server é uma ferramenta excelente, pois simula um banco de dados com mínimo esforço. Ele fornece endpoints RESTful para manipulação de dados em formato JSON, facilitando a persistência das configurações sem a necessidade de configurar um banco de dados real.
}

Atualização Automática das Configurações no Backend{
    Decidi salvar as configurações automaticamente a cada modificação no GUI para garantir que o estado da aplicação seja sempre persistido sem a necessidade de um botão de "Salvar".
}