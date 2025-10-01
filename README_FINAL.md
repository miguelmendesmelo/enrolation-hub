# 🎮 ENROLATION HUB

**Plataforma de jogos casual com estética RGB retro para enrolar no trabalho!** 😄

![Status](https://img.shields.io/badge/Status-PRONTO-brightgreen?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🎯 O QUE É ISSO?

Um site de jogos onde você e seus colegas podem:

- ✅ **Jogar 2048** e ganhar pontos
- ✅ **Cuidar do Pet Virtual** da equipe (todos compartilham o mesmo pet!)
- ✅ **Competir no Ranking** global
- ✅ **Ganhar Badges** e conquistas
- ✅ **Sem email** - só username e senha

## 🎨 Estética

- **Cores**: RGB Retro (Magenta, Cyan, Verde Neon) + Bege
- **Fonte**: Courier New (monospace retro)
- **Vibe**: Anos 80/90, terminal hacker, neon glow

---

## 🚀 DEPLOY RÁPIDO (3 passos)

### 1️⃣ Configure o Supabase (5 min)

1. Crie conta em [supabase.com](https://supabase.com)
2. Crie novo projeto
3. **IMPORTANTE**: Vá em Authentication → Providers → Email → **DESMARQUE "Confirm email"**
4. Execute o SQL que está no arquivo `supabase-schema.sql`
5. Copie a URL e a chave anon

### 2️⃣ Faça Push pro GitHub (2 min)

```bash
git init
git add .
git commit -m "🚀 ENROLATION HUB"
git remote add origin https://github.com/seu-usuario/enrolation-hub.git
git push -u origin main
```

### 3️⃣ Deploy no Vercel (3 min)

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório do GitHub
3. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em Deploy
5. **PRONTO!** Copie o link e compartilhe!

**📖 Guia Completo:** Veja `DEPLOY_VERCEL.md` para passo a passo detalhado

---

## 💻 Rodar Localmente

```bash
# 1. Instalar dependências (já feito)
npm install

# 2. Configurar .env.local
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave

# 3. Rodar
npm run dev

# Abra http://localhost:3000
```

---

## 🎮 Como Funciona?

### Para Usuários:

1. **Acesse o link** do site
2. **Crie conta** (só username + senha)
3. **Jogue 2048** e ganhe pontos
4. **Cuide do Pet** da equipe (todos veem o mesmo pet!)
5. **Suba no Ranking** competindo com os colegas

### Sistema de Pontos:

- **2048**: 1 ponto a cada 100 de score
- **Pet**: Ganhe badge "Guardião do Pet" com 10 interações
- **Badges**: Desbloqueie conquistas jogando

### Pet Virtual:

- **Compartilhado** por toda a equipe
- **Felicidade**: 0-100 (decai 2pts/hora)
- **Ações**: Alimentar (+15), Brincar (+10), Carinho (+5)
- **Cooldown**: 30 minutos por usuário

---

## 📁 Estrutura

```
enrolation-hub/
├── app/
│   ├── (auth)/          # Login e Registro (sem email!)
│   ├── (game)/          # Dashboard, Pet, Ranking, Perfil
│   └── api/             # APIs do pet e pontuação
├── components/          # Componentes reutilizáveis
├── lib/                 # Lógica dos jogos e Supabase
└── supabase-schema.sql  # Schema completo do banco
```

---

## 🎨 Paleta de Cores

```css
/* RGB Retro */
--retro-red: #FF0040
--retro-green: #00FF41
--retro-blue: #0080FF
--retro-cyan: #00FFFF
--retro-magenta: #FF00FF
--retro-yellow: #FFFF00

/* Beges */
--beige-100: #FAF6EE
--beige-500: #D4AF7A

/* Escuros */
--retro-dark: #1A1A1A
--retro-darker: #0D0D0D
```

---

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e auth
- **Vercel** - Hosting (grátis!)

---

## 🎯 Features Implementadas

- ✅ Autenticação sem email (só username + senha)
- ✅ Dashboard com cards dos jogos
- ✅ Jogo 2048 completo e funcional
- ✅ Pet Virtual compartilhado em tempo real
- ✅ Sistema de Ranking global
- ✅ Perfil com estatísticas e badges
- ✅ Design RGB retro + bege
- ✅ Responsivo (mobile + desktop)

## 🚧 Para Implementar (Opcional)

- ⏳ Mais jogos (Sudoku, Campo Minado, etc.)
- ⏳ Jogos multiplayer 1v1
- ⏳ Chat entre jogadores
- ⏳ Notificações de desafios

---

## 📖 Documentação

- **`DEPLOY_VERCEL.md`** - Guia completo de deploy (LEIA ESTE!)
- **`supabase-schema.sql`** - Schema do banco de dados
- **`.env.local.example`** - Exemplo de variáveis

---

## 🤝 Compartilhar com o Time

Depois do deploy, mande essa mensagem:

```
🎮 ENROLATION HUB tá no ar!

Link: https://seu-site.vercel.app

Como usar:
1. Clique no link
2. Crie sua conta (só username + senha, sem email!)
3. Jogue 2048 e ganhe pontos
4. Cuide do nosso Pet da equipe
5. Compete no ranking!

Vamos enrolar juntos! 😄🚀
```

---

## ⚠️ IMPORTANTE

### Antes de Fazer Deploy:

1. ✅ **Desabilite a confirmação de email no Supabase**
   - Authentication → Providers → Email → Desmarcar "Confirm email"

2. ✅ **Execute o SQL completo**
   - Copie TODO o conteúdo de `supabase-schema.sql`

3. ✅ **Configure as variáveis de ambiente no Vercel**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎉 Pronto!

Seu **ENROLATION HUB** está pronto para o deploy!

**O link do site será algo como:**
```
https://enrolation-hub-xxxx.vercel.app
```

**Esse é o link que você passa pros seus colegas!** 🚀

---

Feito com ❤️ e ☕ para enrolar no trabalho! 😄
