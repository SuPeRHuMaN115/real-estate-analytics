import { GameState, GameAction, OwnedProperty, GameProperty } from './types';
import { generateMarketProperties, getRandomEvent, propertyTemplates } from './data';

const WIN_THRESHOLD = 1000000; // $1 million net worth to win
const LOSE_THRESHOLD = 0; // Go bankrupt to lose
const MAX_TURNS = 50; // Game ends after 50 turns

// Calculate net worth
export function calculateNetWorth(state: GameState): number {
  const propertyValue = state.ownedProperties.reduce((sum, p) => sum + p.currentPrice, 0);
  return state.cash + propertyValue;
}

// Apply property condition decay
function applyConditionDecay(properties: OwnedProperty[]): OwnedProperty[] {
  return properties.map((p) => ({
    ...p,
    condition: Math.max(0, p.condition - 2),
    // Rent decreases if condition is bad
    rentIncome: p.condition < 50 ? Math.round(p.rentIncome * 0.9) : p.rentIncome,
    turnsOwned: p.turnsOwned + 1,
  }));
}

// Collect rent from all properties
function collectRent(state: GameState): number {
  return state.ownedProperties.reduce((sum, p) => {
    // Condition affects rent collection
    const conditionMultiplier = p.condition / 100;
    return sum + Math.round(p.rentIncome * conditionMultiplier);
  }, 0);
}

// Refresh market with new properties
function refreshMarket(state: GameState): GameProperty[] {
  // Keep some properties, add some new ones
  const keepCount = Math.floor(Math.random() * 2) + 1;
  const kept = state.availableProperties
    .sort(() => Math.random() - 0.5)
    .slice(0, keepCount);

  const newProperties = generateMarketProperties(4 - kept.length);

  // Apply market trend to new properties
  const trendMultiplier =
    state.marketTrend === 'bull' ? 1.1 :
    state.marketTrend === 'bear' ? 0.9 : 1;

  return [...kept, ...newProperties.map((p) => ({
    ...p,
    currentPrice: Math.round(p.currentPrice * trendMultiplier),
  }))];
}

// Main game reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'BUY_PROPERTY': {
      const property = state.availableProperties.find((p) => p.id === action.payload.id);
      if (!property || state.cash < property.currentPrice) {
        return { ...state, message: "Can't afford this property!" };
      }

      const ownedProperty: OwnedProperty = {
        ...property,
        purchasePrice: property.currentPrice,
        turnsOwned: 0,
      };

      const newState = {
        ...state,
        cash: state.cash - property.currentPrice,
        ownedProperties: [...state.ownedProperties, ownedProperty],
        availableProperties: state.availableProperties.filter((p) => p.id !== property.id),
        message: `Purchased ${property.name} for $${property.currentPrice.toLocaleString()}!`,
        reputation: Math.min(100, state.reputation + 2),
      };

      return { ...newState, netWorth: calculateNetWorth(newState) };
    }

    case 'SELL_PROPERTY': {
      const property = state.ownedProperties.find((p) => p.id === action.payload.id);
      if (!property) {
        return { ...state, message: 'Property not found!' };
      }

      const salePrice = property.currentPrice;
      const profit = salePrice - property.purchasePrice;
      const profitPercent = Math.round((profit / property.purchasePrice) * 100);

      const newState = {
        ...state,
        cash: state.cash + salePrice,
        ownedProperties: state.ownedProperties.filter((p) => p.id !== property.id),
        message: `Sold ${property.name} for $${salePrice.toLocaleString()}! ${
          profit >= 0 ? `Profit: $${profit.toLocaleString()} (+${profitPercent}%)` : `Loss: $${Math.abs(profit).toLocaleString()} (${profitPercent}%)`
        }`,
      };

      return { ...newState, netWorth: calculateNetWorth(newState) };
    }

    case 'REPAIR_PROPERTY': {
      const property = state.ownedProperties.find((p) => p.id === action.payload.id);
      if (!property) {
        return { ...state, message: 'Property not found!' };
      }

      const repairCost = Math.round((100 - property.condition) * property.basePrice * 0.002);

      if (state.cash < repairCost) {
        return { ...state, message: `Can't afford repairs ($${repairCost.toLocaleString()})!` };
      }

      // Repairing increases value
      const valueBoost = property.condition < 50 ? 1.15 : 1.05;

      const newState = {
        ...state,
        cash: state.cash - repairCost,
        ownedProperties: state.ownedProperties.map((p) =>
          p.id === property.id
            ? {
                ...p,
                condition: 100,
                currentPrice: Math.round(p.currentPrice * valueBoost),
                rentIncome: Math.round(p.basePrice * 0.008), // Reset rent to base rate
              }
            : p
        ),
        message: `Repaired ${property.name} for $${repairCost.toLocaleString()}. Condition restored!`,
      };

      return { ...newState, netWorth: calculateNetWorth(newState) };
    }

    case 'NEXT_TURN': {
      // Collect rent
      const rentCollected = collectRent(state);

      // Apply condition decay
      const updatedProperties = applyConditionDecay(state.ownedProperties);

      // Refresh market
      const newMarket = refreshMarket(state);

      // Check for random event
      const event = getRandomEvent();

      let newState: GameState = {
        ...state,
        cash: state.cash + rentCollected,
        ownedProperties: updatedProperties,
        availableProperties: newMarket,
        turn: state.turn + 1,
        currentEvent: event,
        message: rentCollected > 0
          ? `Turn ${state.turn + 1}: Collected $${rentCollected.toLocaleString()} in rent.`
          : `Turn ${state.turn + 1}: No rental income yet. Buy some properties!`,
      };

      // Apply event effect if there is one
      if (event) {
        const eventEffect = event.effect(newState);
        newState = { ...newState, ...eventEffect, currentEvent: event };
      }

      // Update net worth
      newState.netWorth = calculateNetWorth(newState);

      // Check win/lose conditions
      if (newState.netWorth >= WIN_THRESHOLD) {
        newState.gameStatus = 'won';
        newState.message = `🎉 CONGRATULATIONS! You're a Real Estate Mogul with $${newState.netWorth.toLocaleString()} in assets!`;
      } else if (newState.netWorth <= LOSE_THRESHOLD && newState.ownedProperties.length === 0) {
        newState.gameStatus = 'lost';
        newState.message = '💸 GAME OVER: You went bankrupt!';
      } else if (newState.turn > MAX_TURNS) {
        if (newState.netWorth >= 500000) {
          newState.gameStatus = 'won';
          newState.message = `🏆 Time's up! You finished with $${newState.netWorth.toLocaleString()}. Well done!`;
        } else {
          newState.gameStatus = 'lost';
          newState.message = `⏰ Time's up! You only reached $${newState.netWorth.toLocaleString()}. Try again!`;
        }
      }

      return newState;
    }

    case 'DISMISS_EVENT': {
      return { ...state, currentEvent: null };
    }

    case 'RESTART': {
      return {
        cash: 100000,
        ownedProperties: [],
        availableProperties: generateMarketProperties(4),
        turn: 1,
        netWorth: 100000,
        currentEvent: null,
        gameStatus: 'playing',
        message: 'New game started! Build your real estate empire!',
        marketTrend: 'stable',
        reputation: 50,
      };
    }

    default:
      return state;
  }
}
