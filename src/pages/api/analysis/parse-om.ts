import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { ApiResponse, propertyInputSchema } from '@/types';
import { parseOfferingMemorandum, calculateMetrics } from '@/lib/analysis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { text, createProperty = false } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Offering memorandum text is required',
      });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(400).json({
        success: false,
        error: 'AI API key not configured. Cannot parse offering memorandum.',
      });
    }

    // Parse the OM text with AI
    const parsedData = await parseOfferingMemorandum(text);

    if (Object.keys(parsedData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract property data from text',
      });
    }

    // Store the OM record
    const om = await prisma.offeringMemorandum.create({
      data: {
        propertyName: parsedData.name || parsedData.address || 'Unknown Property',
        rawText: text,
        parsedData: JSON.stringify(parsedData),
        extractionStatus: 'completed',
      },
    });

    let property = null;

    // Optionally create the property
    if (createProperty) {
      // Validate the parsed data
      const validation = propertyInputSchema.safeParse({
        ...parsedData,
        isSubjectProperty: true,
      });

      if (validation.success) {
        const metrics = calculateMetrics(validation.data);
        property = await prisma.property.create({
          data: {
            ...validation.data,
            ...metrics,
          },
        });

        // Link property to OM
        await prisma.offeringMemorandum.update({
          where: { id: om.id },
          data: { propertyId: property.id },
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        parsedData,
        offeringMemorandum: om,
        property,
      },
    });
  } catch (error) {
    console.error('POST /api/analysis/parse-om error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to parse offering memorandum',
    });
  }
}
