import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiBox, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Releases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await api.get('/api/releases');
        setReleases(response.data);
      } catch (error) {
        console.error("Error fetching releases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Releases</h1>
          <p className="text-slate-500 text-sm mt-1">Manage software release versions and lifecycles.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary flex items-center">
            <FiPlus className="mr-2" /> Create Release
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500">Loading releases...</div>
        ) : releases.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            No releases found. Create the first one!
          </div>
        ) : (
          releases.map(release => (
            <div key={release.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FiBox className="text-blue-500 text-xl mr-2" />
                    <h3 className="text-lg font-semibold text-slate-800">{release.version}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'Released' ? 'bg-emerald-100 text-emerald-800' : 
                    release.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
                <h4 className="text-md font-medium text-slate-700 mb-2">{release.name}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{release.description || 'No description provided.'}</p>
                <div className="flex justify-between text-xs text-slate-500 border-t pt-4">
                  <span>Type: {release.type}</span>
                  <span>{release.release_date ? format(new Date(release.release_date), 'MMM dd, yyyy') : 'No Date'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Releases;
