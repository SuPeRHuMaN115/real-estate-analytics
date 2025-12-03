import Anthropic from '@anthropic-ai/sdk';
import { Property, CompAnalysis, Valuation } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Calculate basic property metrics
export function calculateMetrics(property: Partial<Property>): Partial<Property> {
  const updates: Partial<Property> = {};

  // Calculate price per unit
  if (property.salePrice && property.units) {
    updates.pricePerUnit = property.salePrice / property.units;
  } else if (property.listPrice && property.units) {
    updates.pricePerUnit = property.listPrice / property.units;
  }

  // Calculate price per SF
  if (property.salePrice && property.squareFeet) {
    updates.pricePerSqFt = property.salePrice / property.squareFeet;
  } else if (property.listPrice && property.squareFeet) {
    updates.pricePerSqFt = property.listPrice / property.squareFeet;
  }

  // Calculate NOI if we have income and expenses
  if (property.effectiveGrossIncome && property.operatingExpenses) {
    updates.noi = property.effectiveGrossIncome - property.operatingExpenses;
  } else if (property.totalIncome && property.operatingExpenses) {
    updates.noi = property.totalIncome - property.operatingExpenses;
  }

  // Calculate cap rate
  const price = property.salePrice || property.listPrice;
  const noi = updates.noi || property.noi;
  if (noi && price) {
    updates.capRate = noi / price;
  }

  // Calculate GRM
  if (price && property.grossPotentialRent) {
    updates.grm = price / property.grossPotentialRent;
  }

  // Calculate expense ratio
  if (property.operatingExpenses && property.effectiveGrossIncome) {
    updates.expenseRatio = property.operatingExpenses / property.effectiveGrossIncome;
  }

  // Convert lot size
  if (property.lotSizeSqFt && !property.lotSizeAcres) {
    updates.lotSizeAcres = property.lotSizeSqFt / 43560;
  } else if (property.lotSizeAcres && !property.lotSizeSqFt) {
    updates.lotSizeSqFt = Math.round(property.lotSizeAcres * 43560);
  }

  return updates;
}

// Calculate similarity score between two properties
export function calculateSimilarityScore(subject: Property, comp: Property): number {
  let score = 100;
  const deductions: { reason: string; points: number }[] = [];

  // Property type mismatch (major)
  if (subject.propertyType !== comp.propertyType) {
    deductions.push({ reason: 'Different property type', points: 30 });
  }

  // Size comparison (units)
  if (subject.units && comp.units) {
    const unitDiff = Math.abs(subject.units - comp.units) / subject.units;
    if (unitDiff > 0.5) deductions.push({ reason: 'Unit count >50% different', points: 20 });
    else if (unitDiff > 0.25) deductions.push({ reason: 'Unit count >25% different', points: 10 });
    else if (unitDiff > 0.1) deductions.push({ reason: 'Unit count >10% different', points: 5 });
  }

  // Age comparison
  if (subject.yearBuilt && comp.yearBuilt) {
    const ageDiff = Math.abs(subject.yearBuilt - comp.yearBuilt);
    if (ageDiff > 20) deductions.push({ reason: 'Year built >20 years different', points: 15 });
    else if (ageDiff > 10) deductions.push({ reason: 'Year built >10 years different', points: 8 });
    else if (ageDiff > 5) deductions.push({ reason: 'Year built >5 years different', points: 3 });
  }

  // Quality comparison
  if (subject.quality && comp.quality && subject.quality !== comp.quality) {
    const qualityOrder = ['CLASS_A', 'CLASS_B', 'CLASS_C', 'CLASS_D'];
    const diff = Math.abs(qualityOrder.indexOf(subject.quality) - qualityOrder.indexOf(comp.quality));
    deductions.push({ reason: `Quality ${diff} class(es) different`, points: diff * 8 });
  }

  // Location (same city/state)
  if (subject.state !== comp.state) {
    deductions.push({ reason: 'Different state', points: 25 });
  } else if (subject.city !== comp.city) {
    deductions.push({ reason: 'Different city', points: 10 });
  }

  // Apply deductions
  for (const d of deductions) {
    score -= d.points;
  }

  return Math.max(0, score);
}

