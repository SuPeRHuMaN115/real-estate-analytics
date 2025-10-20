export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family';
  status: 'Active' | 'Pending' | 'Sold' | 'Off Market';
  listDate: string;
  soldDate?: string;
  daysOnMarket?: number;
  description?: string;
  features?: string[];
  images?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ComparableProperty extends Property {
  similarity: number;
  adjustedPrice?: number;
  adjustments?: PropertyAdjustment[];
}

export interface PropertyAdjustment {
  factor: string;
  amount: number;
  description: string;
}

export interface ValuationResult {
  estimatedValue: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  method: string;
  comparables?: ComparableProperty[];
  breakdown?: {
    label: string;
    value: number;
  }[];
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  propertyTypes?: Property['propertyType'][];
  statuses?: Property['status'][];
  city?: string;
}
