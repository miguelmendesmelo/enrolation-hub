# 🚀 GUIA COMPLETO DE DEPLOY - ENROLATION HUB

## Este é o guia que você precisa! Siga passo a passo.

---

## 📋 PARTE 1: CONFIGURAR SUPABASE (10 minutos)

### Passo 1: Criar Projeto no Supabase

1. Acesse: **https://supabase.com**
2. Clique em **"New Project"**
3. Preencha:
   - **Name**: `enrolation-hub`
   - **Database Password**: Escolha uma senha FORTE (anote!)
   - **Region**: `South America (São Paulo)`
4. Clique em **"Create new project"**
5. **AGUARDE 2-3 MINUTOS** (toma um café ☕)

### Passo 2: Desabilitar Confirmação de Email

**IMPORTANTE:** Faça isso ANTES de executar o SQL!

1. No Supabase, vá em **Authentication** (menu lateral)
2. Clique em **Providers**
3. Clique em **Email**
4. **DESMARQUE** a opção "Confirm email"
5. Clique em **Save**

### Passo 3: Executar o Schema SQL

1. No Supabase, clique em **SQL Editor** (menu lateral, ícone 📝)
2. Clique em **"New query"**
3. Abra o arquivo `supabase-schema.sql` do projeto
4. **COPIE TODO o conteúdo** (Ctrl+A, Ctrl+C)
5. **COLE** no editor SQL do Supabase
6. Clique em **"Run"** (ou Ctrl+Enter)
7. Aguarde até ver: "Success. No rows returned" ✅

### Passo 4: Pegar as Credenciais

1. No Supabase, vá em **Settings** (⚙️ no menu lateral)
2. Clique em **API**
3. Você verá duas coisas importantes:

```
Project URL: https://xxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **COPIE AMBOS** e guarde em um bloco de notas temporário

---

## 📦 PARTE 2: PREPARAR O CÓDIGO (2 minutos)

### Passo 1: Testar Localmente (Opcional mas Recomendado)

```bash
# No terminal, dentro da pasta strategi-games:

# 1. Edite o .env.local com suas credenciais:
nano .env.local

# Cole:
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui

# 2. Teste localmente:
npm run dev

# 3. Abra http://localhost:3000 e teste criar uma conta
# 4. Se funcionou, pode fazer deploy! Pressione Ctrl+C para parar
```

### Passo 2: Criar Repositório no GitHub

```bash
# Se ainda não criou o repositório Git:
git init
git add .
git commit -m "🚀 ENROLATION HUB - Ready for deploy"

# Vá em https://github.com/new e crie um novo repositório:
# - Nome: enrolation-hub
# - Private ou Public (sua escolha)
# - NÃO adicione README, .gitignore ou license

# Depois execute:
git remote add origin https://github.com/SEU-USERNAME/enrolation-hub.git
git branch -M main
git push -u origin main
```

---

## 🌐 PARTE 3: DEPLOY NO VERCEL (3 minutos)

### Passo 1: Conectar ao Vercel

1. Acesse: **https://vercel.com**
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório **enrolation-hub**
5. Clique em **"Import"**

### Passo 2: Configurar Variáveis de Ambiente

**ATENÇÃO:** Este é o passo MAIS IMPORTANTE!

1. Na tela de configuração, clique em **"Environment Variables"**
2. Adicione as duas variáveis:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://sua-url-do-supabase.supabase.co
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sua_chave_anon_completa_aqui
```

3. Certifique-se de que ambas estão marcadas para **Production**, **Preview** e **Development**

### Passo 3: Deploy!

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos (o Vercel vai:
   - Instalar dependências
   - Buildar o projeto
   - Fazer deploy)
3. Quando terminar, você verá: **"Congratulations! 🎉"**

### Passo 4: Pegar o Link do Site

1. Você verá algo como: `https://enrolation-hub-xxxx.vercel.app`
2. Clique no link para abrir
3. **ESTE É O LINK QUE VOCÊ VAI PASSAR PROS SEUS COLEGAS!** 🎉

---

## ✅ PARTE 4: TESTAR O SITE

### Teste Completo:

1. Abra o link do Vercel
2. Clique em **"CRIAR CONTA"**
3. Escolha um username (ex: "miguel")
4. Escolha uma senha (mínimo 6 caracteres)
5. Confirme a senha
6. Clique em **"CRIAR CONTA"**
7. Você deve ser redirecionado para o Dashboard! ✅

### Se Funcionou:

🎊 **PARABÉNS!** Seu site está no ar!

**Compartilhe o link com seus colegas:**
```
https://enrolation-hub-xxxx.vercel.app
```

### Se Não Funcionou:

Verifique:
1. ✅ Você desabilitou a confirmação de email no Supabase?
2. ✅ As variáveis de ambiente estão corretas?
3. ✅ Você executou o SQL completo no Supabase?

---

## 🔧 CONFIGURAÇÕES EXTRAS (Opcional)

### Personalizar o Domínio

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione um domínio customizado (se tiver)
3. Ou use o domínio `.vercel.app` que fica bonito!

### Ver Logs

1. No Vercel, clique em **Deployments**
2. Clique no deployment mais recente
3. Veja os logs se algo deu errado

### Fazer Novo Deploy (Quando Mudar Código)

```bash
# Só fazer push pro GitHub:
git add .
git commit -m "Atualização do ENROLATION HUB"
git push

# O Vercel detecta automaticamente e faz novo deploy!
```

---

## 📱 COMPARTILHAR COM OS COLEGAS

### Mande essa mensagem:

```
🎮 ENROLATION HUB tá no ar!

Link: https://enrolation-hub-xxxx.vercel.app

Como usar:
1. Clique no link
2. Crie sua conta (só username + senha)
3. Jogue 2048 e ganhe pontos
4. Cuide do Pet da equipe
5. Compete no ranking!

Vamos enrolar juntos! 😄
```

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Invalid Supabase URL"
✅ **Solução**: Verifique se adicionou as variáveis de ambiente no Vercel

### Erro: "Email not confirmed"
✅ **Solução**: Vá no Supabase → Authentication → Providers → Email → **Desmarque "Confirm email"**

### Erro 500 ao criar conta
✅ **Solução**: Verifique se executou o SQL completo no Supabase

### Site fica carregando infinito
✅ **Solução**: Limpe o cache do navegador (Ctrl+Shift+Delete)

---

## 🎯 CHECKLIST FINAL

Antes de compartilhar com os colegas:

- [ ] ✅ Supabase configurado e SQL executado
- [ ] ✅ Confirmação de email desabilitada
- [ ] ✅ Variáveis de ambiente no Vercel
- [ ] ✅ Deploy bem-sucedido
- [ ] ✅ Testei criar uma conta
- [ ] ✅ Testei jogar 2048
- [ ] ✅ Testei interagir com o pet
- [ ] ✅ Testei o ranking

---

## 🎉 PRONTO!

Seu **ENROLATION HUB** está no ar 24/7!

- ✅ Funciona em qualquer dispositivo
- ✅ Não depende do seu notebook
- ✅ Link público para compartilhar
- ✅ Totalmente grátis
- ✅ Deploy automático quando você faz push

**O LINK DO SITE É:**
```
https://enrolation-hub-xxxx.vercel.app
```

**Substitua "xxxx" pelo que aparece no seu Vercel!**

---

**Dica Final:** Adicione o link aos favoritos e compartilhe com o time! 🚀
