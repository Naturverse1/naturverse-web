import React, { useState } from "react";
import { useCart } from "../../context/CartContext";

const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const [walletConnected, setWalletConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      setWalletConnected(true);
    }
  };

  const handleApproveAndPay = async () => {
    alert("Stub: Approve + Pay flow will be implemented next PR.");
    clearCart();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="mb-6">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between border-b py-2">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{i.price * i.quantity} NATUR</span>
              </li>
            ))}
          </ul>

          <p className="font-bold mb-6">Subtotal: {subtotal} NATUR</p>

          {!walletConnected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="mb-6">
              <p>Connected: {address}</p>
            </div>
          )}

          <button
            disabled={!walletConnected || subtotal === 0}
            onClick={handleApproveAndPay}
            className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            Pay with NATUR
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;

