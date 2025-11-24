import { GameProperty, GameEvent, GameState } from './types';

// Property templates for generating market properties
export const propertyTemplates: Omit<GameProperty, 'currentPrice'>[] = [
  {
    id: 'starter-home',
    name: 'Cozy Starter Home',
    address: '123 Maple Street',
    type: 'house',
    basePrice: 85000,
    rentIncome: 800,
    condition: 85,
    image: '🏠',
    description: 'Perfect first investment. Solid neighborhood with good schools.',
  },
  {
    id: 'downtown-apt',
    name: 'Downtown Studio',
    address: '456 Main Ave, Unit 12',
    type: 'apartment',
    basePrice: 120000,
    rentIncome: 1100,
    condition: 90,
    image: '🏢',
    description: 'Prime location near restaurants and nightlife. Always in demand.',
  },
  {
    id: 'suburban-ranch',
    name: 'Suburban Ranch',
    address: '789 Oak Lane',
    type: 'house',
    basePrice: 175000,
    rentIncome: 1400,
    condition: 75,
    image: '🏡',
    description: 'Spacious family home with a big backyard. Needs some TLC.',
  },
  {
    id: 'retail-strip',
    name: 'Strip Mall Unit',
    address: '321 Commerce Blvd',
    type: 'commercial',
    basePrice: 250000,
    rentIncome: 2200,
    condition: 80,
    image: '🏪',
    description: 'Commercial space with steady business tenants.',
  },
  {
    id: 'beachfront-condo',
    name: 'Beachfront Condo',
    address: '555 Ocean Drive, Unit 8',
    type: 'luxury',
    basePrice: 450000,
    rentIncome: 3500,
    condition: 95,
    image: '🏖️',
    description: 'Stunning ocean views. Premium vacation rental potential.',
  },
  {
    id: 'fixer-upper',
    name: 'The Fixer-Upper',
    address: '999 Broken Dreams Rd',
    type: 'house',
    basePrice: 45000,
    rentIncome: 600,
    condition: 35,
    image: '🏚️',
    description: 'Massive potential... if you can handle the repairs.',
  },
  {
    id: 'office-building',
    name: 'Downtown Office Space',
    address: '100 Business Park Way',
    type: 'commercial',
    basePrice: 380000,
    rentIncome: 3200,
    condition: 88,
    image: '🏛️',
    description: 'Class A office space with corporate tenants.',
  },
  {
    id: 'luxury-penthouse',
    name: 'Skyline Penthouse',
    address: '1 Tower Plaza, PH1',
    type: 'luxury',
    basePrice: 750000,
    rentIncome: 5500,
    condition: 98,
    image: '✨',
    description: 'The crown jewel. Panoramic city views and premium amenities.',
  },
  {
    id: 'student-housing',
    name: 'Student Housing Complex',
    address: '420 University Ave',
    type: 'apartment',
    basePrice: 200000,
    rentIncome: 2000,
    condition: 65,
    image: '🎓',
    description: 'Near campus. High turnover but always occupied.',
  },
  {
    id: 'warehouse',
    name: 'Industrial Warehouse',
    address: '800 Factory Lane',
    type: 'commercial',
    basePrice: 300000,
    rentIncome: 2800,
    condition: 70,
    image: '🏭',
    description: 'E-commerce boom means high demand for storage.',
  },
  {
    id: 'historic-brownstone',
    name: 'Historic Brownstone',
    address: '42 Heritage Row',
    type: 'luxury',
    basePrice: 550000,
    rentIncome: 4200,
    condition: 82,
    image: '🏰',
    description: 'Charming historic property. Tax benefits available.',
  },
  {
    id: 'duplex',
    name: 'Income Duplex',
    address: '234 Double Street',
    type: 'house',
    basePrice: 165000,
    rentIncome: 1600,
    condition: 78,
    image: '🏘️',
    description: 'Two units = double the income potential.',
  },
];

