import { z } from 'zod';

// Enums matching Prisma schema
export const PropertyType = {
  MULTIFAMILY: 'MULTIFAMILY',
  OFFICE: 'OFFICE',
  RETAIL: 'RETAIL',
  INDUSTRIAL: 'INDUSTRIAL',
  MIXED_USE: 'MIXED_USE',
  LAND: 'LAND',
  HOTEL: 'HOTEL',
  SELF_STORAGE: 'SELF_STORAGE',
  SENIOR_LIVING: 'SENIOR_LIVING',
  STUDENT_HOUSING: 'STUDENT_HOUSING',
  SINGLE_FAMILY: 'SINGLE_FAMILY',
  OTHER: 'OTHER',
} as const;

export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const Condition = {
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  AVERAGE: 'AVERAGE',
  FAIR: 'FAIR',
  POOR: 'POOR',
} as const;

export type Condition = (typeof Condition)[keyof typeof Condition];

export const Quality = {
  CLASS_A: 'CLASS_A',
  CLASS_B: 'CLASS_B',
  CLASS_C: 'CLASS_C',
  CLASS_D: 'CLASS_D',
} as const;

export type Quality = (typeof Quality)[keyof typeof Quality];

// Zod schemas for validation
export const propertyInputSchema = z.object({
  // Basic Info
  name: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  county: z.string().optional(),

  // Property Details
  propertyType: z.enum([
    'MULTIFAMILY', 'OFFICE', 'RETAIL', 'INDUSTRIAL', 'MIXED_USE',
    'LAND', 'HOTEL', 'SELF_STORAGE', 'SENIOR_LIVING', 'STUDENT_HOUSING',
    'SINGLE_FAMILY', 'OTHER'
  ]),
  propertySubType: z.string().optional(),
  yearBuilt: z.number().int().min(1800).max(2030).optional(),
  yearRenovated: z.number().int().min(1800).max(2030).optional(),

  // Size Metrics
  units: z.number().int().positive().optional(),
  squareFeet: z.number().int().positive().optional(),
  lotSizeSqFt: z.number().int().positive().optional(),
  lotSizeAcres: z.number().positive().optional(),
  avgUnitSize: z.number().int().positive().optional(),
  unitMix: z.string().optional(),

  // Financial Data
  listPrice: z.number().positive().optional(),
  salePrice: z.number().positive().optional(),
  pricePerUnit: z.number().positive().optional(),
  pricePerSqFt: z.number().positive().optional(),

  // Income
  grossPotentialRent: z.number().optional(),
  effectiveGrossIncome: z.number().optional(),
  otherIncome: z.number().optional(),
  totalIncome: z.number().optional(),
  vacancyRate: z.number().min(0).max(1).optional(),

  // Expenses
  operatingExpenses: z.number().optional(),
  expenseRatio: z.number().min(0).max(1).optional(),
  taxes: z.number().optional(),
  insurance: z.number().optional(),
  utilities: z.number().optional(),
  management: z.number().optional(),
  maintenance: z.number().optional(),
  reserves: z.number().optional(),

  // Investment Metrics
  noi: z.number().optional(),
  capRate: z.number().min(0).max(1).optional(),
  cashOnCash: z.number().optional(),
  dscr: z.number().optional(),
  grm: z.number().optional(),

  // Condition & Quality
  condition: z.enum(['EXCELLENT', 'GOOD', 'AVERAGE', 'FAIR', 'POOR']).optional(),
  quality: z.enum(['CLASS_A', 'CLASS_B', 'CLASS_C', 'CLASS_D']).optional(),
  occupancy: z.number().min(0).max(1).optional(),

  // Amenities & Notes
  amenities: z.string().optional(),
  marketRentPsf: z.number().optional(),
  marketCapRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
  imageUrl: z.string().url().optional(),

  // Flags
  isSubjectProperty: z.boolean().default(false),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

// Full property type (includes computed fields and relations)
export interface Property extends PropertyInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Comp analysis types
export interface CompAnalysis {
  id: string;
  createdAt: Date;
  subjectId: string;
  compId: string;
  distanceMiles?: number;
  similarityScore?: number;
  locationAdj?: number;
  sizeAdj?: number;
  ageAdj?: number;
  conditionAdj?: number;
  amenitiesAdj?: number;
  otherAdj?: number;
  totalAdj?: number;
  adjustedPrice?: number;
  adjustedPpu?: number;
  adjustedPsf?: number;
  aiNotes?: string;
  aiConfidence?: number;
  comp?: Property;
  subject?: Property;
}

// Valuation types
export interface Valuation {
  id: string;
  createdAt: Date;
  propertyId: string;
  salesCompValue?: number;
  incomeValue?: number;
  costValue?: number;
  estimatedValue: number;
  valueLow?: number;
  valueHigh?: number;
  confidence?: number;
  valuePerUnit?: number;
  valuePerSqFt?: number;
  methodology?: string;
  aiSummary?: string;
  aiRecommendations?: string;
  marketAnalysis?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Analysis request types
export interface AnalyzeCompsRequest {
  subjectPropertyId: string;
  compPropertyIds?: string[];
  autoFindComps?: boolean;
  maxComps?: number;
}

export interface ValuationRequest {
  propertyId: string;
  includeComps?: boolean;
  approaches?: ('sales' | 'income' | 'cost')[];
}
