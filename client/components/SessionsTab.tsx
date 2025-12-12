import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  X,
  Save,
} from 'lucide-react';
import { getSessions, createSession, updateSession, deleteSession, Session, SessionData } from '../lib/api/sessions';

const SessionsTab: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState<SessionData>({
    value: '',
    label: '',
    price: 0,
    description: '',
    duration: '',
    category: 'INDIVIDUAL',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSessions();
      if (response.success) {
        // Backend returns { success: true, count: number, sessions: [] }
        const responseData = response as any;
        setSessions(responseData.sessions || responseData.data?.sessions || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        value: session.value,
        label: session.label,
        price: session.price,
        description: session.description || '',
        duration: session.duration || '',
        category: session.category,
        isActive: session.isActive,
      });
    } else {
      setEditingSession(null);
      setFormData({
        value: '',
        label: '',
        price: 0,
        description: '',
        duration: '',
        category: 'INDIVIDUAL',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setFormData({
      value: '',
      label: '',
      price: 0,
      description: '',
      duration: '',
      category: 'INDIVIDUAL',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingSession) {
        const response = await updateSession(editingSession._id, formData);
        if (response.success) {
          await fetchSessions();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to update session');
        }
      } else {
        const response = await createSession(formData);
        if (response.success) {
          await fetchSessions();
          handleCloseModal();
        } else {
          setError(response.error || 'Failed to create session');
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
      const response = await deleteSession(id);
      if (response.success) {
        await fetchSessions();
        setDeleteConfirm(null);
      } else {
        setError(response.error || 'Failed to delete session');
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
            <h1 className="text-2xl font-semibold text-[#1c1917] mb-1">Sessions</h1>
            <p className="text-sm text-stone-600">Manage sound healing sessions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSessions}
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
              <span>Add Session</span>
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

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200">
            <h3 className="text-lg font-semibold text-[#1c1917]">All Sessions</h3>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600">No sessions found. Click "Add Session" to create one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F3F0EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Label</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {sessions.map((session) => (
                    <tr key={session._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#1c1917]">{session.label}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{session.value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {session.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#1c1917]">{formatCurrency(session.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-stone-600">{session.duration || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {session.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(session)}
                            className="text-[#967BB6] hover:text-[#8569a5] transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(session._id)}
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
            <h3 className="text-lg font-semibold text-[#1c1917] mb-2">Delete Session</h3>
            <p className="text-stone-600 mb-6">Are you sure you want to delete this session? This action cannot be undone.</p>
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
                {editingSession ? 'Edit Session' : 'Create New Session'}
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
                    Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
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
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'INDIVIDUAL' | 'GROUP' | 'TEACHING' })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
                    required
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="GROUP">Group</option>
                    <option value="TEACHING">Teaching</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 60 minutes"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#967BB6] focus:border-transparent"
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
                  placeholder="Session description..."
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
                      <span>{editingSession ? 'Update' : 'Create'}</span>
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

export default SessionsTab;

