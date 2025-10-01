# 🛠️ Comandos Úteis - Strategi Games

## 📦 Gerenciamento do Projeto

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Servidor estará em http://localhost:3000
# Hot reload ativo - salve e veja as mudanças instantaneamente
```

### Build e Produção
```bash
# Criar build de produção
npm run build

# Rodar build de produção localmente
npm start

# Limpar cache e node_modules
rm -rf .next node_modules
npm install
```

### Lint e Formatação
```bash
# Rodar ESLint
npm run lint

# Fix automático de problemas de lint
npm run lint -- --fix
```

## 🗄️ Supabase

### Acessar Dashboard
```bash
# Abra no navegador
https://app.supabase.com
```

### Comandos úteis SQL (executar no SQL Editor do Supabase)

#### Ver todos os usuários
```sql
SELECT
  p.username,
  us.total_points,
  us.games_played,
  us.games_won
FROM profiles p
LEFT JOIN user_stats us ON p.id = us.user_id
ORDER BY us.total_points DESC;
```

#### Ver status do pet
```sql
SELECT * FROM pet_status;
```

#### Ver últimas interações com o pet
```sql
SELECT
  pi.action,
  pi.happiness_change,
  p.username,
  pi.created_at
FROM pet_interactions pi
JOIN profiles p ON pi.user_id = p.id
ORDER BY pi.created_at DESC
LIMIT 10;
```

#### Ver ranking completo
```sql
SELECT
  p.username,
  us.total_points,
  us.games_won,
  us.games_played,
  ROUND((us.games_won::decimal / NULLIF(us.games_played, 0)) * 100, 2) as win_rate
FROM user_stats us
JOIN profiles p ON us.user_id = p.id
ORDER BY us.total_points DESC;
```

#### Resetar felicidade do pet
```sql
UPDATE pet_status
SET happiness = 100,
    last_updated = NOW();
```

#### Limpar cooldowns (para testar)
```sql
DELETE FROM user_pet_cooldowns;
```

#### Ver todos os badges
```sql
SELECT
  p.username,
  ub.badge_type,
  ub.earned_at
FROM user_badges ub
JOIN profiles p ON ub.user_id = p.id
ORDER BY ub.earned_at DESC;
```

## 🧹 Limpeza e Reset

### Limpar dados de teste (CUIDADO!)
```sql
-- Apagar todas as interações do pet
DELETE FROM pet_interactions;

-- Apagar todos os scores
DELETE FROM game_scores;

-- Resetar stats dos usuários
UPDATE user_stats
SET total_points = 0,
    games_played = 0,
    games_won = 0,
    games_lost = 0;

-- Apagar badges
DELETE FROM user_badges;
```

### Reset completo do banco (MUITO CUIDADO!)
```sql
-- Isso apaga TUDO, incluindo usuários!
-- Use apenas se quiser recomeçar do zero

TRUNCATE TABLE pet_interactions CASCADE;
TRUNCATE TABLE game_scores CASCADE;
TRUNCATE TABLE user_badges CASCADE;
TRUNCATE TABLE multiplayer_rooms CASCADE;
TRUNCATE TABLE game_history CASCADE;
TRUNCATE TABLE user_pet_cooldowns CASCADE;
TRUNCATE TABLE user_stats CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Resetar pet
UPDATE pet_status SET happiness = 100, last_updated = NOW();
```

## 🐛 Debug

### Ver logs do servidor
```bash
# Os logs aparecem automaticamente no terminal onde você rodou npm run dev
# Pressione Ctrl+C para parar o servidor
```

### Ver logs do navegador
```
1. Abra o app no navegador
2. Pressione F12 (ou Ctrl+Shift+I)
3. Vá na aba "Console"
4. Veja erros e logs
```

### Limpar cache do navegador
```
1. Pressione Ctrl+Shift+Delete
2. Selecione "Cookies" e "Cache"
3. Clique em "Clear data"
```

### Ver estado das variáveis de ambiente
```bash
# No terminal
cat .env.local

