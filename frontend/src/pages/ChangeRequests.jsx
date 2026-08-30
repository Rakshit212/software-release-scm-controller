import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiPlus, FiFilter, FiSearch, FiEdit2, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const ChangeRequests = () => {
  const [crs, setCrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New CR form state
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', type: 'Feature'
  });

  const fetchCRs = async () => {
    try {
      const response = await api.get('/api/change-requests');
      setCrs(response.data);
    } catch (error) {
      console.error("Error fetching CRs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCRs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/change-requests', formData);
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'Medium', type: 'Feature' });
      fetchCRs();
    } catch (error) {
      console.error("Failed to create CR", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'Under Review': 'bg-purple-100 text-purple-800',
      'Approved': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800',
      'In Development': 'bg-amber-100 text-amber-800',
      'Testing': 'bg-indigo-100 text-indigo-800',
      'Ready for Release': 'bg-teal-100 text-teal-800',
      'Released': 'bg-gray-100 text-gray-800',
    };
    return `px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'Low': 'text-gray-500',
      'Medium': 'text-blue-500',
      'High': 'text-orange-500',
      'Critical': 'text-red-600 font-bold',
    };
    return <span className={styles[priority]}>{priority}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Change Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track software change requests.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center">
            <FiPlus className="mr-2" /> New Request
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400" />
          </div>
          <input 
            type="text" 
            className="input-field pl-10" 
            placeholder="Search by ID, title, or module..."
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center">
            <FiFilter className="mr-2" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-4 text-center text-slate-500">Loading...</td></tr>
              ) : crs.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No change requests found.</td></tr>
              ) : (
                crs.map((cr) => (
                  <tr key={cr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">{cr.cr_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-800">
                      <div className="truncate max-w-xs" title={cr.title}>{cr.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{cr.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getPriorityBadge(cr.priority)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={getStatusBadge(cr.status)}>{cr.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(cr.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mx-2" title="View Details"><FiEye /></button>
                      <button className="text-slate-600 hover:text-slate-900 mx-2" title="Edit"><FiEdit2 /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
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
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                      New Change Request
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Title</label>
                        <input 
                          type="text" 
                          required 
                          className="mt-1 input-field" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <textarea 
                          required 
                          rows="3" 
                          className="mt-1 input-field"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Priority</label>
                          <select className="mt-1 input-field bg-white" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700">Type</label>
                          <select className="mt-1 input-field bg-white" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                            <option>Bug Fix</option>
                            <option>Feature</option>
                            <option>Enhancement</option>
                            <option>Security</option>
                            <option>Configuration</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-100">
                <button type="button" onClick={handleSubmit} className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                  Submit Request
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

export default ChangeRequests;
