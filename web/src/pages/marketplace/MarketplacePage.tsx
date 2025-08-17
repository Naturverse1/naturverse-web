import React from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const mockProducts = [
  { id: "1", name: "Navatar Plushie", price: 25, image: "/plushie.png" },
  { id: "2", name: "Turian Hoodie", price: 50, image: "/hoodie.png" },
  { id: "3", name: "Natur Token Mug", price: 15, image: "/mug.png" },
  { id: "4", name: "Wellness Blanket", price: 40, image: "/blanket.png" },
];

const MarketplacePage: React.FC = () => {
  const { add } = useCart();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockProducts.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 flex flex-col items-center">
            <img src={p.image} alt={p.name} className="w-32 h-32 object-contain mb-4" />
            <h2 className="font-semibold">{p.name}</h2>
            <p>{p.price} NATUR</p>
            <button
              onClick={() => add({ id: p.id, name: p.name, priceNatur: p.price, qty: 1, imageUrl: p.image })}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 text-right">
        <Link to="/marketplace/checkout" className="text-blue-500 underline">
          Go to Checkout →
        </Link>
      </div>
    </div>
  );
};

export default MarketplacePage;

