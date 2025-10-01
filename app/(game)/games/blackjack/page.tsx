/**
 * Blackjack Game Page
 * Classic 21 card game against dealer
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Card = {
  suit: string
  value: string
  numericValue: number
}

type GameState = 'betting' | 'playing' | 'dealer' | 'finished'

export default function BlackjackPage() {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameState, setGameState] = useState<GameState>('betting')
  const [result, setResult] = useState<'win' | 'lose' | 'draw' | null>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [wins, setWins] = useState(0)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_type', 'blackjack')

      if (data) {
        setGamesPlayed(data.length)
        setWins(data.filter(game => game.completed).length)
      }
    }
  }

  const createDeck = (): Card[] => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const deck: Card[] = []

    for (const suit of suits) {
      for (const value of values) {
        let numericValue = 0
        if (value === 'A') {
          numericValue = 11
        } else if (['J', 'Q', 'K'].includes(value)) {
          numericValue = 10
        } else {
          numericValue = parseInt(value)
        }

        deck.push({ suit, value, numericValue })
      }
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    return deck
  }

  const calculateScore = (hand: Card[]): number => {
    let score = 0
    let aces = 0

    for (const card of hand) {
      score += card.numericValue
      if (card.value === 'A') {
        aces++
      }
    }

    // Adjust for aces
    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }

  const startGame = () => {
    const newDeck = createDeck()
    const player = [newDeck.pop()!, newDeck.pop()!]
    const dealer = [newDeck.pop()!, newDeck.pop()!]

    setDeck(newDeck)
    setPlayerHand(player)
    setDealerHand(dealer)
    setPlayerScore(calculateScore(player))
    setDealerScore(calculateScore([dealer[0]]))
    setGameState('playing')
    setResult(null)
    setMessage('')

    // Check for natural blackjack
    const playerBlackjack = calculateScore(player) === 21
    const dealerBlackjack = calculateScore(dealer) === 21

    if (playerBlackjack || dealerBlackjack) {
      setDealerScore(calculateScore(dealer))
      if (playerBlackjack && dealerBlackjack) {
        setResult('draw')
        setMessage('Ambos têm Blackjack!')
        setGameState('finished')
        saveScore('draw')
      } else if (playerBlackjack) {
        setResult('win')
        setMessage('Blackjack! Você ganhou!')
        setGameState('finished')
        saveScore('win')
      } else {
        setResult('lose')
        setMessage('Dealer tem Blackjack!')
        setGameState('finished')
        saveScore('lose')
      }
    }
  }

  const hit = () => {
    if (gameState !== 'playing') return

    const newDeck = [...deck]
    const newCard = newDeck.pop()!
    const newHand = [...playerHand, newCard]
    const newScore = calculateScore(newHand)

    setDeck(newDeck)
    setPlayerHand(newHand)
    setPlayerScore(newScore)

    if (newScore > 21) {
      setResult('lose')
      setMessage('Você estourou!')
      setGameState('finished')
      saveScore('lose')
    }
  }

  const stand = () => {
    if (gameState !== 'playing') return
    setGameState('dealer')

    let newDeck = [...deck]
    let newDealerHand = [...dealerHand]
    let newDealerScore = calculateScore(newDealerHand)

    // Dealer must hit until 17 or higher
    while (newDealerScore < 17) {
      const newCard = newDeck.pop()!
      newDealerHand.push(newCard)
      newDealerScore = calculateScore(newDealerHand)
    }

    setDeck(newDeck)
    setDealerHand(newDealerHand)
    setDealerScore(newDealerScore)

    // Determine winner
    if (newDealerScore > 21) {
      setResult('win')
      setMessage('Dealer estourou! Você ganhou!')
      saveScore('win')
    } else if (newDealerScore > playerScore) {
      setResult('lose')
      setMessage('Dealer ganhou!')
      saveScore('lose')
    } else if (newDealerScore < playerScore) {
      setResult('win')
      setMessage('Você ganhou!')
      saveScore('win')
    } else {
      setResult('draw')
      setMessage('Empate!')
      saveScore('draw')
    }

    setGameState('finished')
  }

  const saveScore = async (outcome: 'win' | 'lose' | 'draw') => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const points = outcome === 'win' ? 10 : outcome === 'draw' ? 5 : 0

      await supabase.from('game_scores').insert({
        user_id: user.id,
        game_type: 'blackjack',
        score: points,
        points_earned: points,
        completed: outcome === 'win',
      })

      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (stats) {
        await supabase
          .from('user_stats')
          .update({
            total_points: stats.total_points + points,
            games_played: stats.games_played + 1,
            games_won: outcome === 'win' ? stats.games_won + 1 : stats.games_won,
          })
          .eq('user_id', user.id)

        // Check for badges
        if (stats.games_played + 1 === 1 && outcome === 'win') {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: 'first_win',
          })
        }

        if (stats.games_played + 1 >= 10) {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: '10_games',
          })
        }

        if (stats.total_points + points >= 100) {
          await supabase.from('user_badges').upsert({
            user_id: user.id,
            badge_type: '100_points',
          })
        }
      }

      loadStats()
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const renderCard = (card: Card, hidden: boolean = false) => {
    const isRed = card.suit === '♥' || card.suit === '♦'

    if (hidden) {
      return (
        <div className="w-20 h-28 bg-blue-600 rounded-lg border-2 border-blue-700 flex items-center justify-center shadow-lg">
          <div className="text-white text-4xl">?</div>
        </div>
      )
    }

    return (
      <div className="w-20 h-28 bg-white rounded-lg border-2 border-gray-300 p-2 shadow-lg flex flex-col justify-between">
        <div className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
          <div>{card.value}</div>
          <div>{card.suit}</div>
        </div>
        <div className={`text-3xl text-center ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
          {card.suit}
        </div>
        <div className={`text-lg font-bold text-right ${isRed ? 'text-red-600' : 'text-gray-800'}`}>
          <div>{card.suit}</div>
          <div>{card.value}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blackjack</h1>
        <button
          onClick={() => router.push('/games')}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Voltar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-blue-100 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-600">Jogos</p>
            <p className="text-2xl font-bold text-blue-600">{gamesPlayed}</p>
          </div>
          <div className="bg-green-100 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-600">Vitórias</p>
            <p className="text-2xl font-bold text-green-600">{wins}</p>
          </div>
          <div className="bg-purple-100 rounded-lg px-6 py-3 text-center">
            <p className="text-sm text-gray-600">Taxa</p>
            <p className="text-2xl font-bold text-purple-600">
              {gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-green-700 rounded-xl p-8 min-h-[500px]">
          {gameState === 'betting' ? (
            <div className="flex items-center justify-center h-full">
              <button
                onClick={startGame}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-xl px-12 py-6 rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                Começar Jogo
              </button>
            </div>
          ) : (
            <>
              {/* Dealer's Hand */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xl">Dealer</h3>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <span className="text-white font-bold text-lg">
                      {gameState === 'playing' ? '?' : dealerScore}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  {dealerHand.map((card, index) => (
                    <div key={index}>
                      {renderCard(card, gameState === 'playing' && index === 1)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Player's Hand */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-xl">Você</h3>
                  <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                    <span className="text-white font-bold text-lg">{playerScore}</span>
                  </div>
                </div>
                <div className="flex gap-4 justify-center mb-8">
                  {playerHand.map((card, index) => (
                    <div key={index}>{renderCard(card)}</div>
                  ))}
                </div>

                {/* Action Buttons */}
                {gameState === 'playing' && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={hit}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-all"
                    >
                      Hit (Comprar)
                    </button>
                    <button
                      onClick={stand}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition-all"
                    >
                      Stand (Parar)
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Result Message */}
        {gameState === 'finished' && result && (
          <div className={`mt-6 rounded-lg p-6 text-center ${
            result === 'win' ? 'bg-green-50 border border-green-200' :
            result === 'lose' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-xl font-bold mb-2 ${
              result === 'win' ? 'text-green-600' :
              result === 'lose' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {message}
            </p>
            <p className="text-gray-700 mb-4">
              Pontos ganhos: {result === 'win' ? 10 : result === 'draw' ? 5 : 0}
            </p>
            <button
              onClick={startGame}
              className={`font-semibold px-6 py-2 rounded-lg text-white ${
                result === 'win' ? 'bg-green-500 hover:bg-green-600' :
                result === 'lose' ? 'bg-red-500 hover:bg-red-600' :
                'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Como Jogar:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Objetivo: chegar mais perto de 21 que o dealer sem estourar</li>
          <li>• Hit (Comprar): pega mais uma carta</li>
          <li>• Stand (Parar): mantém suas cartas e passa a vez</li>
          <li>• Dealer compra até ter 17 ou mais</li>
          <li>• Vitória: 10pts | Empate: 5pts | Derrota: 0pts</li>
          <li>• Ás vale 11 ou 1 | Figuras (J, Q, K) valem 10</li>
        </ul>
      </div>
    </div>
  )
}
