'use client';

import { useState } from 'react';

export default function RegisterBrandPage() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    country: '',
    website: '',
    dropshipping: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`Registered brand: ${formData.name}`);
    // Later: Send this to Supabase
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register Your Brand</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Brand Name" onChange={handleChange} className="w-full p-2 border" />
        <input name="industry" placeholder="Industry" onChange={handleChange} className="w-full p-2 border" />
        <input name="country" placeholder="Country" onChange={handleChange} className="w-full p-2 border" />
        <input name="website" placeholder="Website or Contact" onChange={handleChange} className="w-full p-2 border" />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="dropshipping" onChange={handleChange} />
          <span>Supports Dropshipping</span>
        </label>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
