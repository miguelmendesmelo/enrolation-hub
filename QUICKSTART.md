# 🚀 Quick Start - Strategi Games

Guia rápido para colocar o projeto funcionando em menos de 10 minutos!

## ✅ Checklist Rápido

- [ ] Node.js instalado
- [ ] Dependências instaladas
- [ ] Conta Supabase criada
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor rodando

## 📝 Passo a Passo

### 1️⃣ Prepare o Ambiente (2 minutos)

```bash
# Você já está no diretório certo!
cd /home/miguel/Documents/STRATEGI_GAMES/strategi-games

# As dependências já foram instaladas, mas se precisar:
npm install
```

### 2️⃣ Configure o Supabase (5 minutos)

#### 2.1 Crie um projeto no Supabase

1. Acesse: https://supabase.com
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `strategi-games` (ou qualquer nome)
   - **Database Password**: Escolha uma senha forte (anote!)
   - **Region**: Escolha o mais próximo (South America - São Paulo)
4. Clique em **"Create new project"**
5. **Aguarde 2 minutos** enquanto o projeto é criado

#### 2.2 Configure o Banco de Dados

1. No dashboard do Supabase, clique em **"SQL Editor"** (ícone no menu lateral)
2. Clique em **"New query"**
3. **IMPORTANTE**: Abra o arquivo `supabase-schema.sql` no seu editor
4. Copie TODO o conteúdo do arquivo
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde até aparecer "Success. No rows returned"

#### 2.3 Pegue as Credenciais

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Você verá duas informações importantes:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public**: Uma chave longa começando com `eyJ...`

### 3️⃣ Configure as Variáveis de Ambiente (1 minuto)

1. Abra o arquivo `.env.local` no seu editor
2. Substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...sua_chave_completa_aqui
```

3. Salve o arquivo

### 4️⃣ Rode o Projeto! (10 segundos)

```bash
npm run dev
```

Aguarde até ver:

```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

### 5️⃣ Teste o App

1. Abra o navegador em: http://localhost:3000
2. Você será redirecionado para `/login`
3. Clique em **"Registre-se"**
4. Crie sua conta:
   - Username: Seu nome de jogador
   - Email: Seu email
   - Senha: Mínimo 6 caracteres
5. Clique em **"Criar Conta"**
6. Você será redirecionado para o dashboard! 🎉

## 🎮 O que você pode fazer agora?

### ✅ Funcional e Pronto para Usar:
- ✅ **Login/Registro** - Criar conta e entrar
- ✅ **Dashboard** - Ver todos os jogos disponíveis
- ✅ **Pet Virtual** - Interagir com o pet da equipe
- ✅ **Jogo 2048** - Jogar completamente funcional
- ✅ **Ranking** - Ver o leaderboard global
- ✅ **Perfil** - Ver suas estatísticas e badges
- ✅ **Sistema de Pontos** - Ganhar pontos jogando
- ✅ **Badges** - Desbloquear conquistas

### 🚧 Em Desenvolvimento (estrutura criada, precisam ser implementados):
- ⏳ Sudoku
- ⏳ Campo Minado
- ⏳ Quebra-Cabeça
- ⏳ Blackjack
- ⏳ Jogos Multiplayer (Xadrez, Damas, Gamão, Ludo)

## 🎯 Teste o que está pronto:

1. **Jogue 2048**:
   - No dashboard, clique no card "2048"
   - Use as setas do teclado para jogar
   - Tente alcançar 2048!
   - Sua pontuação será salva automaticamente

2. **Interaja com o Pet**:
   - Clique em "Pet" na sidebar
   - Alimente, brinque ou faça carinho no pet
   - Veja a felicidade aumentar!
   - Aguarde 30 minutos para interagir novamente

3. **Veja seu Ranking**:
   - Clique em "Ranking" na sidebar
   - Veja sua posição e pontuação
   - Compare com outros jogadores

4. **Veja seu Perfil**:
   - Clique em "Perfil" na sidebar
   - Veja suas estatísticas
   - Confira os badges que você ganhou

## 🐛 Problemas Comuns

### Erro: "Invalid login credentials"
- **Solução**: Verifique se o email e senha estão corretos
- Se for novo usuário, clique em "Registre-se"

### Erro: "Failed to fetch"
- **Solução**: Verifique se:
  1. O servidor está rodando (`npm run dev`)
  2. As variáveis de ambiente estão corretas
  3. O projeto Supabase está ativo

### Erro: "Unauthorized"
- **Solução**:
  1. Faça logout
  2. Faça login novamente
  3. Limpe o cache do navegador (Ctrl+Shift+Delete)

### Pet não atualiza
- **Solução**:
  1. Verifique se executou o SQL schema completo
  2. Recarregue a página (F5)

## 📱 Próximos Passos

### Quer implementar mais jogos?

Os jogos restantes têm a estrutura criada. Para implementá-los:

1. **Sudoku**: Criar gerador de puzzles em `lib/gameLogic/sudoku.ts`
2. **Campo Minado**: Implementar lógica em `lib/gameLogic/minesweeper.ts`
3. **Outros**: Seguir o mesmo padrão do 2048

### Quer fazer deploy?

Siga o guia completo no README.md, seção "Deploy"

## 💡 Dicas

- **Desenvolvimento**: O app atualiza automaticamente quando você edita os arquivos
- **Console**: Abra o console do navegador (F12) para ver logs e erros
- **Hot Reload**: O Next.js recarrega a página automaticamente ao salvar
- **Tailwind**: Use classes Tailwind CSS para estilização
- **Supabase**: O dashboard do Supabase mostra todas as tabelas e dados

## 🎉 Tudo Pronto!

Você agora tem:
- ✅ Um app completo funcionando
- ✅ Autenticação segura
- ✅ Banco de dados PostgreSQL
- ✅ Sistema de pontos e ranking
- ✅ Pet virtual interativo
- ✅ Um jogo completamente funcional (2048)

**Divirta-se e bom desenvolvimento! 🚀**

---

Precisa de ajuda? Abra uma issue no GitHub ou consulte o README.md completo.
