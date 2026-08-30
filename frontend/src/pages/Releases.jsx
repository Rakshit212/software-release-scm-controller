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

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    version: '', name: '', type: 'Minor', description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/releases', formData);
      setShowModal(false);
      setFormData({ version: '', name: '', type: 'Minor', description: '' });
      // Re-fetch (not defined here, so let's just refresh page or refetch)
      window.location.reload();
    } catch (error) {
      console.error("Failed to create Release", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Releases</h1>
          <p className="text-slate-500 text-sm mt-1">Manage software release versions and lifecycles.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
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

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-900 opacity-75 backdrop-blur-sm"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                      Create Release
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Version (e.g. v2.1.0)</label>
                        <input type="text" required className="mt-1 input-field" value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Name</label>
                        <input type="text" required className="mt-1 input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Type</label>
                        <select className="mt-1 input-field bg-white" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                          <option>Major</option>
                          <option>Minor</option>
                          <option>Patch</option>
                          <option>Hotfix</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea required rows="2" className="mt-1 input-field" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                <button type="button" onClick={handleSubmit} className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                  Create Release
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="mt-3 w-full inline-flex justify-center rounded-lg border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Releases;
