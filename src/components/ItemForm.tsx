import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
} from 'lucide-react';
import { Item, ItemCategory, ItemRequest, ItemType } from '../types/item';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../utils/constants';

import { useAuth } from '../context/AuthContext';

interface ItemFormProps {
  initialType?: ItemType;
  initialItem?: Item | null; // For editing
  onSubmit: (data: ItemRequest, imageFile?: File | null) => Promise<Item>;
  onCancel: () => void;
  isEditMode?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialType = 'LOST',
  initialItem,
  onSubmit,
  onCancel,
  isEditMode = false,
}) => {
  const { user } = useAuth();

  // Form fields
  const [itemName, setItemName] = useState(initialItem?.itemName || '');
  const [type, setType] = useState<ItemType>(initialItem?.type || initialType);
  const [category, setCategory] = useState<ItemCategory>(initialItem?.category || 'ELECTRONICS');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [incidentDate, setIncidentDate] = useState(
    initialItem?.incidentDate || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(initialItem?.description || '');
  const [contactName, setContactName] = useState(
    initialItem?.contactName || (user ? user.name : '')
  );
  const [contactEmail, setContactEmail] = useState(
    initialItem?.contactEmail || (user ? user.email : '')
  );
  const [contactPhone, setContactPhone] = useState(initialItem?.contactPhone || '');

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialItem?.imageUrl || null);

  // States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initial values if editing changes
  useEffect(() => {
    if (initialItem) {
      setItemName(initialItem.itemName);
      setType(initialItem.type);
      setCategory(initialItem.category);
      setLocation(initialItem.location);
      setIncidentDate(initialItem.incidentDate);
      setDescription(initialItem.description);
      setContactName(initialItem.contactName);
      setContactEmail(initialItem.contactEmail || '');
      setContactPhone(initialItem.contactPhone || '');
      setImagePreview(initialItem.imageUrl || null);
    }
  }, [initialItem]);

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5 MB' }));
      return;
    }

    // Validate type (JPG, PNG, WEBP)
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: 'Only JPG, PNG, and WEBP formats are accepted' }));
      return;
    }

    setErrors(prev => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    } else if (itemName.length > 150) {
      newErrors.itemName = 'Item name cannot exceed 150 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Item description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters of description';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    if (!location.trim()) {
      newErrors.location = 'Campus location is required';
    }

    if (!incidentDate) {
      newErrors.incidentDate = 'Incident date is required';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.trim())) {
        newErrors.contactEmail = 'Please provide a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const payload: ItemRequest = {
      itemName: itemName.trim(),
      description: description.trim(),
      type,
      category,
      location: location.trim(),
      incidentDate,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
    };

    try {
      const result = await onSubmit(payload, imageFile);
      setSuccessMessage(
        isEditMode
          ? `Report #${result.id} updated successfully!`
          : `Report #${result.id} submitted successfully! Your listing is now active.`
      );
    } catch (err: unknown) {
      const error = err as { message?: string };
      setServerError(
        error.message || 'An error occurred while submitting the report to the server. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              type === 'LOST' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {isEditMode ? 'Edit Report' : type === 'LOST' ? 'Lost Item Report' : 'Found Item Report'}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEditMode ? `Edit "${initialItem?.itemName}"` : `Report a ${type === 'LOST' ? 'Lost' : 'Found'} Belonging`}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Provide detailed information to help students and staff identify the item.
          </p>
        </div>
        <button
          onClick={onCancel}
          type="button"
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold">{successMessage}</p>
            <p className="text-xs text-emerald-700 mt-1">
              Redirecting you to view the report...
            </p>
          </div>
        </div>
      )}

      {/* Server error alert */}
      {serverError && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Submission Failed</p>
            <p className="text-xs text-rose-700 mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Report Type Selector (if not editing) */}
        {!isEditMode && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Report Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('LOST')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition cursor-pointer ${
                  type === 'LOST'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>I Lost Something</span>
              </button>
              <button
                type="button"
                onClick={() => setType('FOUND')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition cursor-pointer ${
                  type === 'FOUND'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>I Found Something</span>
              </button>
            </div>
          </div>
        )}

        {/* Item Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>
              Item Name <span className="text-rose-500">*</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">{itemName.length}/150</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              maxLength={150}
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="e.g. Blue Hydro Flask 32oz, MacBook Air M2, Set of Dorm Keys..."
              className={`w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                errors.itemName
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.itemName && <p className="text-xs text-rose-500 mt-1">{errors.itemName}</p>}
        </div>

        {/* Category & Incident Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                Category <span className="text-rose-500">*</span>
              </span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ItemCategory)}
              className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-800"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Incident Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                Date of Incident <span className="text-rose-500">*</span>
              </span>
            </label>
            <input
              type="date"
              value={incidentDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setIncidentDate(e.target.value)}
              className="w-full py-2.5 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-slate-800"
            />
            {errors.incidentDate && <p className="text-xs text-rose-500 mt-1">{errors.incidentDate}</p>}
          </div>
        </div>

        {/* Campus Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              Campus Location <span className="text-rose-500">*</span>
            </span>
          </label>
          <input
            type="text"
            list="location-options"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Central Library - 2nd Floor, Engineering Block B Lab 102..."
            className={`w-full py-2.5 px-4 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
              errors.location
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          <datalist id="location-options">
            {CAMPUS_LOCATIONS.map(loc => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
          {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Provide distinctive features, color, brand, stickers, serial numbers, contents, or circumstances..."
            className={`w-full py-2.5 px-4 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
              errors.description
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
        </div>

        {/* Optional Image Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Item Photo (Optional)
          </label>

          {imagePreview ? (
            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={imagePreview}
                alt="Selected item preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full backdrop-blur-xs transition cursor-pointer shadow-sm"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition">
              <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Click to upload photo or drag & drop</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, or WEBP up to 5 MB</p>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
          {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}
        </div>

        {/* Contact Information Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Reporter Contact Details</h3>
          <p className="text-xs text-slate-500 mb-4">
            Kept confidential. Only shared with students requesting to verify and return the item.
          </p>

          <div className="space-y-4">
            {/* Contact Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Your Full Name / Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="e.g. Alex Morgan or Library Front Desk"
                  className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                    errors.contactName
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                  }`}
                />
              </div>
              {errors.contactName && <p className="text-xs text-rose-500 mt-1">{errors.contactName}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Campus Email (Recommended)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className={`w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 transition ${
                      errors.contactEmail
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {errors.contactEmail && <p className="text-xs text-rose-500 mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="e.g. 555-019-4821"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            disabled={submitting}
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-2 ${
              type === 'LOST'
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            }`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {submitting
                ? 'Submitting to Backend...'
                : isEditMode
                ? 'Save Changes'
                : type === 'LOST'
                ? 'Publish Lost Report'
                : 'Publish Found Report'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
