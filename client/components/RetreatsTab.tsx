import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Save,
} from 'lucide-react';
import { getRetreats, createRetreat, updateRetreat, deleteRetreat, Retreat, RetreatData } from '../lib/api/retreats';

const RetreatsTab: React.FC = () => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRetreat, setEditingRetreat] = useState<Retreat | null>(null);
  const [formData, setFormData] = useState<RetreatData>({
    name: '',
    price: 0,
    location: '',
    date: '',
    description: '',
    duration: '',
    maxCapacity: 20,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchRetreats();
  }, []);

  const fetchRetreats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRetreats();
      if (response.success) {
        // Backend returns { success: true, count: number, retreats: [] }
        const responseData = response as any;
        setRetreats(responseData.retreats || responseData.data?.retreats || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load retreats');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (retreat?: Retreat) => {
    if (retreat) {
      setEditingRetreat(retreat);
      setFormData({
        name: retreat.name,
        price: retreat.price,
        location: retreat.location,
        date: retreat.date,
        description: retreat.description || '',
        duration: retreat.duration || '',
        maxCapacity: retreat.maxCapacity,
        isActive: retreat.isActive,
      });
    } else {
      setEditingRetreat(null);
      setFormData({
        name: '',
        price: 0,
        location: '',
        date: '',
        description: '',
        duration: '',
        maxCapacity: 20,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRetreat(null);
    setFormData({
      name: '',
      price: 0,
      location: '',
      date: '',
      description: '',
      duration: '',
      maxCapacity: 20,
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingRetreat) {
        const response = await updateRetreat(editingRetreat._id, formData);
        if (response.success) {
          await fetchRetreats();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to update retreat');
        }
      } else {
        const response = await createRetreat(formData);
        if (response.success) {
          await fetchRetreats();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to create retreat');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const response = await deleteRetreat(id);
      if (response.success) {
        await fetchRetreats();
        setDeleteConfirm(null);
      } else {
        setError(response.error || 'Failed to delete retreat');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <RefreshCw className="w-8 h-8 text-[#967BB6] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-full mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1c1917] mb-1">Retreats</h1>
            <p className="text-sm text-stone-600">Manage sound healing retreats</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchRetreats}
              className="flex items-center space-x-2 px-4 py-2 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-[#967BB6] text-white rounded-lg hover:bg-[#8569a5] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Retreat</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Retreats Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-[#1c1917]">All Retreats</h3>
          </div>
          {retreats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">No retreats found. Click "Add Retreat" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F0EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {retreats.map((retreat) => (
                    <tr key={retreat._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#1c1917]">{retreat.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{retreat.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{formatDate(retreat.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#1c1917]">{formatCurrency(retreat.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{retreat.maxCapacity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{retreat.duration || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          retreat.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {retreat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(retreat)}
                            className="text-[#967BB6] hover:text-[#8569a5] transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(retreat._id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Delete Retreat</h3>
            <p className="text-stone-600 mb-6">Are you sure you want to delete this retreat? This action cannot be undone.</p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1c1917]">
                {editingRetreat ? 'Edit Retreat' : 'Create New Retreat'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-stone-500 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 3 days"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                  placeholder="Retreat description..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#967BB6] border-stone-300 rounded focus:ring-[#967BB6]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-stone-700">
                  Active
                </label>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#967BB6] text-white rounded-lg hover:bg-[#8569a5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingRetreat ? 'Update' : 'Create'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetreatsTab;

