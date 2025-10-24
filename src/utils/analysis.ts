import { Property, ComparableProperty, ValuationResult, PropertyAdjustment, PropertyFilters } from '@/types';

/**
 * Calculate similarity score between two properties (0-100)
 */
export function calculateSimilarity(subject: Property, comparable: Property): number {
  let score = 100;

  // Location (30 points)
  if (subject.zipCode !== comparable.zipCode) score -= 15;
  if (subject.city !== comparable.city) score -= 15;

  // Property type (20 points)
  if (subject.propertyType !== comparable.propertyType) score -= 20;

  // Bedrooms (15 points)
  const bedroomDiff = Math.abs(subject.bedrooms - comparable.bedrooms);
  score -= Math.min(bedroomDiff * 5, 15);

  // Bathrooms (10 points)
  const bathroomDiff = Math.abs(subject.bathrooms - comparable.bathrooms);
  score -= Math.min(bathroomDiff * 5, 10);

  // Square footage (15 points)
  const sqftDiff = Math.abs(subject.squareFeet - comparable.squareFeet);
  const sqftPercentDiff = sqftDiff / subject.squareFeet;
  score -= Math.min(sqftPercentDiff * 100, 15);

  // Age (10 points)
  const ageDiff = Math.abs(subject.yearBuilt - comparable.yearBuilt);
  score -= Math.min(ageDiff / 2, 10);

  return Math.max(0, Math.round(score));
}

/**
 * Find comparable properties for a subject property
 */
