# Checklist de Implementação - Backend (Brev.ly)

Este é um guia passo a passo detalhado para implementar as funcionalidades do back-end do projeto. Vá marcando os itens conforme for finalizando.

## 1. Configuração de Variáveis de Ambiente
Para gerenciar e validar as configurações sensíveis da aplicação de forma tipada e segura.

- [x] Instalar o **Zod** para a validação das variáveis:
  ```bash
  npm i zod
  ```
- [x] *(Opcional se usar Node >= 20.6 com `--env-file`)* Instalar o **Dotenv**:
  ```bash
  npm i dotenv
  ```
- [x] Criar o arquivo `.env.example` na raiz do `server` com as chaves obrigatórias.
- [x] Criar o arquivo `.env` (certifique-se de que está no `.gitignore`) preenchido para ambiente local.
- [x] Criar o arquivo `src/env/index.ts`. Usar Zod para ler `process.env` e validar `PORT`, `DATABASE_URL` e chaves do Cloudflare. O app deve falhar se faltarem chaves.

## 2. Configuração do Drizzle ORM e Conexão com Banco
Setup para comunicação tipada com o PostgreSQL.

- [ ] Instalar dependências principais do banco:
  ```bash
  npm i drizzle-orm postgres
  ```
- [ ] Instalar as dependências de desenvolvimento do Drizzle:
  ```bash
  npm i -D drizzle-kit @types/pg
  ```
- [ ] Criar o arquivo `drizzle.config.ts` (ou `drizzle.config.js`) na raiz configurando onde ficam os schemas e a URL do banco de dados.
- [ ] Criar o arquivo `src/db/connection.ts` instanciando o banco com o driver `postgres` e integrando com o `drizzle()`.

## 3. Criação do Schema e Migrations
Definindo a modelagem da nossa tabela no banco de dados.

- [ ] Criar o arquivo `src/db/schema.ts` (ou separar numa pasta `schemas/links.ts` se preferir) contendo a definição da tabela, por exemplo:
  - `id` (texto/UUID ou Serial)
  - `original_url` (texto, not null)
  - `short_url` (texto, unique, not null)
  - `clicks` (inteiro, default 0)
  - `created_at` (timestamp default now)
- [ ] Adicionar os scripts ao seu `package.json`:
  ```json
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate"
  }
  ```
- [ ] Executar a geração da migration e, em seguida, rodar a migration para criar a tabela no Postgres do seu Docker Compose.

## 4. Configuração Inicial do Fastify
Preparando as bases do servidor web.

- [ ] Instalar o plugin de CORS:
  ```bash
  npm i @fastify/cors
  ```
- [ ] No seu arquivo principal do servidor (ex: `src/server.ts`), registrar o `@fastify/cors`.
- [ ] Configurar um `errorHandler` global no Fastify para lidar de forma amigável com erros de validação do Zod (retornando status `400`).

## 5. Casos de Uso (Regras de Negócio) e Rotas
Aqui reside a inteligência central da aplicação. Para manter a organização, considere separar as rotas/controllers da lógica do banco.

- [ ] **Rota de Criação de Link (`POST /links`)**
  - Validar se o body possui `originalUrl` e `shortUrl` com Zod.
  - Verificar (com regex ou método do Zod) se a `shortUrl` está bem formatada.
  - Verificar no banco se a `shortUrl` já está em uso (lançar erro/409 se estiver).
  - Inserir o registro usando Drizzle e retornar os dados criados (Status 201).
- [ ] **Rota de Listagem de Links (`GET /links`)**
  - Fazer uma query com Drizzle buscando todos os links.
  - Retornar o array JSON com a listagem.
- [ ] **Rota de Obter URL e Redirecionar (`GET /:shortUrl`)**
  - Receber a rota dinâmica pelos `params`.
  - Buscar a URL no banco de dados pela `shortUrl`.
  - Se não achar o link, devolver status HTTP `404 Not Found`.
  - Em uma transação (ou após encontrar), incrementar o campo `clicks` no banco (ex: `clicks = clicks + 1`).
  - Utilizar o redirecionamento do Fastify (`reply.redirect(301, original_url)` ou 302).
- [ ] **Rota de Deletar Link (`DELETE /links/:identifier`)**
  - Receber `id` ou `shortUrl` na rota (conforme decisão documentada no agent.md).
  - Executar comando de delete no Drizzle e retornar status `204 No Content`.

## 6. Integração com CDN/S3 (Exportar CSV)
Gerar e armazenar relatórios de acessos de forma remota.

- [ ] Instalar a SDK da AWS para interagir com o Cloudflare R2 (pois eles usam API compatível com o S3):
  ```bash
  npm i @aws-sdk/client-s3
  ```
- [ ] Instalar um conversor de objeto para CSV para facilitar a vida (ou você pode montar o parse usando strings de template):
  ```bash
  npm i json-2-csv
  ```
- [ ] **Rota Exportar CSV (`GET /links/export`)**
  - Buscar a listagem total de links no banco de dados.
  - Converter o resultado retornado pelo Drizzle em uma `string` (ou `Buffer`) formatada como `.csv`.
  - Gerar um nome de arquivo único com o módulo nativo `crypto`: `const filename = crypto.randomUUID() + '.csv'`.
  - Inicializar o `S3Client` com as chaves e endpoint do Cloudflare.
  - Executar um `PutObjectCommand` no bucket enviando seu conteúdo (passar `ContentType: 'text/csv'`).
  - Retornar na API a string resultante do `CLOUDFLARE_PUBLIC_URL` concatenada com o `filename`.

## 7. Docker e Empacotamento
Criar a imagem isolada do ambiente para o back-end.

- [ ] Criar o arquivo `Dockerfile` na raiz do `server`.
  - Utilizar imagens otimizadas como `node:20-alpine`.
  - Copiar `package.json`, instalar dependências, fazer o transpile de TS para JS se não estiver rodando direto com `tsx`, e iniciar pelo node a pasta `/dist`.
- [ ] Criar o `.dockerignore` ignorando pastas pesadas (como `node_modules/`, pastas temporárias) e arquivos que não devem ir pra imagem (`.env`).
