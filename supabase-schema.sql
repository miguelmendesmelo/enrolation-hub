-- Strategi Games Database Schema
-- Run this script in your Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- USER STATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_points INTEGER DEFAULT 0 NOT NULL,
  games_played INTEGER DEFAULT 0 NOT NULL,
  games_won INTEGER DEFAULT 0 NOT NULL,
  games_lost INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- PET STATUS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.pet_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  happiness INTEGER DEFAULT 100 NOT NULL CHECK (happiness >= 0 AND happiness <= 100),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial pet (only one pet for the whole team)
INSERT INTO public.pet_status (happiness) VALUES (100) ON CONFLICT DO NOTHING;

-- ============================================
-- PET INTERACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.pet_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('feed', 'play', 'pet')),
  happiness_change INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- USER PET COOLDOWNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_pet_cooldowns (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- GAME SCORES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('sudoku', '2048', 'minesweeper', 'puzzle', 'blackjack', 'chess', 'checkers', 'backgammon', 'ludo')),
  score INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- MULTIPLAYER ROOMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.multiplayer_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_type TEXT NOT NULL CHECK (game_type IN ('chess', 'checkers', 'backgammon', 'ludo')),
  player1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  game_state JSONB,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  current_turn UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- GAME HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.game_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_type TEXT NOT NULL,
  player1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  player1_points INTEGER DEFAULT 0,
  player2_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('first_win', '10_games', 'champion_week', 'pet_guardian', '100_points', 'multiplayer_master')),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, badge_type)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON public.game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON public.game_scores(game_type);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON public.game_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pet_interactions_user_id ON public.pet_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_interactions_created_at ON public.pet_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_status ON public.multiplayer_rooms(status);
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_player1 ON public.multiplayer_rooms(player1_id);
CREATE INDEX IF NOT EXISTS idx_multiplayer_rooms_player2 ON public.multiplayer_rooms(player2_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON public.user_stats(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_game_history_player1 ON public.game_history(player1_id);
CREATE INDEX IF NOT EXISTS idx_game_history_player2 ON public.game_history(player2_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pet_cooldowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multiplayer_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- User stats policies
CREATE POLICY "User stats are viewable by everyone" ON public.user_stats
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Pet status policies (everyone can view and update the pet)
CREATE POLICY "Pet status is viewable by everyone" ON public.pet_status
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update pet status" ON public.pet_status
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Pet interactions policies
CREATE POLICY "Pet interactions are viewable by everyone" ON public.pet_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own interactions" ON public.pet_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User pet cooldowns policies
CREATE POLICY "Users can view their own cooldowns" ON public.user_pet_cooldowns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cooldowns" ON public.user_pet_cooldowns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cooldowns" ON public.user_pet_cooldowns
  FOR UPDATE USING (auth.uid() = user_id);

-- Game scores policies
CREATE POLICY "Game scores are viewable by everyone" ON public.game_scores
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own scores" ON public.game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Multiplayer rooms policies
CREATE POLICY "Multiplayer rooms are viewable by everyone" ON public.multiplayer_rooms
  FOR SELECT USING (true);

CREATE POLICY "Users can create rooms" ON public.multiplayer_rooms
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their rooms" ON public.multiplayer_rooms
  FOR UPDATE USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Game history policies
CREATE POLICY "Game history is viewable by everyone" ON public.game_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert game history" ON public.game_history
  FOR INSERT WITH CHECK (auth.uid() = player1_id OR auth.uid() = player2_id);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically create profile and stats on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_multiplayer_rooms_updated_at BEFORE UPDATE ON public.multiplayer_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to decay pet happiness over time
CREATE OR REPLACE FUNCTION public.decay_pet_happiness()
RETURNS void AS $$
DECLARE
  current_pet RECORD;
  hours_passed INTEGER;
  happiness_loss INTEGER;
BEGIN
  SELECT * INTO current_pet FROM public.pet_status LIMIT 1;

  IF current_pet IS NOT NULL THEN
    hours_passed := EXTRACT(EPOCH FROM (NOW() - current_pet.last_updated)) / 3600;
    happiness_loss := LEAST(hours_passed * 2, current_pet.happiness); -- Lose 2 points per hour

    UPDATE public.pet_status
    SET happiness = GREATEST(0, happiness - happiness_loss),
        last_updated = NOW()
    WHERE id = current_pet.id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for multiplayer rooms
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pet_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pet_interactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
