export interface Pokemon {
  id: string;
  run_id: string;
  name: string;
  nickname: string;
  cageMatches: number;
  wins: number;
  losses: number;
  perks: string[];
  isAlive: boolean;
  created_at?: string;
}

export interface CageMatch {
  id: string;
  run_id: string;
  participants: string[];
  winner: string;
  match_date: string;
}

export interface CagelockeRun {
  id: string;
  name: string;
  description?: string;
  created_by?: string;
  created_at: string;
  is_public: boolean;
  share_code: string;
}

export interface Perk {
  id: string;
  name: string;
  description?: string;
}