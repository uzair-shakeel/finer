"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditBrandPage({ params }) {
  const [brand, setBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchBrand();
  }, [params.id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/brands/${params.id}?includeModels=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch brand');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch brand');
      }

      // Ensure IDs are strings
      const brandData = {
        ...data.data,
        _id: data.data._id.toString()
      };

      const modelsData = data.data.models?.map(model => ({
        ...model,
        _id: model._id.toString(),
        brandId: model.brandId.toString()
      })) || [];

      setBrand(brandData);
      setModels(modelsData);
    } catch (err) {
      console.error('Error fetching brand:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/brands/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update brand');
      }

      router.push('/admin/brands');
    } catch (err) {
      console.error('Error updating brand:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!brand) {
    return <div className="p-4">Brand not found</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Brand: {brand.name}</h1>
        <Link
          href={`/admin/brands/${brand._id}/models`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Manage Models
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={brand.name}
            onChange={(e) => setBrand({ ...brand, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description:</label>
          <textarea
            value={brand.description || ''}
            onChange={(e) => setBrand({ ...brand, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        <div>
          <label className="block mb-2">Display Order:</label>
          <input
            type="number"
            value={brand.displayOrder || 0}
            onChange={(e) => setBrand({ ...brand, displayOrder: parseInt(e.target.value) })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={brand.active}
              onChange={(e) => setBrand({ ...brand, active: e.target.checked })}
              className="mr-2"
            />
            Active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Models</h2>
        {models.length === 0 ? (
          <p className="text-gray-500">No models found for this brand.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model._id} className="border-t">
                    <td className="px-4 py-2">{model.name}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          model.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {model.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/admin/brands/${brand._id}/models/${model._id}/edit`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
