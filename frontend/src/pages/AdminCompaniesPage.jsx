import { useEffect, useState } from 'react';
import api from '../api/axios';

const EMPTY_FORM = { name: '', address: '', website: '', description: '', tel: '' };

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchCompanies = () => {
    api.get('/companies')
      .then((res) => setCompanies(res.data.data))
      .catch(() => setError('Failed to load companies'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = (company) => {
    setEditId(company._id);
    setForm({
      name: company.name,
      address: company.address,
      website: company.website || '',
      description: company.description,
      tel: company.tel,
    });
    setFormError('');
    setShowForm(true);
  };

  const handleNew = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      if (editId) {
        const res = await api.put(`/companies/${editId}`, form);
        setCompanies((prev) => prev.map((c) => (c._id === editId ? res.data.data : c)));
      } else {
        const res = await api.post('/companies', form);
        setCompanies((prev) => [...prev, res.data.data]);
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company and all its registrations?')) return;
    try {
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert('Failed to delete company');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Companies</h1>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Company
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editId ? 'Edit Company' : 'New Company'}
          </h2>
          {formError && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded px-4 py-2 mb-4">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                name="name"
                required
                maxLength={50}
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telephone *</label>
              <input
                name="tel"
                required
                value={form.tel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                required
                maxLength={500}
                rows={3}
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {formLoading ? 'Saving...' : editId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 text-sm font-semibold px-5 py-2 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {companies.length === 0 ? (
        <p className="text-gray-400">No companies yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Tel</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Address</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {companies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{company.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{company.tel}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell truncate max-w-xs">{company.address}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(company)}
                        className="text-xs bg-yellow-50 border border-yellow-400 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="text-xs bg-red-50 border border-red-300 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                      >
                        Delete
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
  );
}
