# ⚠️ IMPORTANTE - LEIA ANTES DE INICIAR

## 🚨 Configuração Obrigatória

Antes de rodar o projeto, você **DEVE** configurar o Supabase. O projeto não funcionará sem isso!

### Por que o build falha?

O erro que você vê é **NORMAL** e esperado. Acontece porque o arquivo `.env.local` contém:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Esses são **placeholders** (valores de exemplo). Você precisa substituí-los pelas suas credenciais reais do Supabase.

## ✅ Solução em 3 Passos

### 1. Crie um projeto no Supabase (GRATUITO)

1. Acesse: https://supabase.com
2. Clique em "Start your project" ou "New Project"
3. Faça login/registre-se (pode usar GitHub)
4. Crie um novo projeto:
   - Nome: `strategi-games`
   - Senha do BD: Escolha uma senha forte
   - Região: South America (São Paulo)
5. **Aguarde 2 minutos** enquanto o projeto é criado

### 2. Execute o Script SQL

1. No dashboard do Supabase, clique em "SQL Editor" (menu lateral)
2. Clique em "New query"
3. Abra o arquivo `supabase-schema.sql` deste projeto
4. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
5. Cole no editor SQL
6. Clique em "Run" (ou Ctrl+Enter)
7. Aguarde até ver "Success"

### 3. Configure as Variáveis

1. No Supabase, vá em Settings → API
2. Copie:
   - Project URL
   - anon/public key
3. Abra `.env.local` e substitua:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-url-real-aqui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-real-aqui-começando-com-eyJ
```

4. Salve o arquivo

## 🚀 Agora Sim, Rode o Projeto!

```bash
npm run dev
```

Abra http://localhost:3000 e tudo funcionará!

## 📚 Guias Disponíveis

- **QUICKSTART.md** - Guia rápido passo a passo (5-10 min)
- **PARA_VOCE.md** - Explicação do que foi criado
- **README.md** - Documentação completa
- **COMANDOS.md** - Lista de comandos úteis

## 🎯 O que fazer primeiro?

1. ✅ Configure o Supabase (obrigatório)
2. ✅ Rode `npm run dev`
3. ✅ Abra http://localhost:3000
4. ✅ Crie uma conta
5. ✅ Jogue 2048
6. ✅ Interaja com o pet
7. ✅ Veja o ranking

## ❓ Perguntas Frequentes

### Q: O build vai sempre falhar?
A: Não! Depois de configurar o Supabase corretamente, o build funcionará.

### Q: Preciso pagar pelo Supabase?
A: Não! O plano gratuito é mais que suficiente para este projeto.

### Q: Posso usar outro banco de dados?
A: Teoricamente sim, mas precisaria reescrever muita coisa. Recomendo usar Supabase.

### Q: Quanto tempo leva a configuração?
A: 5-10 minutos no máximo.

## 🆘 Precisa de Ajuda?

1. Leia o **QUICKSTART.md** - tem o passo a passo visual
2. Leia o **README.md** - tem mais detalhes
3. Veja o **PARA_VOCE.md** - entenda o que foi criado

---

**Não pule a configuração do Supabase! É rápido e gratuito. Sem isso, nada funcionará.** 🚀
