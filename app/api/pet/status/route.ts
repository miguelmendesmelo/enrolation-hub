/**
 * Pet Status API Route
 * Returns current pet status with decay calculated
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current pet status
    const { data: petStatus, error } = await supabase
      .from('pet_status')
      .select('*')
      .limit(1)
      .single()

    if (error || !petStatus) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Calculate happiness decay since last update
    const lastUpdated = new Date(petStatus.last_updated)
    const now = new Date()
    const hoursPassed = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)
    const happinessLoss = Math.floor(hoursPassed * 2) // 2 points per hour
    const currentHappiness = Math.max(0, petStatus.happiness - happinessLoss)

    // Get recent interactions
    const { data: interactions } = await supabase
      .from('pet_interactions')
      .select(`
        *,
        profiles:user_id (username)
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      happiness: currentHappiness,
      last_updated: petStatus.last_updated,
      interactions: interactions || [],
    })
  } catch (error) {
    console.error('Pet status error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to get pet status' }, { status: 500 })
  }
}
