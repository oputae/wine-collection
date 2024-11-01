'use client';

import { useState } from 'react';
import { Wine, ArrowLeft, Upload, X, Plus } from 'lucide-react';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';

export default function AddWine() {
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
    varietal: [''],
    details: {
      alcoholContent: '',
      price: '',
      purchaseDate: '',
      purchaseLocation: '',
      quantity: 1,
      cellarLocation: ''
    },
    tasting: {
      date: '',
      rating: '',
      notes: '',
      aromas: [''],
      pairings: ['']
    },
    image: {
      url: '',
      alt: ''
    }
  });

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

  // Handle dynamic arrays (varietals, aromas, pairings)
  const handleArrayChange = (section, index, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (section === 'varietal') {
        newData.varietal[index] = value;
      } else {
        newData.tasting[section][index] = value;
      }
      return newData;
    });
  };

  const addArrayItem = (section) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (section === 'varietal') {
        newData.varietal = [...prev.varietal, ''];
      } else {
        newData.tasting[section] = [...prev.tasting[section], ''];
      }
      return newData;
    });
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (section === 'varietal') {
        newData.varietal = prev.varietal.filter((_, i) => i !== index);
      } else {
        newData.tasting[section] = prev.tasting[section].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

 

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/wines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.log('Server response:', data);  // Debug log
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      console.log('Wine added successfully:', data);
      alert('Wine added successfully!');
      // Comment out redirect for now
      // window.location.href = `/wines/${data.slug}`;
      
    } catch (error) {
      console.error('Full error details:', error);
      alert(`Error adding wine: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e, section = null, field = null) => {
    const { name, value } = e.target;
    
    if (section && field) {
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
              <h1 className="text-2xl font-bold">Add New Wine</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
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
                  className="w-full p-2 border rounded-md"
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
                  className="w-full p-2 border rounded-md"
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
                  className="w-full p-2 border rounded-md"
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
                  className="w-full p-2 border rounded-md"
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

          {/* Varietal Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Varietals</h2>
            <div className="space-y-4">
              {formData.varietal.map((varietal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={varietal}
                    onChange={(e) => handleArrayChange('varietal', index, e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                    placeholder="e.g., Cabernet Sauvignon"
                  />
                  {formData.varietal.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('varietal', index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('varietal')}
                className="flex items-center gap-2 text-[#722F37] hover:text-[#8B3741]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Varietal</span>
              </button>
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
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., France"
                  required
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
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Bordeaux"
                />
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.details.purchaseDate}
                  onChange={(e) => handleChange(e, 'details', 'purchaseDate')}
                  className="w-full p-2 border rounded-md"
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
                  className="w-full p-2 border rounded-md"
                  min="0"
                  step="0.01"
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
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Wine Merchant"
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
                  className="w-full p-2 border rounded-md"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alcohol Content (%)
                </label>
                <input
                  type="number"
                  value={formData.details.alcoholContent}
                  onChange={(e) => handleChange(e, 'details', 'alcoholContent')}
                  className="w-full p-2 border rounded-md"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cellar Location
                </label>
                <input
                  type="text"
                  value={formData.details.cellarLocation}
                  onChange={(e) => handleChange(e, 'details', 'cellarLocation')}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Rack 3, Position 12"
                />
              </div>
            </div>
          </div>

          {/* Tasting Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tasting Notes</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tasting Date
                  </label>
                  <input
                    type="date"
                    value={formData.tasting.date}
                    onChange={(e) => handleChange(e, 'tasting', 'date')}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    value={formData.tasting.rating}
                    onChange={(e) => handleChange(e, 'tasting', 'rating')}
                    className="w-full p-2 border rounded-md"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tasting Notes
                </label>
                <textarea
                  value={formData.tasting.notes}
                  onChange={(e) => handleChange(e, 'tasting', 'notes')}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Describe the wine's characteristics..."
                />
              </div>

              {/* Aromas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aromas
                  </label>
                  {formData.tasting.aromas.map((aroma, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={aroma}
                        onChange={(e) => handleArrayChange('aromas', index, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder="e.g., Cherry, Vanilla, Oak"
                      />
                      {formData.tasting.aromas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('aromas', index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('aromas')}
                    className="flex items-center gap-2 text-[#722F37] hover:text-[#8B3741]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Aroma</span>
                  </button>
                </div>
  
                {/* Food Pairings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Pairings
                  </label>
                  {formData.tasting.pairings.map((pairing, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={pairing}
                        onChange={(e) => handleArrayChange('pairings', index, e.target.value)}
                        className="flex-1 p-2 border rounded-md"
                        placeholder="e.g., Beef, Cheese, Chocolate"
                      />
                      {formData.tasting.pairings.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('pairings', index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('pairings')}
                    className="flex items-center gap-2 text-[#722F37] hover:text-[#8B3741]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Food Pairing</span>
                  </button>
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
                          alt="Uploaded wine" 
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
  
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#722F37] text-white px-6 py-2 rounded-lg hover:bg-[#8B3741] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Adding Wine...' : 'Add Wine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }