interface Property {
  id: number;
  address: string;
  price: number;
  image: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="border rounded p-4 shadow">
      <img
        src={property.image}
        alt={property.address}
        className="mb-2 w-full h-40 object-cover"
      />
      <h2 className="font-semibold">{property.address}</h2>
      <p>${property.price.toLocaleString()}</p>
    </div>
  );
}
