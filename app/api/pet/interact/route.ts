/**
 * Pet Interaction API Route
 * Handles pet interactions (feed, play, pet)
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { action } = await request.json()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check cooldown (30 minutes)
    const { data: cooldown } = await supabase
      .from('user_pet_cooldowns')
      .select('last_interaction')
      .eq('user_id', user.id)
      .single()

    if (cooldown) {
      const lastInteraction = new Date(cooldown.last_interaction)
      const now = new Date()
      const diffMinutes = (now.getTime() - lastInteraction.getTime()) / (1000 * 60)

      if (diffMinutes < 30) {
        const remainingMinutes = Math.ceil(30 - diffMinutes)
        return NextResponse.json(
          { error: `Aguarde ${remainingMinutes} minutos para interagir novamente` },
          { status: 429 }
        )
      }
    }

    // Determine happiness change based on action
    const happinessChanges: Record<string, number> = {
      feed: 15,
      play: 10,
      pet: 5,
    }

    const happinessChange = happinessChanges[action] || 0

    if (happinessChange === 0) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get current pet status
    const { data: petStatus } = await supabase
      .from('pet_status')
      .select('*')
      .limit(1)
      .single()

    if (!petStatus) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Calculate happiness decay since last update
    const lastUpdated = new Date(petStatus.last_updated)
    const now = new Date()
    const hoursPassed = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
    const happinessLoss = Math.floor(hoursPassed * 2) // 2 points per hour
    const currentHappiness = Math.max(0, petStatus.happiness - happinessLoss)

    // Calculate new happiness (max 100)
    const newHappiness = Math.min(100, currentHappiness + happinessChange)

    // Update pet status
    const { error: updateError } = await supabase
      .from('pet_status')
      .update({
        happiness: newHappiness,
        last_updated: now.toISOString(),
      })
      .eq('id', petStatus.id)

    if (updateError) throw updateError

    // Log interaction
    const { error: logError } = await supabase.from('pet_interactions').insert({
      user_id: user.id,
      action,
      happiness_change: happinessChange,
    })

    if (logError) throw logError

    // Update or insert cooldown
    const { error: cooldownError } = await supabase.from('user_pet_cooldowns').upsert({
      user_id: user.id,
      last_interaction: now.toISOString(),
      updated_at: now.toISOString(),
    })

    if (cooldownError) throw cooldownError

    // Check for pet guardian badge (10+ interactions)
    const { count: interactionCount } = await supabase
      .from('pet_interactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (interactionCount && interactionCount >= 10) {
      await supabase.from('user_badges').upsert(
        {
          user_id: user.id,
          badge_type: 'pet_guardian',
        },
        { onConflict: 'user_id,badge_type', ignoreDuplicates: true }
      )
    }

    return NextResponse.json({
      success: true,
      happiness: newHappiness,
      change: happinessChange,
    })
  } catch (error: any) {
    console.error('Pet interaction error:', error)
    return NextResponse.json({ error: error.message || 'Failed to interact with pet' }, { status: 500 })
  }
}