export function findComparables(
  subject: Property,
  allProperties: Property[],
  limit: number = 5
): ComparableProperty[] {
  const comparables = allProperties
    .filter(p => p.id !== subject.id && (p.status === 'Sold' || p.status === 'Active'))
    .map(p => {
      const similarity = calculateSimilarity(subject, p);
      const adjustments = calculateAdjustments(subject, p);
      const adjustedPrice = p.price + adjustments.reduce((sum, adj) => sum + adj.amount, 0);

      return {
        ...p,
        similarity,
        adjustments,
        adjustedPrice,
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return comparables;
}

/**
 * Calculate price adjustments between subject and comparable
 */
export function calculateAdjustments(subject: Property, comparable: Property): PropertyAdjustment[] {
  const adjustments: PropertyAdjustment[] = [];

  // Square footage adjustment ($100 per sqft difference)
  const sqftDiff = subject.squareFeet - comparable.squareFeet;
  if (Math.abs(sqftDiff) > 50) {
    adjustments.push({
      factor: 'Square Footage',
      amount: sqftDiff * 100,
      description: `${Math.abs(sqftDiff)} sqft ${sqftDiff > 0 ? 'larger' : 'smaller'}`,
    });
  }

  // Bedroom adjustment ($15,000 per bedroom)
  const bedroomDiff = subject.bedrooms - comparable.bedrooms;
  if (bedroomDiff !== 0) {
    adjustments.push({
      factor: 'Bedrooms',
      amount: bedroomDiff * 15000,
      description: `${Math.abs(bedroomDiff)} ${bedroomDiff > 0 ? 'more' : 'fewer'} bedroom(s)`,
    });
  }

  // Bathroom adjustment ($10,000 per bathroom)
  const bathroomDiff = subject.bathrooms - comparable.bathrooms;
  if (Math.abs(bathroomDiff) >= 0.5) {
    adjustments.push({
      factor: 'Bathrooms',
      amount: bathroomDiff * 10000,
      description: `${Math.abs(bathroomDiff)} ${bathroomDiff > 0 ? 'more' : 'fewer'} bathroom(s)`,
    });
  }

  // Age adjustment ($2,000 per year newer)
  const ageDiff = comparable.yearBuilt - subject.yearBuilt;
  if (Math.abs(ageDiff) > 2) {
    adjustments.push({
      factor: 'Age',
      amount: ageDiff * 2000,
      description: `${Math.abs(ageDiff)} years ${ageDiff > 0 ? 'newer' : 'older'}`,
    });
  }

  // Lot size adjustment (if applicable)
  if (subject.lotSize > 0 && comparable.lotSize > 0) {
    const lotDiff = subject.lotSize - comparable.lotSize;
    if (Math.abs(lotDiff) > 2000) {
      adjustments.push({
        factor: 'Lot Size',
        amount: (lotDiff / 1000) * 5000,
        description: `${Math.abs(Math.round(lotDiff))} sqft ${lotDiff > 0 ? 'larger' : 'smaller'} lot`,
      });
    }
  }

  return adjustments;
}

/**
 * Perform Comparative Market Analysis (CMA)
 */
export function performCMA(subject: Property, allProperties: Property[]): ValuationResult {
  const comparables = findComparables(subject, allProperties, 5);

  if (comparables.length === 0) {
    return {
      estimatedValue: subject.price,
      confidenceLevel: 'Low',
      method: 'CMA',
      comparables: [],
    };
  }

  // Weight recent sales more heavily
  const weightedSum = comparables.reduce((sum, comp, index) => {
    const weight = 1 / (index + 1); // First comp gets weight 1, second gets 0.5, etc.
    return sum + (comp.adjustedPrice! * comp.similarity / 100 * weight);
  }, 0);

  const totalWeight = comparables.reduce((sum, _, index) => sum + (1 / (index + 1)), 0);
  const estimatedValue = Math.round(weightedSum / totalWeight);

  // Determine confidence level based on similarity scores
  const avgSimilarity = comparables.reduce((sum, c) => sum + c.similarity, 0) / comparables.length;
  let confidenceLevel: 'High' | 'Medium' | 'Low';

  if (avgSimilarity >= 80 && comparables.length >= 3) {
    confidenceLevel = 'High';
  } else if (avgSimilarity >= 60 && comparables.length >= 2) {
    confidenceLevel = 'Medium';
  } else {
    confidenceLevel = 'Low';
  }

  return {
    estimatedValue,
    confidenceLevel,
    method: 'Comparative Market Analysis (CMA)',
    comparables,
  };
}

/**
 * Calculate value using price per square foot method
 */
export function calculatePricePerSquareFoot(subject: Property, allProperties: Property[]): ValuationResult {
  // Find similar properties
  const similarProperties = allProperties
    .filter(p =>
      p.id !== subject.id &&
      p.propertyType === subject.propertyType &&
      p.city === subject.city &&
      (p.status === 'Sold' || p.status === 'Active') &&
      Math.abs(p.yearBuilt - subject.yearBuilt) <= 10
    );

  if (similarProperties.length === 0) {
    return {
      estimatedValue: subject.price,
      confidenceLevel: 'Low',
      method: 'Price Per Square Foot',
    };
  }

  // Calculate average price per square foot
  const avgPricePerSqft = similarProperties.reduce((sum, p) => sum + (p.price / p.squareFeet), 0) / similarProperties.length;
  const estimatedValue = Math.round(avgPricePerSqft * subject.squareFeet);

  const confidenceLevel = similarProperties.length >= 3 ? 'High' : similarProperties.length >= 2 ? 'Medium' : 'Low';

  return {
    estimatedValue,
    confidenceLevel,
    method: 'Price Per Square Foot',
    breakdown: [
      { label: 'Average $/sqft', value: Math.round(avgPricePerSqft) },
      { label: 'Subject sqft', value: subject.squareFeet },
      { label: 'Properties analyzed', value: similarProperties.length },
    ],
  };
}

/**
 * Get average price of properties
 */
export function getAveragePrice(properties: Property[]): number {
  if (!properties.length) return 0;
  const total = properties.reduce((sum, p) => sum + p.price, 0);
  return Math.round(total / properties.length);
}

/**
 * Get price per square foot for a property
 */
export function getPricePerSquareFoot(property: Property): number {
  return Math.round(property.price / property.squareFeet);
}

/**
 * Filter properties based on criteria
 */
export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter(property => {
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false;
    if (filters.maxBedrooms && property.bedrooms > filters.maxBedrooms) return false;
    if (filters.minBathrooms && property.bathrooms < filters.minBathrooms) return false;
    if (filters.maxBathrooms && property.bathrooms > filters.maxBathrooms) return false;
    if (filters.minSquareFeet && property.squareFeet < filters.minSquareFeet) return false;
    if (filters.maxSquareFeet && property.squareFeet > filters.maxSquareFeet) return false;
    if (filters.propertyTypes && filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) return false;
    if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(property.status)) return false;
    if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) return false;

    return true;
  });
}

/**
 * Get market statistics for a set of properties
 */
export function getMarketStats(properties: Property[]) {
  if (properties.length === 0) {
    return {
      count: 0,
      avgPrice: 0,
      medianPrice: 0,
      avgPricePerSqft: 0,
      avgDaysOnMarket: 0,
      avgSquareFeet: 0,
    };
  }

  const prices = properties.map(p => p.price).sort((a, b) => a - b);
  const medianPrice = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)];

  return {
    count: properties.length,
    avgPrice: Math.round(getAveragePrice(properties)),
    medianPrice: Math.round(medianPrice),
    avgPricePerSqft: Math.round(properties.reduce((sum, p) => sum + getPricePerSquareFoot(p), 0) / properties.length),
    avgDaysOnMarket: Math.round(properties.filter(p => p.daysOnMarket).reduce((sum, p) => sum + (p.daysOnMarket || 0), 0) / properties.filter(p => p.daysOnMarket).length || 0),
    avgSquareFeet: Math.round(properties.reduce((sum, p) => sum + p.squareFeet, 0) / properties.length),
  };
}
