# Projeto Brev.ly - Encurtador de URLs

Documento de especificação de requisitos funcionais e não funcionais para o desenvolvimento da aplicação FullStack de encurtamento de URLs.

---

## 1. Back-end

O back-end consiste em uma API para gerenciar o encurtamento de URLs, o redirecionamento e a geração de relatórios de acesso.

### 1.1. Requisitos Funcionais
- [ ] **Criar link**: Permitir o cadastro de uma nova URL associada a um link encurtado.
- [ ] **Validação de formato**: Não permitir a criação de um link com a URL encurtada mal formatada.
- [ ] **Validação de unicidade**: Não permitir a criação de um link com uma URL encurtada já existente.
- [ ] **Deletar link**: Permitir a exclusão de um link existente.
- [ ] **Obter URL original**: Retornar a URL original correspondente a uma URL encurtada para fins de redirecionamento.
- [ ] **Listar links**: Retornar uma lista de todas as URLs cadastradas na plataforma. A listagem deve ser performática.
- [ ] **Incrementar acessos**: Incrementar a contagem de acessos toda vez que um link for visitado/redirecionado.
- [ ] **Exportar relatório**: Gerar e exportar os links criados em um arquivo formato `.csv`.
  - O arquivo CSV deve conter os campos: URL original, URL encurtada, contagem de acessos e data de criação.
  - O nome do arquivo CSV gerado deve ser aleatório e único.
  - O arquivo CSV deve ser armazenado e acessado por meio de uma CDN (ex: Amazon S3, Cloudflare R2).

*Nota sobre padrão de identificação: As rotas de deletar ou incrementar acessos podem utilizar tanto o `id` quanto a `URL encurtada`, desde que o padrão escolhido seja mantido de forma consistente em toda a API e no Front-end.*

### 1.2. Requisitos Não Funcionais
- **Linguagem e Tecnologias**: TypeScript, Fastify.
- **Banco de Dados**: PostgreSQL.
- **ORM**: Drizzle ORM.
- **Ambiente e Configuração**:
  - Arquivo `.env.example` obrigatório com as seguintes chaves:
    - `PORT=`
    - `DATABASE_URL=`
    - `CLOUDFLARE_ACCOUNT_ID=""`
    - `CLOUDFLARE_ACCESS_KEY_ID=""`
    - `CLOUDFLARE_SECRET_ACCESS_KEY=""`
    - `CLOUDFLARE_BUCKET=""`
    - `CLOUDFLARE_PUBLIC_URL=""`
- **Scripts**: Script `db:migrate` no `package.json` para executar as migrations do Drizzle.
- **Infraestrutura**: Construção de um `Dockerfile` seguindo boas práticas para gerar a imagem da aplicação.
- **Segurança/Acesso**: Habilitar CORS na aplicação.