# Certifique-se de que as URLs estão corretas
```

## 📊 Análise de Performance

### Ver tamanho do build
```bash
npm run build

# Você verá:
# - Tamanho de cada página
# - First Load JS
# - Arquivos estáticos
```

### Análise de bundle
```bash
# Instalar ferramenta
npm install @next/bundle-analyzer

# Adicionar ao next.config.ts:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(nextConfig)

# Rodar análise
ANALYZE=true npm run build
```

## 🔐 Segurança

### Ver políticas RLS ativas
```sql
-- No Supabase SQL Editor
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public';
```

### Testar autenticação
```bash
# No console do navegador (F12)
const { data: { user } } = await supabase.auth.getUser()
console.log(user)
```

## 🚀 Deploy

### Deploy no Vercel (linha de comando)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Variáveis de ambiente no Vercel
```bash
# Adicionar variável
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Listar variáveis
vercel env ls

# Remover variável
vercel env rm NEXT_PUBLIC_SUPABASE_URL
```

## 📦 Dependências

### Instalar novas dependências
```bash
# Produção
npm install nome-do-pacote

# Desenvolvimento
npm install -D nome-do-pacote

# Exemplos úteis:
npm install react-hot-toast      # Notificações
npm install framer-motion        # Animações
npm install date-fns             # Manipulação de datas
```

### Atualizar dependências
```bash
# Ver pacotes desatualizados
npm outdated

# Atualizar todos
npm update

# Atualizar um específico
npm update next
```

## 🔄 Git

### Inicializar repositório
```bash
git init
git add .
git commit -m "Initial commit: Strategi Games"
```

### Criar .gitignore adicional
```bash
# Já existe, mas se quiser adicionar mais:
echo "*.log" >> .gitignore
echo ".vercel" >> .gitignore
```

### Commits úteis
```bash
# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Add: Feature X"

# Push
git push origin main

# Ver status
git status

# Ver histórico
git log --oneline
```

## 🧪 Testes (para quando implementar)

### Setup de testes
```bash
# Instalar Jest e Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom

# Rodar testes
npm test

# Cobertura
npm test -- --coverage
```

## 💾 Backup

### Backup do banco de dados
```
1. No Supabase Dashboard
2. Settings → Database
3. Database Settings → Backups
4. Download backup
```

### Backup do código
```bash
# Fazer backup local
tar -czf backup-$(date +%Y%m%d).tar.gz strategi-games/

# Ou usar Git
git push origin main
```

## 🎯 Atalhos do Next.js

```bash
# Forçar rebuild completo
rm -rf .next && npm run dev

# Rodar em porta diferente
PORT=3001 npm run dev

# Modo de produção local
npm run build && npm start
```

## 📝 Notas Importantes

### ❌ NUNCA fazer:
```bash
# Commitar .env.local
git add .env.local  # ❌ NUNCA!

# Expor credenciais
# Sempre use variáveis de ambiente
```

### ✅ Sempre fazer:
```bash
# Manter .env.local.example atualizado
# Fazer backup regularmente
# Testar antes de fazer deploy
# Ler os logs de erro
```

---

## 🆘 Comandos de Emergência

### App não inicia
```bash
# 1. Parar tudo
killall node

# 2. Limpar tudo
rm -rf .next node_modules

# 3. Reinstalar
npm install

# 4. Rodar novamente
npm run dev
```

### Banco de dados corrompido
```sql
-- 1. Backup dos dados importantes
-- 2. Executar supabase-schema.sql novamente
-- 3. Restaurar dados do backup
```

### Erro de TypeScript
```bash
# Limpar cache do TypeScript
rm -rf .next
npx tsc --noEmit

# Ver erros específicos
npm run build
```

---

**Dica**: Salve este arquivo! Esses comandos vão ser úteis durante todo o desenvolvimento. 💡
