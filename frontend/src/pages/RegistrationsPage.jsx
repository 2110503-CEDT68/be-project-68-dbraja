import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');

  const fetchRegistrations = () => {
    setLoading(true);
    api.get('/registrations')
      .then((res) => setRegistrations(res.data.data))
      .catch(() => setError('Failed to load registrations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert('Failed to delete registration');
    }
  };

  const handleEdit = (reg) => {
    setEditId(reg._id);
    setEditDate(reg.apptDate?.slice(0, 10) ?? '');
    setUpdateError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    try {
      const res = await api.put(`/registrations/${editId}`, { apptDate: editDate });
      setRegistrations((prev) =>
        prev.map((r) => (r._id === editId ? res.data.data : r))
      );
      setEditId(null);
    } catch (err) {
      setUpdateError(err.response?.data?.error || 'Update failed');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Registrations</h1>
      <p className="text-gray-500 mb-8 text-sm">You can register for up to 3 company interviews.</p>
      {registrations.length === 0 ? (
        <p className="text-gray-400">No registrations yet. Browse companies to register.</p>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg._id} className="bg-white rounded-lg shadow p-5">
              {editId === reg._id ? (
                <form onSubmit={handleUpdate} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Interview Date</label>
                    <input
                      type="date"
                      required
                      min="2022-05-10"
                      max="2022-05-13"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {updateError && <p className="text-red-600 text-xs mt-1">{updateError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-2 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {reg.company?.name ?? reg.company ?? 'Unknown Company'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Interview Date:{' '}
                      <span className="font-medium text-gray-700">
                        {new Date(reg.apptDate).toLocaleDateString('en-US', {
                          weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Registered: {new Date(reg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reg)}
                      className="text-sm bg-yellow-50 border border-yellow-400 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reg._id)}
                      className="text-sm bg-red-50 border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
