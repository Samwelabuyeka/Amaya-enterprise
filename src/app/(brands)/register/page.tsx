'use client';
import { useState } from 'react';

export default function BrandRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    region: '',
    dropshipping: false,
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/brand/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Brand registered successfully!');
        setForm({
          name: '',
          email: '',
          website: '',
          region: '',
          dropshipping: false,
          category: '',
        });
      } else {
        setMessage(`❌ ${data.error || 'Something went wrong.'}`);
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Your Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Brand Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="website"
          placeholder="Website"
          value={form.website}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="region"
          placeholder="Region"
          value={form.region}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="dropshipping"
            checked={form.dropshipping}
            onChange={handleChange}
          />
          <span>Supports Dropshipping?</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
