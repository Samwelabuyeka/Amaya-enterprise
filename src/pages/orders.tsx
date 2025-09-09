import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, query, where, updateDoc, doc } from "firebase/firestore";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser ? auth.currentUser.uid : null,
        productId,
        quantity,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setProductId("");
      setQuantity(1);
      setSuccess("Order placed!");
      fetchOrders();
    } catch (err: any) {
      setError(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Order Management</h1>
        <form className="space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg mb-10" onSubmit={handleOrder}>
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Product ID" value={productId} onChange={e => setProductId(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold" disabled={loading}>{loading ? "Placing..." : "Place Order"}</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {orders.map((o) => (
            <div key={o.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 flex flex-col">
              <h2 className="text-xl font-bold mb-1">Order #{o.id}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">Product ID: {o.productId}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-1">Quantity: {o.quantity}</p>
              <p className="font-semibold mb-2">Status: {o.status}</p>
              {o.status === "pending" && (
                <button onClick={() => handleStatus(o.id, "completed")}
                  className="bg-green-600 text-white px-3 py-1 rounded self-end">Mark as Completed</button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Orders;
