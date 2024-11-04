'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { Wine, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

export default function EditWine({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    producer: '',
    vintage: new Date().getFullYear(),
    type: '',
    region: {
      country: '',
      area: ''
    },
    description: '',
    details: {
      alcoholContent: '',
      price: '',
      purchaseDate: '',
      purchaseLocation: '',
      purchaseUrl: '',
      quantity: 1
    },
    image: {
      url: '',
      alt: ''
    },
    tasting: {
      rating: '',
      notes: ''
    }
  });

  useEffect(() => {
    async function loadWine() {
      try {
        const response = await fetch(`/api/wines/${slug}`);
        const wine = await response.json();
        
        if (!response.ok) throw new Error(wine.error || 'Failed to load wine');
        
        setFormData({
          name: wine.name,
          producer: wine.producer,
          vintage: wine.vintage,
          type: wine.type,
          region: {
            country: wine.region?.country || '',
            area: wine.region?.area || ''
          },
          description: wine.description || '',
          details: {
            alcoholContent: wine.details?.alcoholContent || '',
            price: wine.details?.price || '',
            purchaseDate: wine.details?.purchaseDate || '',
            purchaseLocation: wine.details?.purchaseLocation || '',
            purchaseUrl: wine.details?.purchaseUrl || '',
            quantity: wine.details?.quantity || 1
          },
          image: wine.image || { url: '', alt: '' },
          tasting: {
            rating: wine.tasting?.rating || '',
            notes: wine.tasting?.notes || ''
          }
        });

        setImageUrl(wine.image?.url || '');
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading wine:', err);
        alert('Error loading wine data');
      }
    }

    loadWine();
  }, [slug]);

  const handleImageUpload = (result) => {
    setImageUrl(result.info.secure_url);
    setFormData(prev => ({
      ...prev,
      image: {
        url: result.info.secure_url,
        alt: prev.name || 'Wine bottle image'
      }
    }));
  };

  const handleChange = (e, section = null, field = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/wines/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const updatedWine = await response.json();
      
      if (!response.ok) throw new Error(updatedWine.error || 'Failed to update wine');

      alert('Wine updated successfully!');
      router.refresh();
      
    } catch (error) {
      console.error('Error updating wine:', error);
      alert('Error updating wine: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading wine data...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/collection"
              className="text-gray-600 hover:text-[#722F37] transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-2">
              <Wine className="h-8 w-8 text-[#722F37]" />
              <h1 className="text-2xl font-bold">Edit Wine</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  placeholder="e.g., Château Margaux"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Producer *
                </label>
                <input
                  type="text"
                  name="producer"
                  required
                  value={formData.producer}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  placeholder="e.g., Château Margaux"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vintage *
                </label>
                <input
                  type="number"
                  name="vintage"
                  required
                  value={formData.vintage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                >
                  <option value="">Select type</option>
                  <option value="Red">Red</option>
                  <option value="White">White</option>
                  <option value="Rosé">Rosé</option>
                  <option value="Sparkling">Sparkling</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Fortified">Fortified</option>
                </select>
              </div>
            </div>
          </div>

          {/* Region Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.region.country}
                  onChange={(e) => handleChange(e, 'region', 'country')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  required
                  placeholder="e.g., France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={formData.region.area}
                  onChange={(e) => handleChange(e, 'region', 'area')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  placeholder="e.g., Bordeaux"
                />
              </div>
            </div>
          </div>
{/* Description */}
<div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                placeholder="Add background information about this wine, its history, notable characteristics, or any special notes. This helps others understand what makes this wine unique and interesting."
              />
            </div>
          </div>

          {/* Wine Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Wine Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alcohol Content (%)
                </label>
                <input
                  type="number"
                  value={formData.details.alcoholContent}
                  onChange={(e) => handleChange(e, 'details', 'alcoholContent')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  step="0.1"
                  placeholder="e.g., 13.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.details.price}
                  onChange={(e) => handleChange(e, 'details', 'price')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  step="0.01"
                  placeholder="e.g., 29.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.details.purchaseDate}
                  onChange={(e) => handleChange(e, 'details', 'purchaseDate')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Location
                </label>
                <input
                  type="text"
                  value={formData.details.purchaseLocation}
                  onChange={(e) => handleChange(e, 'details', 'purchaseLocation')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  placeholder="e.g., Local Wine Shop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase URL
                </label>
                <input
                  type="url"
                  value={formData.details.purchaseUrl}
                  onChange={(e) => handleChange(e, 'details', 'purchaseUrl')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  placeholder="e.g., https://wine-shop.com/this-wine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.details.quantity}
                  onChange={(e) => handleChange(e, 'details', 'quantity')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  min="1"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Wine Image</h2>
            <CldUploadWidget
              uploadPreset="wine-collection"
              onSuccess={handleImageUpload}
            >
              {({ open }) => (
                <div 
                  onClick={() => open()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#722F37] transition-colors"
                >
                  {imageUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={imageUrl} 
                        alt="Wine" 
                        className="mx-auto max-h-48 object-contain"
                      />
                      <p className="text-sm text-gray-500">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Click to upload wine image</p>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>

          {/* Tasting Notes - Simplified */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tasting Notes</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  value={formData.tasting.rating}
                  onChange={(e) => handleChange(e, 'tasting', 'rating')}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="e.g., 4.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.tasting.notes}
                  onChange={(e) => handleChange(e, 'tasting', 'notes')}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#722F37]"
                  rows={4}
                  placeholder="Add your tasting notes, including aromas, flavors, food pairings, and any other observations..."
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/collection"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#722F37] text-white px-6 py-2 rounded-lg hover:bg-[#8B3741] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
