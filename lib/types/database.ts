/**
 * Database Types
 * TypeScript interfaces for database tables
 */

export interface Profile {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  user_id: string
  total_points: number
  games_played: number
  games_won: number
  games_lost: number
  created_at: string
  updated_at: string
}

export interface PetStatus {
  id: string
  happiness: number
  last_updated: string
  created_at: string
}

export interface PetInteraction {
  id: string
  user_id: string
  action: 'feed' | 'play' | 'pet'
  happiness_change: number
  created_at: string
}

export interface UserPetCooldown {
  user_id: string
  last_interaction: string
  updated_at: string
}

export interface GameScore {
  id: string
  user_id: string
  game_type: 'sudoku' | '2048' | 'minesweeper' | 'puzzle' | 'blackjack' | 'chess' | 'checkers' | 'backgammon' | 'ludo'
  score: number
  points_earned: number
  difficulty?: 'easy' | 'medium' | 'hard'
  completed: boolean
  created_at: string
}

export interface MultiplayerRoom {
  id: string
  game_type: 'chess' | 'checkers' | 'backgammon' | 'ludo'
  player1_id: string
  player2_id: string | null
  status: 'waiting' | 'playing' | 'finished'
  game_state: Record<string, unknown>
  winner_id: string | null
  current_turn: string | null
  created_at: string
  updated_at: string
}

export interface GameHistory {
  id: string
  game_type: string
  player1_id: string
  player2_id: string | null
  winner_id: string | null
  player1_points: number
  player2_points: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_type: 'first_win' | '10_games' | 'champion_week' | 'pet_guardian' | '100_points' | 'multiplayer_master'
  earned_at: string
}

export interface LeaderboardEntry {
  username: string
  total_points: number
  games_won: number
  games_played: number
}
