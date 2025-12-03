import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { propertyInputSchema, ApiResponse } from '@/types';
import { calculateMetrics } from '@/lib/analysis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid property ID' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(id, res);
    case 'PUT':
      return handlePut(id, req, res);
    case 'DELETE':
      return handleDelete(id, res);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleGet(
  id: string,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        subjectComps: {
          include: { comp: true },
        },
        valuations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch property',
    });
  }
}

async function handlePut(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    // Check if property exists
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Property not found',
      });
    }

    const validation = propertyInputSchema.partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map(e => `${e.path}: ${e.message}`).join(', '),
      });
    }

    const data = validation.data;

    // Recalculate metrics with merged data
    const merged = { ...existing, ...data };
    const metrics = calculateMetrics(merged);
    const updateData = { ...data, ...metrics };

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('PUT /api/properties/[id] error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update property',
    });
  }
}

async function handleDelete(
  id: string,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    await prisma.property.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      data: { deleted: true },
    });
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete property',
    });
  }
}
