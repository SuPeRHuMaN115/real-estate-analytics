// Game type definitions

export interface GameProperty {
  id: string;
  name: string;
  address: string;
  type: 'house' | 'apartment' | 'commercial' | 'luxury';
  basePrice: number;
  currentPrice: number;
  rentIncome: number;
  condition: number; // 0-100
  image: string;
  description: string;
}

export interface OwnedProperty extends GameProperty {
  purchasePrice: number;
  turnsOwned: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  effect: (state: GameState) => Partial<GameState>;
}

export interface GameState {
  cash: number;
  ownedProperties: OwnedProperty[];
  availableProperties: GameProperty[];
  turn: number;
  netWorth: number;
  currentEvent: GameEvent | null;
  gameStatus: 'playing' | 'won' | 'lost';
  message: string | null;
  marketTrend: 'bull' | 'bear' | 'stable';
  reputation: number; // 0-100, affects prices and events
}

export interface GameAction {
  type: 'BUY_PROPERTY' | 'SELL_PROPERTY' | 'REPAIR_PROPERTY' | 'NEXT_TURN' | 'DISMISS_EVENT' | 'RESTART';
  payload?: any;
}
