import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { propertyInputSchema, ApiResponse } from '@/types';
import { calculateMetrics } from '@/lib/analysis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    const {
      isSubject,
      propertyType,
      city,
      state,
      limit = '50',
      offset = '0'
    } = req.query;

    const where: Record<string, unknown> = {};

    if (isSubject !== undefined) {
      where.isSubjectProperty = isSubject === 'true';
    }
    if (propertyType) {
      where.propertyType = propertyType;
    }
    if (city) {
      where.city = { contains: city as string };
    }
    if (state) {
      where.state = state;
    }

    const properties = await prisma.property.findMany({
      where,
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.property.count({ where });

    return res.status(200).json({
      success: true,
      data: {
        properties,
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('GET /api/properties error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch properties',
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
) {
  try {
    const validation = propertyInputSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.errors.map(e => `${e.path}: ${e.message}`).join(', '),
      });
    }

    const data = validation.data;

    // Calculate derived metrics
    const metrics = calculateMetrics(data);
    const propertyData = { ...data, ...metrics };

    const property = await prisma.property.create({
      data: propertyData,
    });

    return res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('POST /api/properties error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create property',
    });
  }
}
