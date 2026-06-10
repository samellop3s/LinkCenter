# LinkCenter | Hub de Links Premium

O **LinkCenter** é um gerenciador e visualizador de links em formato Single Page Application (SPA), desenvolvido com foco em alta performance, estética moderna (dark glassmorphism) e interatividade. 

Este projeto serviu como um laboratório prático para o aprendizado e desenvolvimento de **Rules (Regras)**, **Workflows (Fluxos de Trabalho)** e **Skills (Habilidades)** personalizados na ferramenta **Antigravity**, elevando a sinergia de pareamento de código entre programador e agente de IA.

---

## 🚀 Foco de Aprendizado: Regras, Workflows e Skills

A trajetória deste projeto foi marcada pelo desenvolvimento de diretrizes para o agente de desenvolvimento, divididas em três vertentes principais:

1. **[Rules (Regras)](file:///c:/Users/samue/LinkCenter/LinkCenter/.agents/rules/global-dev-standard.md)**: Estabelecemos o arquivo `global-dev-standard.md` para garantir conformidade técnica estrita. Ele dita o uso da escala neutra `zinc`/`slate` do Tailwind CSS, interações fluidas com `active:scale-95`, variáveis descritivas e acessibilidade por meio de `<label>` e contraste adequado.
2. **[Workflows (Fluxos de Trabalho)](file:///c:/Users/samue/LinkCenter/LinkCenter/.agents/workflows/new-section.md)**: Criamos o atalho `/new-section` que orienta o agente passo a passo na criação de novas seções semânticas de HTML (`<section>`), gerando marcações e comentários padronizados no CSS/JS.
3. **[Skills (Habilidades)](file:///c:/Users/samue/LinkCenter/LinkCenter/skill/performance-pro/SKILL.md)**: Introduzimos a habilidade `performance-pro` especializada em diagnosticar redundâncias de DOM, propor carregamentos eficientes de scripts (como `defer`), validar classes conflitantes de Tailwind e sugerir a otimização por *Event Delegation*.

---

## 🛠️ Passo a Passo do Desenvolvimento

### 1. Fundação e Design Base
* Criação do **[index.html](file:///c:/Users/samue/LinkCenter/LinkCenter/index.html)** e inicialização do Tailwind Play CDN.
* Criação do **[styles.css](file:///c:/Users/samue/LinkCenter/LinkCenter/styles.css)** para introduzir a fonte customizada *Outfit*, as variáveis e classes de desfoque de vidro (*glassmorphism*).

### 2. Layout sem Mockup e Cards de Links
* Estruturação de uma visualização central limpa e fluida no plano de fundo.
* Renderização de cartões em grade responsiva (`grid-cols-1 sm:grid-cols-2`) com transições de elevação e sombras dinâmicas ao passar o mouse (*hover state*).
* Sincronização e persistência de dados no `localStorage` por meio do controlador **[app.js](file:///c:/Users/samue/LinkCenter/LinkCenter/app.js)**.

### 3. Header e Busca de Links
* Criação do componente de cabeçalho (`<header>`) contendo o título do perfil sincronizado em tempo real.
* Input de busca acessível (`sr-only` label) que filtra instantaneamente os cartões de link correspondentes por **título** ou **URL**, com mensagem personalizada para buscas vazias.
* Adição de botão de colapso rápido da barra lateral esquerda, permitindo visualização de tela cheia.

### 4. Painel de Analytics (Métricas Dinâmicas)
* Através do atalho `/new-section`, criamos o bloco `#analytics` contendo métricas de *Cliques*, *Conversão*, *Erros* e *Links Ativos*.
* Implementação de loop de simulação em tempo real no JS (atualizações a cada 3 segundos) e contagem automática de links ativos.

---

## 💻 Como Executar

O projeto é inteiramente estático (SPA), podendo ser executado com qualquer servidor web simples.

1. Navegue até o diretório do projeto:
   ```bash
   cd c:\Users\samue\LinkCenter\LinkCenter
   ```
2. Inicialize o servidor de desenvolvimento:
   ```bash
   npx serve -l 3000
   ```
3. Abra seu navegador no endereço:
   **[http://localhost:3000](http://localhost:3000)**

---

## 🛡️ Tecnologias Utilizadas
* **HTML5** (Semântico e acessível)
* **Tailwind CSS Play CDN** (Estilização responsiva rápida)
* **Vanilla JavaScript ES6** (Gerenciamento de estado, eventos e sincronização de DOM)
* **CSS Custom Properties** (Customizações finas de transições e scrollbars)
* **FontAwesome v6** (Conjunto de ícones premium)