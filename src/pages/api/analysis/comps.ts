import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { ApiResponse } from '@/types';
import {
  calculateSimilarityScore,
  calculateAdjustments,
  analyzeWithAI,
} from '@/lib/analysis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { subjectPropertyId, compPropertyIds, autoFindComps, maxComps = 5 } = req.body;

    if (!subjectPropertyId) {
      return res.status(400).json({
        success: false,
        error: 'subjectPropertyId is required',
      });
    }

    // Get subject property
    const subject = await prisma.property.findUnique({
      where: { id: subjectPropertyId },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject property not found',
      });
    }

    let compIds: string[] = compPropertyIds || [];

    // Auto-find comps if requested
    if (autoFindComps || compIds.length === 0) {
      const potentialComps = await prisma.property.findMany({
        where: {
          id: { not: subject.id },
          isSubjectProperty: false,
          propertyType: subject.propertyType,
          // Prefer same state
          state: subject.state,
        },
        take: maxComps * 2, // Get more than needed to filter
      });

      // Score and sort by similarity
      const scored = potentialComps.map(comp => ({
        comp,
        score: calculateSimilarityScore(subject as never, comp as never),
      }));

      scored.sort((a, b) => b.score - a.score);
      compIds = scored.slice(0, maxComps).map(s => s.comp.id);
    }

    // Get comp properties
    const comps = await prisma.property.findMany({
      where: { id: { in: compIds } },
    });

    if (comps.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No comparable properties found',
      });
    }

    // Calculate analysis for each comp
    const analyses = [];
    for (const comp of comps) {
      const similarityScore = calculateSimilarityScore(subject as never, comp as never);
      const adjustments = calculateAdjustments(subject as never, comp as never);

      // Create or update comp analysis
      const analysis = await prisma.compAnalysis.upsert({
        where: {
          subjectId_compId: {
            subjectId: subject.id,
            compId: comp.id,
          },
        },
        create: {
          subjectId: subject.id,
          compId: comp.id,
          similarityScore,
          ...adjustments,
        },
        update: {
          similarityScore,
          ...adjustments,
        },
        include: {
          comp: true,
        },
      });

      analyses.push(analysis);
    }

    // Run AI analysis if API key is available
    let aiAnalysis = null;
    if (process.env.ANTHROPIC_API_KEY) {
      aiAnalysis = await analyzeWithAI(subject as never, comps as never[]);

      // Update analyses with AI notes
      for (const analysis of analyses) {
        const compNotes = aiAnalysis.compNotes[analysis.compId];
        if (compNotes) {
          await prisma.compAnalysis.update({
            where: { id: analysis.id },
            data: {
              aiNotes: compNotes,
              aiConfidence: aiAnalysis.confidence / 100,
            },
          });
          analysis.aiNotes = compNotes;
          analysis.aiConfidence = aiAnalysis.confidence / 100;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        subject,
        analyses,
        aiAnalysis: aiAnalysis ? {
          summary: aiAnalysis.analysis,
          valuationSummary: aiAnalysis.valuationSummary,
          confidence: aiAnalysis.confidence,
        } : null,
      },
    });
  } catch (error) {
    console.error('POST /api/analysis/comps error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze comps',
    });
  }
}