// Calculate price adjustments for a comp
export function calculateAdjustments(
  subject: Property,
  comp: Property
): Partial<CompAnalysis> {
  const compPrice = comp.salePrice || comp.listPrice || 0;
  const adjustments: Partial<CompAnalysis> = {};

  // Size adjustment (per unit basis)
  if (subject.units && comp.units && subject.pricePerUnit && comp.pricePerUnit) {
    const unitDiff = subject.units - comp.units;
    // Larger properties typically have lower per-unit prices
    adjustments.sizeAdj = unitDiff * (comp.pricePerUnit * 0.02);
  }

  // Age adjustment
  if (subject.yearBuilt && comp.yearBuilt) {
    const ageDiff = comp.yearBuilt - subject.yearBuilt; // positive = comp is newer
    // Newer properties worth more, adjust ~1% per year
    adjustments.ageAdj = -ageDiff * (compPrice * 0.01);
  }

  // Condition adjustment
  if (subject.condition && comp.condition) {
    const conditionOrder = ['POOR', 'FAIR', 'AVERAGE', 'GOOD', 'EXCELLENT'];
    const subjectIdx = conditionOrder.indexOf(subject.condition);
    const compIdx = conditionOrder.indexOf(comp.condition);
    const diff = compIdx - subjectIdx; // positive = comp is better condition
    adjustments.conditionAdj = -diff * (compPrice * 0.03);
  }

  // Calculate total adjustment
  adjustments.totalAdj =
    (adjustments.locationAdj || 0) +
    (adjustments.sizeAdj || 0) +
    (adjustments.ageAdj || 0) +
    (adjustments.conditionAdj || 0) +
    (adjustments.amenitiesAdj || 0) +
    (adjustments.otherAdj || 0);

  // Calculate adjusted values
  adjustments.adjustedPrice = compPrice + (adjustments.totalAdj || 0);

  if (comp.units) {
    adjustments.adjustedPpu = adjustments.adjustedPrice / comp.units;
  }

  if (comp.squareFeet) {
    adjustments.adjustedPsf = adjustments.adjustedPrice / comp.squareFeet;
  }

  return adjustments;
}

// AI-powered analysis
export async function analyzeWithAI(
  subject: Property,
  comps: Property[]
): Promise<{
  analysis: string;
  compNotes: Record<string, string>;
  valuationSummary: string;
  confidence: number;
}> {
  const prompt = `You are a commercial real estate analyst. Analyze the following subject property and comparable sales to provide a valuation opinion.

SUBJECT PROPERTY:
${JSON.stringify(subject, null, 2)}

COMPARABLE PROPERTIES:
${comps.map((c, i) => `Comp ${i + 1}:\n${JSON.stringify(c, null, 2)}`).join('\n\n')}

Please provide:
1. A brief analysis of how each comp compares to the subject (strengths/weaknesses as a comp)
2. Suggested adjustments for each comp
3. A value conclusion based on the adjusted comps
4. Your confidence level in the analysis (0-100%)
5. Any market observations or recommendations

Format your response as JSON with the following structure:
{
  "analysis": "Overall analysis text",
  "compNotes": {
    "comp_id_1": "Notes for comp 1",
    "comp_id_2": "Notes for comp 2"
  },
  "valuationSummary": "Value conclusion text",
  "estimatedValue": 0,
  "valueRange": { "low": 0, "high": 0 },
  "confidence": 85
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Extract JSON from response
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          analysis: parsed.analysis || '',
          compNotes: parsed.compNotes || {},
          valuationSummary: parsed.valuationSummary || '',
          confidence: parsed.confidence || 70,
        };
      }
    }

    return {
      analysis: 'Unable to parse AI response',
      compNotes: {},
      valuationSummary: '',
      confidence: 0,
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      analysis: 'AI analysis unavailable',
      compNotes: {},
      valuationSummary: '',
      confidence: 0,
    };
  }
}

// Parse offering memorandum text with AI
export async function parseOfferingMemorandum(text: string): Promise<Partial<Property>> {
  const prompt = `You are a commercial real estate data extraction specialist. Extract property information from the following offering memorandum text and return it as structured JSON.

TEXT:
${text}

Extract all available information and return as JSON matching this structure (use null for missing fields):
{
  "name": "Property name",
  "address": "Street address",
  "city": "City",
  "state": "State (2-letter code)",
  "zipCode": "Zip code",
  "county": "County",
  "propertyType": "MULTIFAMILY|OFFICE|RETAIL|INDUSTRIAL|MIXED_USE|LAND|HOTEL|SELF_STORAGE|SENIOR_LIVING|STUDENT_HOUSING|SINGLE_FAMILY|OTHER",
  "propertySubType": "e.g., Garden-style, Mid-rise",
  "yearBuilt": 1990,
  "yearRenovated": 2020,
  "units": 100,
  "squareFeet": 50000,
  "lotSizeAcres": 5.0,
  "avgUnitSize": 850,
  "listPrice": 10000000,
  "grossPotentialRent": 1200000,
  "effectiveGrossIncome": 1140000,
  "otherIncome": 50000,
  "vacancyRate": 0.05,
  "operatingExpenses": 450000,
  "noi": 690000,
  "capRate": 0.069,
  "occupancy": 0.95,
  "condition": "EXCELLENT|GOOD|AVERAGE|FAIR|POOR",
  "quality": "CLASS_A|CLASS_B|CLASS_C|CLASS_D",
  "amenities": "Pool, Fitness Center, Clubhouse",
  "notes": "Any other relevant notes"
}

Only include fields where you have data. Return valid JSON only.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Clean up null values
        const cleaned: Partial<Property> = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value !== null && value !== undefined) {
            (cleaned as Record<string, unknown>)[key] = value;
          }
        }
        return cleaned;
      }
    }
    return {};
  } catch (error) {
    console.error('OM parsing error:', error);
    return {};
  }
}

