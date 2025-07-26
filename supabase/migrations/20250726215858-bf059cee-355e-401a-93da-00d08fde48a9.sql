-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investment opportunities table
CREATE TABLE public.investment_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  funding_goal_eth DECIMAL(18,8) NOT NULL,
  current_amount_eth DECIMAL(18,8) NOT NULL DEFAULT 0,
  minimum_investment_eth DECIMAL(18,8) NOT NULL,
  expected_return_percentage INTEGER NOT NULL,
  timeframe_months INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  category TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create crypto transactions table for transparency
CREATE TABLE public.crypto_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_hash TEXT NOT NULL UNIQUE,
  from_wallet TEXT NOT NULL,
  to_wallet TEXT NOT NULL,
  amount_eth DECIMAL(18,8) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('investment', 'donation', 'withdrawal')),
  opportunity_id UUID REFERENCES public.investment_opportunities(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  gas_used BIGINT,
  gas_price_gwei DECIMAL(18,8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create investments table to track user investments
CREATE TABLE public.investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES public.investment_opportunities(id) ON DELETE CASCADE,
  amount_eth DECIMAL(18,8) NOT NULL,
  transaction_id UUID NOT NULL REFERENCES public.crypto_transactions(id),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, opportunity_id, transaction_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crypto_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investment opportunities policies
CREATE POLICY "Investment opportunities are viewable by everyone" 
ON public.investment_opportunities FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create investment opportunities" 
ON public.investment_opportunities FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own opportunities" 
ON public.investment_opportunities FOR UPDATE USING (auth.uid() = creator_id);

-- Crypto transactions policies (public for transparency)
CREATE POLICY "Crypto transactions are viewable by everyone for transparency" 
ON public.crypto_transactions FOR SELECT USING (true);

CREATE POLICY "Users can create their own transactions" 
ON public.crypto_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments policies
CREATE POLICY "Users can view their own investments" 
ON public.investments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments" 
ON public.investments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investment_opportunities_updated_at
  BEFORE UPDATE ON public.investment_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample investment opportunities
INSERT INTO public.investment_opportunities (
  title, description, funding_goal_eth, minimum_investment_eth, 
  expected_return_percentage, timeframe_months, risk_level, category, creator_id
) VALUES 
(
  'AI-Powered Healthcare Platform',
  'Revolutionary healthcare platform using AI to predict and prevent diseases before they occur.',
  50.0, 0.1, 25, 18, 'Medium', 'Healthcare',
  '00000000-0000-0000-0000-000000000000'
),
(
  'Sustainable Energy Grid',
  'Building next-generation renewable energy infrastructure with blockchain-based energy trading.',
  100.0, 0.5, 30, 24, 'Low', 'Energy',
  '00000000-0000-0000-0000-000000000000'
),
(
  'DeFi Trading Algorithm',
  'Advanced algorithmic trading system for decentralized finance protocols with proven 40% returns.',
  25.0, 0.05, 40, 12, 'High', 'Finance',
  '00000000-0000-0000-0000-000000000000'
);