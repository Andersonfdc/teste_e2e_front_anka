# Documentação de Testes E2E (Cypress)

Este repositório contém testes E2E para o fluxo de autenticação e navegação privada da aplicação.

## Objetivo

Garantir qualidade funcional e não funcional dos fluxos críticos:

- login com validações de formulário;
- autenticação com OTP (captura real do código no banco);
- logout;
- navegação e estabilidade do sidebar;
- filtros da página de usuários (função, status e busca);
- checks básicos de responsividade.

## Stack de testes

- Cypress (`cypress`)
- `start-server-and-test` para subir app + rodar suíte
- `pg` para leitura do OTP real na tabela `verification_codes`

## Como rodar

### Instalação

```bash
npm install
```

### Rodar aplicação (frontend)

```bash
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

### Rodar Cypress (modo interativo)

```bash
npm run cypress:open
```

### Rodar Cypress (headless)

```bash
npm run cypress:run
```

### Rodar suíte E2E completa (sobe app + executa testes)

```bash
npm run test:e2e
```

Observação: este comando sobe o frontend em `http://localhost:3001` para evitar conflito com um `next dev` já rodando na porta 3000.

## Onde estão os testes no repositório

Os testes E2E ficam dentro da pasta `cypress/`.

Estrutura principal:

```text
cypress/
  e2e/
    auth/
      login.cy.js
    private/
      sidebar-navigation.cy.js
      users-filters.cy.js
  support/
    commands.js
    e2e.js
    index.d.ts
    pages/
      login.page.js
      otp.page.js
      home.page.js
      sidebar.page.js
      users.page.js
  screenshots/
  videos/
```

Arquivos/pastas mais importantes:

- `cypress/e2e/**`: specs E2E (os testes em si).
- `cypress/support/commands.js`: comandos customizados reutilizáveis (ex.: login com OTP real).
- `cypress/support/pages/**`: POM (Page Objects) usados pelas specs para encapsular seletores e ações.
- `cypress/support/e2e.js`: arquivo carregado automaticamente pelo Cypress antes das specs.
- `cypress.config.mjs`: configuração do Cypress + tasks Node (ex.: task para buscar OTP no banco).
- `cypress/screenshots/`: screenshots gerados em falhas.
- Vídeos: [cypress/videos](cypress/videos)

## Estrutura dos testes

### 1) Autenticação

Arquivo: `cypress/e2e/auth/login.cy.js`

Cobre:

- validação de campos obrigatórios no login;
- sucesso de login com redirecionamento para OTP;
- erro de credenciais inválidas;
- autenticação completa usando OTP real capturado no backend;
- logout após login (desktop);
- cenários mobile:
  - render responsivo da tela de login;
  - fluxo de login em viewport menor;
  - login + OTP real + logout mobile.

### 2) Navegação privada / Sidebar

Arquivo: `cypress/e2e/private/sidebar-navigation.cy.js`

Cobre:

- login no `beforeEach` usando comando customizado (`loginWithRealOtp`);
- navegação entre Home e Usuários;
- alternância de estado do sidebar (colapsado/expandido);
- validações não funcionais:

  - tempo de navegação para rota privada;
  - tempo de resposta da API de usuários (`/api/v1/users`).

### 3) Usuários / Filtros e busca

Arquivo: `cypress/e2e/private/users-filters.cy.js`

Cobre:

- login no `beforeEach` usando comando customizado (`loginWithRealOtp`);
- filtro por função (Administrador, Membro, Todas as funções);
- filtro por status (Ativos, Inativos, Todos os status);
- filtro de busca por nome e email;
- cenário sem resultados e retorno ao estado inicial.

### POM (Page Object Model)

As interações de UI foram extraídas para objetos de página, reduzindo duplicação e melhorando manutenção.

Arquivos de Page Objects:

- `cypress/support/pages/login.page.js`
- `cypress/support/pages/otp.page.js`
- `cypress/support/pages/home.page.js`
- `cypress/support/pages/sidebar.page.js`
- `cypress/support/pages/users.page.js`

Matriz de cobertura (POM x Spec):

| Page Object         | Specs que utilizam                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `login.page.js`   | `cypress/e2e/auth/login.cy.js`                                                                                                |
| `otp.page.js`     | `cypress/e2e/auth/login.cy.js`                                                                                                |
| `home.page.js`    | `cypress/e2e/auth/login.cy.js`, `cypress/e2e/private/sidebar-navigation.cy.js`, `cypress/e2e/private/users-filters.cy.js` |
| `sidebar.page.js` | `cypress/e2e/auth/login.cy.js`, `cypress/e2e/private/sidebar-navigation.cy.js`, `cypress/e2e/private/users-filters.cy.js` |
| `users.page.js`   | `cypress/e2e/private/sidebar-navigation.cy.js`, `cypress/e2e/private/users-filters.cy.js`                                   |

### Casos de teste

#### `cypress/e2e/auth/login.cy.js`

- Dado a tela de login, Quando submeter sem preencher, Então deve exibir erros obrigatórios.
- Dado credenciais válidas, Quando enviar o login, Então deve redirecionar para OTP.
- Dado credenciais inválidas, Quando enviar o login, Então deve exibir erro de autenticação.
- Dado challengeId ativo, Quando capturar OTP no banco e confirmar, Então deve autenticar e ir para Home.
- Dado usuário autenticado, Quando clicar em Sair, Então deve limpar sessão e voltar para login.
- Dado viewport mobile, Quando abrir login, Então deve renderizar elementos essenciais.
- Dado viewport mobile, Quando efetuar login com sucesso, Então deve ir para OTP.
- Dado viewport mobile e challenge válido, Quando capturar e informar OTP real, Então deve autenticar.
- Dado usuário autenticado no mobile, Quando realizar logout, Então deve retornar ao login sem cookies.

#### `cypress/e2e/private/sidebar-navigation.cy.js`

- Dado usuário autenticado, Quando navegar no sidebar, Então deve alternar entre Home e Usuários.
- Dado sidebar expandido, Quando colapsar e expandir novamente, Então a navegação deve continuar funcional.
- Dado ambiente estável, Quando navegar para Usuários, Então deve atender critérios de latência e estabilidade.

#### `cypress/e2e/private/users-filters.cy.js`

- Dado a listagem de usuários, Quando filtrar por função, Então deve refletir o resultado esperado.
- Dado a listagem de usuários, Quando filtrar por status, Então deve refletir o resultado esperado.
- Dado a listagem de usuários, Quando buscar por nome ou email, Então deve aplicar o filtro corretamente.
