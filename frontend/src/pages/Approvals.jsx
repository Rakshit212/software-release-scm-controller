import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiCheckSquare, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await api.get('/api/approvals');
        setApprovals(response.data);
      } catch (error) {
        console.error("Error fetching approvals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/approvals/${id}/approve`);
      setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    } catch (error) {
      console.error("Error approving", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/api/approvals/${id}/reject`, { comments: "Rejected via UI" });
      setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    } catch (error) {
      console.error("Error rejecting", error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Approvals</h1>
          <p className="text-slate-500 text-sm mt-1">Manage pending change requests and deployment approvals.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading approvals...</div>
        ) : approvals.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No pending approvals found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {approvals.map((approval) => (
                <tr key={approval.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{approval.entity_type} #{approval.entity_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {approval.approval_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      approval.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      approval.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {approval.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {format(new Date(approval.created_at || new Date()), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {approval.status === 'Pending' && (
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleApprove(approval.id)} className="text-emerald-600 hover:text-emerald-900 flex items-center">
                          <FiCheckCircle className="mr-1" /> Approve
                        </button>
                        <button onClick={() => handleReject(approval.id)} className="text-red-600 hover:text-red-900 flex items-center">
                          <FiXCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Approvals;
