# 🎮 Strategi Games

Uma plataforma de jogos casuais com sistema de pontuação, ranking e pet virtual da equipe. Construída com Next.js 14, Supabase e Tailwind CSS.

![Strategi Games](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?style=flat&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3ECF8E?style=flat&logo=supabase)

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Configuração Local](#configuração-local)
- [Configuração do Supabase](#configuração-do-supabase)
- [Jogos Disponíveis](#jogos-disponíveis)
- [Sistema de Pontuação](#sistema-de-pontuação)
- [Pet Virtual](#pet-virtual)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)

## ✨ Características

### 🎯 Jogos Implementados
- **2048** - Jogo de puzzle deslizante clássico
- Sudoku (em desenvolvimento)
- Campo Minado (em desenvolvimento)
- Quebra-Cabeça Deslizante (em desenvolvimento)
- Blackjack (em desenvolvimento)

### 🏆 Sistema de Ranking
- Ranking global com top 20 jogadores
- Estatísticas detalhadas por jogador
- Taxa de vitórias e derrotas
- Sistema de pontuação unificado

### 🐱 Pet Virtual da Equipe
- Pet compartilhado por toda a equipe
- Sistema de felicidade (0-100)
- Ações: Alimentar (+15), Brincar (+10), Carinho (+5)
- Decay automático de felicidade (2 pontos/hora)
- Cooldown de 30 minutos por usuário
- Log de atividades em tempo real

### 🎖️ Badges e Conquistas
- **Primeira Vitória** - Ganhe sua primeira partida
- **10 Jogos** - Jogue 10 partidas
- **Campeão da Semana** - Seja o melhor da semana
- **Guardião do Pet** - Interaja 10x com o pet
- **100 Pontos** - Alcance 100 pontos
- **Mestre Multiplayer** - Ganhe 5 partidas multiplayer

### 👤 Perfil do Usuário
- Estatísticas pessoais
- Histórico de jogos
- Badges desbloqueados
- Posição no ranking

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Realtime**: Supabase Realtime
- **Deploy**: Vercel
- **Ícones**: Heroicons

## 🚀 Configuração Local

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no Supabase (gratuita)

### Passo 1: Clone o Repositório

```bash
git clone <seu-repositorio>
cd strategi-games
```

### Passo 2: Instale as Dependências

```bash
npm install
```

### Passo 3: Configure as Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### Passo 4: Execute o Servidor de Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🗄️ Configuração do Supabase

### 1. Crie um Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (se ainda não tiver)
3. Clique em "New Project"
4. Escolha um nome e senha para o banco de dados
5. Aguarde a criação do projeto (1-2 minutos)

### 2. Configure o Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor SQL e clique em "Run"
4. Aguarde a execução (isso criará todas as tabelas, índices e políticas RLS)

### 3. Obtenha as Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Cole no arquivo `.env.local`

### 4. Habilite Realtime (Opcional mas Recomendado)

1. Vá em **Database** → **Replication**
2. Habilite replicação para as tabelas:
   - `multiplayer_rooms`
   - `pet_status`
   - `pet_interactions`
   - `user_stats`

## 🎮 Jogos Disponíveis

### 2048

**Como Jogar:**
- Use as setas do teclado (↑ ↓ ← →) para mover os blocos
- Quando dois blocos com o mesmo número se tocam, eles se fundem
- Objetivo: criar um bloco com o número 2048

**Pontuação:**
- 1 ponto no ranking a cada 100 pontos de score
- Exemplo: 800 pontos no jogo = 8 pontos no ranking

**Dicas:**
- Mantenha os números maiores em um canto
- Evite movimentos aleatórios
- Planeje suas jogadas com antecedência

### Sudoku (Em Desenvolvimento)

**Pontuação:**
- Fácil: 10 pontos
- Médio: 25 pontos
- Difícil: 50 pontos
- Bônus de 20% se completar sem erros

### Campo Minado (Em Desenvolvimento)

**Pontuação:**
- Base: 30 pontos por vitória
- Bônus de tempo: quanto mais rápido, mais pontos

### Quebra-Cabeça Deslizante (Em Desenvolvimento)

**Pontuação:**
- Base: 20 pontos
- Penalidade: -1 ponto a cada 10 segundos

### Blackjack (Em Desenvolvimento)

**Pontuação:**
- Vitória: 5 pontos
- Blackjack natural: 10 pontos

## 📊 Sistema de Pontuação

### Como Ganhar Pontos

Cada jogo tem seu próprio sistema de pontuação:

| Jogo | Pontos | Condições |
|------|--------|-----------|
| 2048 | 1pt/100 | Score final |
| Sudoku | 10-50 | Por dificuldade |
| Campo Minado | 30+ | Vitória + bônus tempo |
| Quebra-Cabeça | ~20 | Base - tempo |
| Blackjack | 5-10 | Por vitória |
| Xadrez | 50 | Vitória |
| Damas | 30 | Vitória |
| Gamão | 40 | Vitória |
| Ludo | 25 | Vitória |

### Ranking

- O ranking é atualizado em tempo real
- Baseado no total de pontos acumulados
- Top 20 jogadores são exibidos
- Estatísticas incluem: vitórias, derrotas, taxa de vitória

## 🐱 Pet Virtual

### Como Funciona

O pet é **compartilhado por toda a equipe** e tem uma barra de felicidade que varia de 0 a 100.

### Ações Disponíveis

- **Alimentar** 🍔: +15 de felicidade
- **Brincar** 🎾: +10 de felicidade
- **Carinho** 💕: +5 de felicidade

### Regras

- Cooldown de **30 minutos** por usuário entre ações
- Felicidade decai **2 pontos por hora** automaticamente
- Estados do pet:
  - **Feliz** 😺: > 70 pontos
  - **Normal** 😐: 30-70 pontos
  - **Triste** 😿: < 30 pontos

### Badge Especial

Interaja 10 vezes com o pet para ganhar o badge **"Guardião do Pet"** 🐱

## 🚢 Deploy

### Deploy no Vercel (Recomendado)

1. Faça push do código para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <seu-repositorio>
git push -u origin main
```

2. Acesse [vercel.com](https://vercel.com)
3. Clique em "New Project"
4. Importe seu repositório do GitHub
5. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clique em "Deploy"
7. Aguarde o deploy (1-2 minutos)
8. Acesse o link fornecido pelo Vercel

### Configurações Adicionais

- O Vercel detecta automaticamente que é um projeto Next.js
- Não é necessário configurar build commands
- Deploy automático a cada push na branch main

## 📁 Estrutura do Projeto

```
strategi-games/
├── app/
│   ├── (auth)/              # Páginas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (game)/              # Páginas do jogo (autenticadas)
│   │   ├── dashboard/       # Home
│   │   ├── pet/             # Pet virtual
│   │   ├── games/           # Jogos single-player
│   │   │   ├── 2048/
│   │   │   ├── sudoku/
│   │   │   └── ...
│   │   ├── multiplayer/     # Jogos multiplayer
│   │   ├── ranking/         # Leaderboard
│   │   └── profile/         # Perfil do usuário
│   ├── api/                 # API routes
│   │   ├── pet/
│   │   ├── games/
│   │   └── scores/
│   └── layout.tsx
├── components/
│   ├── ui/                  # Componentes UI reutilizáveis
│   ├── games/               # Componentes específicos de jogos
│   ├── pet/                 # Componentes do pet
│   └── layout/              # Layout components (Sidebar, Header)
├── lib/
│   ├── supabase/            # Configuração Supabase
│   ├── gameLogic/           # Lógica dos jogos
│   └── utils/               # Utilitários
├── public/                  # Arquivos estáticos
└── supabase-schema.sql      # Schema do banco de dados
```

## 🎨 Paleta de Cores

- **Primária**: `#FF6B35` (Laranja Vibrante)
- **Secundária**: `#F7931E` (Laranja Médio)
- **Background**: `#FFFFFF` (Branco)
- **Surface**: `#F5F5F5` (Cinza Claro)
- **Text**: `#2C3E50` (Cinza Escuro)
- **Accent**: `#FFA07A` (Laranja Claro para hovers)

## 🤝 Contribuindo

Este é um projeto educacional. Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

## 📝 TODO

### Jogos a Implementar
- [ ] Sudoku com gerador de puzzles
- [ ] Campo Minado completo
- [ ] Quebra-Cabeça Deslizante
- [ ] Blackjack com sistema de apostas
- [ ] Xadrez com validação completa
- [ ] Damas (regras brasileiras)
- [ ] Gamão completo
- [ ] Ludo para 2 jogadores

### Features Adicionais
- [ ] Sistema de notificações em tempo real
- [ ] Chat durante jogos multiplayer
- [ ] Dark mode
- [ ] Histórico detalhado de partidas
- [ ] Estatísticas por jogo
- [ ] Sons e efeitos sonoros
- [ ] Animações mais elaboradas
- [ ] PWA (Progressive Web App)
- [ ] Sistema de amizades

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido para aprendizado e diversão!

---

**Divirta-se jogando! 🎮🎉**