// Generate valuation using multiple approaches
export function generateValuation(
  subject: Property,
  compAnalyses: CompAnalysis[]
): Partial<Valuation> {
  const valuation: Partial<Valuation> = {
    propertyId: subject.id,
  };

  // Sales Comparison Approach
  if (compAnalyses.length > 0) {
    const adjustedPrices = compAnalyses
      .filter((c) => c.adjustedPrice)
      .map((c) => c.adjustedPrice!);

    if (adjustedPrices.length > 0) {
      // Weight by similarity score
      const weightedSum = compAnalyses.reduce((sum, c) => {
        const weight = (c.similarityScore || 50) / 100;
        return sum + (c.adjustedPrice || 0) * weight;
      }, 0);
      const totalWeight = compAnalyses.reduce((sum, c) => {
        return sum + (c.similarityScore || 50) / 100;
      }, 0);

      valuation.salesCompValue = weightedSum / totalWeight;
    }
  }

  // Income Approach
  if (subject.noi && subject.marketCapRate) {
    valuation.incomeValue = subject.noi / subject.marketCapRate;
  } else if (subject.noi && subject.capRate) {
    valuation.incomeValue = subject.noi / subject.capRate;
  }

  // Reconcile values
  const values = [valuation.salesCompValue, valuation.incomeValue].filter(
    (v) => v !== undefined
  ) as number[];

  if (values.length > 0) {
    // Weight sales comp more heavily if we have good comps
    if (valuation.salesCompValue && valuation.incomeValue) {
      const avgSimilarity =
        compAnalyses.reduce((sum, c) => sum + (c.similarityScore || 50), 0) /
        compAnalyses.length;
      const salesWeight = avgSimilarity / 100;
      valuation.estimatedValue =
        valuation.salesCompValue * salesWeight +
        valuation.incomeValue * (1 - salesWeight);
    } else {
      valuation.estimatedValue = values[0];
    }

    // Calculate range (+/- 5-10%)
    const variance = values.length > 1 ? 0.05 : 0.1;
    valuation.valueLow = valuation.estimatedValue * (1 - variance);
    valuation.valueHigh = valuation.estimatedValue * (1 + variance);

    // Per-unit metrics
    if (subject.units) {
      valuation.valuePerUnit = valuation.estimatedValue / subject.units;
    }
    if (subject.squareFeet) {
      valuation.valuePerSqFt = valuation.estimatedValue / subject.squareFeet;
    }

    // Confidence based on data quality
    let confidence = 0.5;
    if (compAnalyses.length >= 3) confidence += 0.2;
    if (valuation.salesCompValue && valuation.incomeValue) confidence += 0.15;
    if (compAnalyses.some((c) => (c.similarityScore || 0) > 80)) confidence += 0.15;
    valuation.confidence = Math.min(confidence, 1);
  }

  return valuation;
}
