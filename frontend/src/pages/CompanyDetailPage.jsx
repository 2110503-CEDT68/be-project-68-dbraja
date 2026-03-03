import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    api.get(`/companies/${id}`)
      .then((res) => setCompany(res.data.data))
      .catch(() => setError('Company not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);
    try {
      await api.post('/registrations', { apptDate, company: id });
      setRegSuccess('Interview registered successfully!');
      setApptDate('');
    } catch (err) {
      setRegError(err.response?.data?.error || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        ← Back
      </button>
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{company.name}</h1>
        <div className="text-sm text-gray-500 space-y-1 mb-6">
          <p>📍 {company.address}</p>
          <p>📞 {company.tel}</p>
          {company.website && (
            <p>
              🌐{' '}
              <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                {company.website}
              </a>
            </p>
          )}
        </div>
        <p className="text-gray-700 mb-8">{company.description}</p>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Register for Interview</h2>
          <p className="text-xs text-gray-400 mb-3">Interview dates: May 10–13, 2022</p>
          {regSuccess && (
            <div className="bg-green-50 border border-green-300 text-green-700 text-sm rounded px-4 py-2 mb-4">
              {regSuccess}
            </div>
          )}
          {regError && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded px-4 py-2 mb-4">
              {regError}
            </div>
          )}
          {user ? (
            <form onSubmit={handleRegister} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  min="2022-05-10"
                  max="2022-05-13"
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={regLoading}
                className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {regLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500">
              Please{' '}
              <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-medium">
                sign in
              </button>{' '}
              to register for an interview.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
