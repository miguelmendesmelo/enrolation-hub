/**
 * Pet Page
 * Interactive team pet with happiness system
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HeartIcon, SparklesIcon, CakeIcon } from '@heroicons/react/24/solid'
import { ClockIcon } from '@heroicons/react/24/outline'

interface PetInteraction {
  id: string
  action: string
  happiness_change: number
  created_at: string
  profiles: {
    username: string
  }
}

export default function PetPage() {
  const [happiness, setHappiness] = useState(100)
  const [interactions, setInteractions] = useState<PetInteraction[]>([])
  const [loading, setLoading] = useState(false)
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchPetStatus()

    // Subscribe to pet status changes
    const channel = supabase
      .channel('pet_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pet_status' }, () => {
        fetchPetStatus()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pet_interactions' }, () => {
        fetchPetStatus()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPetStatus = async () => {
    const response = await fetch('/api/pet/status')
    const data = await response.json()

    if (data.happiness !== undefined) {
      setHappiness(data.happiness)
      setInteractions(data.interactions || [])
    }
  }

  const handleInteraction = async (action: string) => {
    setLoading(true)
    setCooldownMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/pet/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCooldownMessage(data.error)
      } else {
        setSuccessMessage(`+${data.change} felicidade! 🎉`)
        fetchPetStatus()

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (error) {
      console.error('Interaction error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPetState = () => {
    if (happiness > 70) return { emoji: '😺', state: 'Feliz', color: 'text-green-500' }
    if (happiness >= 30) return { emoji: '😐', state: 'Normal', color: 'text-yellow-500' }
    return { emoji: '😿', state: 'Triste', color: 'text-red-500' }
  }

  const petState = getPetState()

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      feed: 'Alimentou',
      play: 'Brincou',
      pet: 'Fez carinho',
    }
    return labels[action] || action
  }

  const getActionIcon = (action: string) => {
    if (action === 'feed') return '🍔'
    if (action === 'play') return '🎾'
    return '💕'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🐱 Pet da Equipe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pet Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Pet Character */}
            <div className="text-center mb-6">
              <div className="text-9xl mb-4 animate-bounce">{petState.emoji}</div>
              <h2 className={`text-2xl font-bold ${petState.color}`}>{petState.state}</h2>
            </div>

            {/* Happiness Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Felicidade</span>
                <span className="text-sm font-bold text-orange-600">{happiness}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    happiness > 70
                      ? 'bg-gradient-to-r from-green-400 to-green-500'
                      : happiness >= 30
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                      : 'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${happiness}%` }}
                />
              </div>
            </div>

            {/* Messages */}
            {cooldownMessage && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                {cooldownMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium text-center">
                {successMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleInteraction('feed')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <CakeIcon className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-gray-700">Alimentar</span>
                <span className="text-xs text-orange-600">+15</span>
              </button>

              <button
                onClick={() => handleInteraction('play')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <SparklesIcon className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-gray-700">Brincar</span>
                <span className="text-xs text-blue-600">+10</span>
              </button>

              <button
                onClick={() => handleInteraction('pet')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-6 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <HeartIcon className="w-8 h-8 text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold text-gray-700">Carinho</span>
                <span className="text-xs text-pink-600">+5</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              ⏱️ Cooldown: 30 minutos entre ações
            </p>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atividades Recentes</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {interactions.length > 0 ? (
              interactions.map((interaction) => (
                <div key={interaction.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getActionIcon(interaction.action)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">
                      {interaction.profiles?.username || 'Jogador'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getActionLabel(interaction.action)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(interaction.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">
                    +{interaction.happiness_change}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma atividade ainda
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
