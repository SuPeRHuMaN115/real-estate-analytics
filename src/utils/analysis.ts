interface Property {
  id: number;
  price: number;
}

export function getAveragePrice(properties: Property[]): number {
  if (!properties.length) return 0;
  const total = properties.reduce((sum, p) => sum + p.price, 0);
  return Math.round(total / properties.length);
}