// Random events that can occur each turn
export const gameEvents: GameEvent[] = [
  {
    id: 'market-boom',
    title: '📈 Market Boom!',
    description: 'The real estate market is on fire! All property values increase by 15%.',
    type: 'positive',
    effect: (state) => {
      const updatedOwned = state.ownedProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 1.15),
      }));
      const updatedAvailable = state.availableProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 1.15),
      }));
      return {
        ownedProperties: updatedOwned,
        availableProperties: updatedAvailable,
        marketTrend: 'bull' as const,
        message: 'Property values jumped 15%!',
      };
    },
  },
  {
    id: 'market-crash',
    title: '📉 Market Correction!',
    description: 'Economic uncertainty causes property values to drop 12%.',
    type: 'negative',
    effect: (state) => {
      const updatedOwned = state.ownedProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 0.88),
      }));
      const updatedAvailable = state.availableProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 0.88),
      }));
      return {
        ownedProperties: updatedOwned,
        availableProperties: updatedAvailable,
        marketTrend: 'bear' as const,
        message: 'Property values dropped 12%!',
      };
    },
  },
  {
    id: 'rent-increase',
    title: '💰 Rent Surge!',
    description: 'Housing demand is up! All your rental income increases by 20% this turn.',
    type: 'positive',
    effect: (state) => {
      const bonus = state.ownedProperties.reduce((sum, p) => sum + p.rentIncome * 0.2, 0);
      return {
        cash: state.cash + Math.round(bonus),
        message: `Bonus rent collected: $${Math.round(bonus).toLocaleString()}!`,
      };
    },
  },
  {
    id: 'emergency-repair',
    title: '🔧 Emergency Repairs!',
    description: 'One of your properties needs urgent repairs. Pay $5,000 or lose condition.',
    type: 'negative',
    effect: (state) => {
      if (state.ownedProperties.length === 0) {
        return { message: 'Luckily, you have no properties to repair!' };
      }
      if (state.cash >= 5000) {
        return {
          cash: state.cash - 5000,
          message: 'Paid $5,000 for emergency repairs.',
        };
      }
      const worstProperty = [...state.ownedProperties].sort((a, b) => a.condition - b.condition)[0];
      const updatedProperties = state.ownedProperties.map((p) =>
        p.id === worstProperty.id ? { ...p, condition: Math.max(0, p.condition - 20) } : p
      );
      return {
        ownedProperties: updatedProperties,
        message: `Couldn't afford repairs. ${worstProperty.name} condition dropped!`,
      };
    },
  },
  {
    id: 'property-tax',
    title: '📋 Property Tax Due!',
    description: 'Annual property taxes are due. Pay 2% of your portfolio value.',
    type: 'negative',
    effect: (state) => {
      const totalValue = state.ownedProperties.reduce((sum, p) => sum + p.currentPrice, 0);
      const tax = Math.round(totalValue * 0.02);
      return {
        cash: Math.max(0, state.cash - tax),
        message: `Paid $${tax.toLocaleString()} in property taxes.`,
      };
    },
  },
  {
    id: 'inheritance',
    title: '🎁 Unexpected Inheritance!',
    description: 'A distant relative left you some money!',
    type: 'positive',
    effect: (state) => {
      const amount = 10000 + Math.floor(Math.random() * 20000);
      return {
        cash: state.cash + amount,
        message: `Received $${amount.toLocaleString()} inheritance!`,
      };
    },
  },
  {
    id: 'tenant-trouble',
    title: '😠 Problem Tenant!',
    description: 'A tenant caused damage and skipped town. Lose one month of rent from a random property.',
    type: 'negative',
    effect: (state) => {
      if (state.ownedProperties.length === 0) {
        return { message: 'No tenants, no problems!' };
      }
      const randomProperty = state.ownedProperties[Math.floor(Math.random() * state.ownedProperties.length)];
      return {
        cash: Math.max(0, state.cash - randomProperty.rentIncome),
        message: `Lost $${randomProperty.rentIncome.toLocaleString()} from ${randomProperty.name}`,
      };
    },
  },
  {
    id: 'tv-show',
    title: '📺 Property Featured on TV!',
    description: 'Your property was featured on a popular home show! Value increases 25%.',
    type: 'positive',
    effect: (state) => {
      if (state.ownedProperties.length === 0) {
        return { message: 'You need properties to be on TV!' };
      }
      const randomIdx = Math.floor(Math.random() * state.ownedProperties.length);
      const updatedProperties = state.ownedProperties.map((p, i) =>
        i === randomIdx ? { ...p, currentPrice: Math.round(p.currentPrice * 1.25) } : p
      );
      return {
        ownedProperties: updatedProperties,
        reputation: Math.min(100, state.reputation + 10),
        message: `${state.ownedProperties[randomIdx].name} is now worth 25% more!`,
      };
    },
  },
  {
    id: 'new-development',
    title: '🏗️ New Development Nearby!',
    description: 'A major development is coming to your area. Property values rising!',
    type: 'positive',
    effect: (state) => {
      const updatedOwned = state.ownedProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 1.1),
      }));
      return {
        ownedProperties: updatedOwned,
        message: 'Your properties increased 10% in value!',
      };
    },
  },
  {
    id: 'interest-hike',
    title: '🏦 Interest Rates Up!',
    description: 'The Fed raised rates. Market cools down slightly.',
    type: 'negative',
    effect: (state) => {
      const updatedAvailable = state.availableProperties.map((p) => ({
        ...p,
        currentPrice: Math.round(p.currentPrice * 0.95),
      }));
      return {
        availableProperties: updatedAvailable,
        marketTrend: 'stable' as const,
        message: 'Market prices cooled 5%.',
      };
    },
  },
  {
    id: 'perfect-tenant',
    title: '⭐ Five-Star Tenant!',
    description: 'An excellent tenant wants to sign a long lease! Double rent this turn.',
    type: 'positive',
    effect: (state) => {
      const bonus = state.ownedProperties.reduce((sum, p) => sum + p.rentIncome, 0);
      return {
        cash: state.cash + bonus,
        reputation: Math.min(100, state.reputation + 5),
        message: `Bonus rent: $${bonus.toLocaleString()}!`,
      };
    },
  },
  {
    id: 'renovation-show',
    title: '🔨 Free Renovation!',
    description: 'A renovation show wants to fix up your worst property for free!',
    type: 'positive',
    effect: (state) => {
      if (state.ownedProperties.length === 0) {
        return { message: 'No properties to renovate!' };
      }
      const worstIdx = state.ownedProperties.reduce(
        (minIdx, p, i, arr) => (p.condition < arr[minIdx].condition ? i : minIdx),
        0
      );
      const updatedProperties = state.ownedProperties.map((p, i) =>
        i === worstIdx ? { ...p, condition: 100, currentPrice: Math.round(p.currentPrice * 1.2) } : p
      );
      return {
        ownedProperties: updatedProperties,
        message: `${state.ownedProperties[worstIdx].name} is now in perfect condition!`,
      };
    },
  },
];

// Generate initial market properties
export function generateMarketProperties(count: number = 4): GameProperty[] {
  const shuffled = [...propertyTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((template) => ({
    ...template,
    id: `${template.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    currentPrice: Math.round(template.basePrice * (0.9 + Math.random() * 0.2)),
  }));
}

// Get a random event (30% chance per turn)
export function getRandomEvent(): GameEvent | null {
  if (Math.random() > 0.35) return null;
  return gameEvents[Math.floor(Math.random() * gameEvents.length)];
}

// Initial game state
export const initialGameState: GameState = {
  cash: 100000,
  ownedProperties: [],
  availableProperties: generateMarketProperties(4),
  turn: 1,
  netWorth: 100000,
  currentEvent: null,
  gameStatus: 'playing',
  message: 'Welcome to Real Estate Tycoon! Start building your empire!',
  marketTrend: 'stable',
  reputation: 50,
};
