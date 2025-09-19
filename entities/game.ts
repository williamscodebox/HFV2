export interface Round {
  round_number: number;
  melds_score?: number;
  cards_score?: number;
  bonus_clean_books?: number;
  bonus_dirty_books?: number;
  bonus_red_threes?: number;
  penalty_cards_left?: number;
  went_out?: boolean;
  round_total?: number;
}

export interface GamePlayer {
  player_id: string;
  name: string;
  total_score?: number;
  rounds?: Round[];
}

export interface Game {
  id: string;
  name: string;
  players: GamePlayer[];
  current_round?: number;
  status?: "active" | "completed";
  winner_id?: string;
}
