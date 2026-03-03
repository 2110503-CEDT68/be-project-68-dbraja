import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/companies')
      .then((res) => setCompanies(res.data.data))
      .catch(() => setError('Failed to load companies'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading companies...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Participating Companies</h1>
      <p className="text-gray-500 mb-8">Browse companies and register for an interview (up to 3 registrations).</p>
      {companies.length === 0 ? (
        <p className="text-gray-400">No companies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company._id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{company.name}</h2>
              <p className="text-sm text-gray-500 mb-3 flex-1 line-clamp-3">{company.description}</p>
              <div className="text-xs text-gray-400 mb-4 space-y-1">
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
              <Link
                to={`/companies/${company._id}`}
                className="block text-center bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
