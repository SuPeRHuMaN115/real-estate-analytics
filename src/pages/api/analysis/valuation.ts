import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { ApiResponse } from '@/types';
import { generateValuation, analyzeWithAI } from '@/lib/analysis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { propertyId, includeComps = true } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: 'propertyId is required',
      });
    }

    // Get property with existing comp analyses
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        subjectComps: {
          include: { comp: true },
        },
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    // Generate valuation
    const valuationData = generateValuation(
      property as never,
      property.subjectComps as never[]
    );

    // Get AI analysis if available and we have comps
    let aiSummary = null;
    if (process.env.ANTHROPIC_API_KEY && property.subjectComps.length > 0) {
      const comps = property.subjectComps.map(ca => ca.comp);
      const aiResult = await analyzeWithAI(property as never, comps as never[]);
      aiSummary = aiResult.valuationSummary;
      valuationData.aiSummary = aiResult.analysis;
      valuationData.aiRecommendations = aiResult.valuationSummary;
    }

    // Only create valuation if we have an estimated value
    if (!valuationData.estimatedValue) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient data to generate valuation. Need either comparable sales or income data.',
      });
    }

    // Save valuation
    const valuation = await prisma.valuation.create({
      data: {
        propertyId: property.id,
        salesCompValue: valuationData.salesCompValue,
        incomeValue: valuationData.incomeValue,
        estimatedValue: valuationData.estimatedValue,
        valueLow: valuationData.valueLow,
        valueHigh: valuationData.valueHigh,
        confidence: valuationData.confidence,
        valuePerUnit: valuationData.valuePerUnit,
        valuePerSqFt: valuationData.valuePerSqFt,
        aiSummary: valuationData.aiSummary,
        aiRecommendations: valuationData.aiRecommendations,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        valuation,
        property,
        compCount: property.subjectComps.length,
        aiSummary,
      },
    });
  } catch (error) {
    console.error('POST /api/analysis/valuation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate valuation',
    });
  }
}
