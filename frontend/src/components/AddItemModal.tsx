import { useState, useEffect } from 'react';

interface AddItemModalProps {
  onSubmit: (data: FormData) => Promise<void> | void;
  onClose: () => void;
}

export function AddItemModal({ onSubmit, onClose }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    contactInfo: '',
    type: 'LOST' as 'LOST' | 'FOUND',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // ESC close + scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB.');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isValid = () => {
    return (
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.category.trim().length > 0 &&
      formData.location.trim().length > 0 &&
      formData.date.trim().length > 0 &&
      formData.contactInfo.trim().length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    setSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('category', formData.category.trim());
    data.append('location', formData.location.trim());
    data.append('date', formData.date);
    data.append('contactInfo', formData.contactInfo.trim());
    data.append('type', formData.type);

    if (imageFile) {
      data.append('image', imageFile);
    }

    await onSubmit(data);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-black border border-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 border-b border-white pb-4">
          Add Item
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            >
              <option value="LOST">Lost Item</option>
              <option value="FOUND">Found Item</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Black Backpack, iPhone 13"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description..."
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics, Clothing, Accessories"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="Library, Lab 3, Classroom B12"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Contact Information *
            </label>
            <input
              type="text"
              name="contactInfo"
              required
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Email or phone"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white file:text-black file:cursor-pointer hover:file:bg-gray-200"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 rounded-lg font-medium transition-all duration-200 hover:border-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid() || submitting}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
