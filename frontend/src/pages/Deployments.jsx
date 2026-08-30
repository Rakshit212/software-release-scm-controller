import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiServer, FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

const Deployments = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This assumes there's a deployments endpoint, mocking it for UI if absent
    const fetchDeployments = async () => {
      try {
        const response = await api.get('/api/releases');
        // Let's pretend releases approved are ready for deployment
        const readyForDeploy = response.data.filter(r => r.status === 'Approved' || r.status === 'Released');
        setDeployments(readyForDeploy);
      } catch (error) {
        console.error("Error fetching deployments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Deployments</h1>
          <p className="text-slate-500 text-sm mt-1">Manage production deployments and deployment approvals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">Loading deployments...</div>
        ) : deployments.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">No pending deployments.</div>
        ) : (
          deployments.map((deployment) => (
            <div key={deployment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <FiServer className="text-indigo-500 text-xl mr-2" />
                    <h3 className="text-lg font-semibold text-slate-800">Release {deployment.version}</h3>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    deployment.status === 'Released' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {deployment.status === 'Released' ? 'Deployed' : 'Pending Deployment'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{deployment.name}</p>
                <div className="text-xs text-slate-500 mb-6">
                  Target Environment: <strong>Production</strong>
                </div>
              </div>
              
              {deployment.status !== 'Released' && (
                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
                    <FiCheck className="mr-1" /> Deploy Now
                  </button>
                  <button className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
                    <FiX className="mr-1" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Deployments;
