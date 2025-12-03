import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a subject property
  const subject = await prisma.property.create({
    data: {
      name: 'Sunset Gardens Apartments',
      address: '123 Sunset Boulevard',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      county: 'Travis',
      propertyType: 'MULTIFAMILY',
      propertySubType: 'Garden-style',
      yearBuilt: 1998,
      yearRenovated: 2020,
      units: 150,
      squareFeet: 135000,
      avgUnitSize: 900,
      lotSizeAcres: 8.5,
      listPrice: 25000000,
      pricePerUnit: 166667,
      pricePerSqFt: 185,
      grossPotentialRent: 2400000,
      effectiveGrossIncome: 2280000,
      otherIncome: 120000,
      vacancyRate: 0.05,
      operatingExpenses: 900000,
      expenseRatio: 0.395,
      noi: 1500000,
      capRate: 0.06,
      occupancy: 0.95,
      condition: 'GOOD',
      quality: 'CLASS_B',
      amenities: 'Pool, Fitness Center, Clubhouse, Dog Park, Business Center',
      source: 'Broker - CBRE',
      isSubjectProperty: true,
    },
  });

  console.log('Created subject property:', subject.name);

  // Create comparable properties
  const comp1 = await prisma.property.create({
    data: {
      name: 'Oak Ridge Apartments',
      address: '456 Oak Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704',
      county: 'Travis',
      propertyType: 'MULTIFAMILY',
      propertySubType: 'Garden-style',
      yearBuilt: 2001,
      units: 120,
      squareFeet: 108000,
      avgUnitSize: 900,
      lotSizeAcres: 6.2,
      salePrice: 19200000,
      pricePerUnit: 160000,
      pricePerSqFt: 178,
      noi: 1150000,
      capRate: 0.06,
      occupancy: 0.94,
      condition: 'GOOD',
      quality: 'CLASS_B',
      amenities: 'Pool, Fitness Center, Clubhouse',
      source: 'CoStar',
      isSubjectProperty: false,
    },
  });

  const comp2 = await prisma.property.create({
    data: {
      name: 'Maple Creek Residences',
      address: '789 Maple Avenue',
      city: 'Austin',
      state: 'TX',
      zipCode: '78702',
      county: 'Travis',
      propertyType: 'MULTIFAMILY',
      propertySubType: 'Garden-style',
      yearBuilt: 1995,
      yearRenovated: 2018,
      units: 180,
      squareFeet: 162000,
      avgUnitSize: 900,
      lotSizeAcres: 10.1,
      salePrice: 28800000,
      pricePerUnit: 160000,
      pricePerSqFt: 178,
      noi: 1800000,
      capRate: 0.0625,
      occupancy: 0.93,
      condition: 'AVERAGE',
      quality: 'CLASS_B',
      amenities: 'Pool, Laundry Facility',
      source: 'CoStar',
      isSubjectProperty: false,
    },
  });

  const comp3 = await prisma.property.create({
    data: {
      name: 'Riverside Place',
      address: '321 River Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78703',
      county: 'Travis',
      propertyType: 'MULTIFAMILY',
      propertySubType: 'Mid-rise',
      yearBuilt: 2005,
      units: 100,
      squareFeet: 95000,
      avgUnitSize: 950,
      lotSizeAcres: 3.5,
      salePrice: 18500000,
      pricePerUnit: 185000,
      pricePerSqFt: 195,
      noi: 1110000,
      capRate: 0.06,
      occupancy: 0.96,
      condition: 'EXCELLENT',
      quality: 'CLASS_A',
      amenities: 'Pool, Fitness Center, Clubhouse, Concierge, Parking Garage',
      source: 'LoopNet',
      isSubjectProperty: false,
    },
  });

  const comp4 = await prisma.property.create({
    data: {
      name: 'Cedar Park Flats',
      address: '555 Cedar Lane',
      city: 'Cedar Park',
      state: 'TX',
      zipCode: '78613',
      county: 'Williamson',
      propertyType: 'MULTIFAMILY',
      propertySubType: 'Garden-style',
      yearBuilt: 2010,
      units: 200,
      squareFeet: 180000,
      avgUnitSize: 900,
      lotSizeAcres: 12.0,
      salePrice: 30000000,
      pricePerUnit: 150000,
      pricePerSqFt: 167,
      noi: 1800000,
      capRate: 0.06,
      occupancy: 0.97,
      condition: 'GOOD',
      quality: 'CLASS_B',
      amenities: 'Pool, Fitness Center, Playground, Dog Park',
      source: 'Broker',
      isSubjectProperty: false,
    },
  });

  console.log('Created comparable properties');

  // Create comp analyses
  for (const comp of [comp1, comp2, comp3, comp4]) {
    await prisma.compAnalysis.create({
      data: {
        subjectId: subject.id,
        compId: comp.id,
        similarityScore: Math.floor(Math.random() * 20) + 70, // 70-90 score
        distanceMiles: Math.random() * 10,
      },
    });
  }

  console.log('Created comp analyses');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
