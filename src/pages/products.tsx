import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, storage, auth } from "../lib/firebase";
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imageUrl = "";
      if (image) {
        const imgRef = ref(storage, `product-images/${Date.now()}-${image.name}`);
        await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, "products"), {
        name,
        desc,
        price: parseFloat(price),
        image: imageUrl,
        createdBy: auth.currentUser ? auth.currentUser.uid : null,
        createdAt: serverTimestamp(),
      });
      setName(""); setDesc(""); setPrice(""); setImage(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-black dark:to-zinc-900 text-black dark:text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Product Management</h1>
        <form className="space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg mb-10" onSubmit={handleAdd}>
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
          <textarea className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
          <input className="w-full p-3 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded font-semibold" disabled={loading}>{loading ? "Adding..." : "Add Product"}</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((p) => (
            <div key={p.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 flex flex-col">
              {p.image && <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded mb-2" />}
              <h2 className="text-xl font-bold mb-1">{p.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-1">{p.desc}</p>
              <p className="font-semibold mb-2">${p.price}</p>
              <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded self-end">Delete</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Products;
