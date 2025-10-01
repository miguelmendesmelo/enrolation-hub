# 🎮 Enrolation Hub

Uma plataforma de jogos casuais com sistema de pontuação, ranking e pet virtual da equipe. Construída com Next.js 14, Supabase e Tailwind CSS.

![Enrolation Hub](https://img.shields.io/badge/Next.js-14+-black?style=flat&logo=next.js)
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


Desenvolvido para aprendizado e diversão!

---

**Divirta-se jogando! 🎮🎉**
