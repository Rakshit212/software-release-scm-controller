import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import api from '../services/api';
import { FiBox, FiGitPullRequest, FiCheckCircle, FiSend } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReleases: 0,
    activeReleases: 0,
    pendingCRs: 0,
    approvedCRs: 0,
    pendingDeployments: 0,
  });

  const [crData, setCrData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [releases, crs, approvals, deployments] = await Promise.all([
          api.get('/api/releases'),
          api.get('/api/change-requests'),
          api.get('/api/approvals'),
          api.get('/api/deployments')
        ]);
        
        const pendingCRsCount = crs.data.filter(c => c.status === 'Submitted' || c.status === 'Under Review').length;
        const approvedCRsCount = crs.data.filter(c => c.status === 'Approved' || c.status === 'Ready for Release').length;
        
        setStats({
          totalReleases: releases.data.length,
          activeReleases: releases.data.filter(r => r.status !== 'Archived' && r.status !== 'Draft').length,
          pendingCRs: pendingCRsCount,
          approvedCRs: approvedCRsCount,
          pendingDeployments: approvals.data.filter(a => a.target_type === 'deployment' && a.status === 'Pending').length
        });
        
        // Mock data for charts
        setCrData([
          { name: 'Submitted', count: pendingCRsCount || 3 },
          { name: 'Approved', count: approvedCRsCount || 5 },
          { name: 'Testing', count: 2 },
          { name: 'Released', count: 7 },
        ]);
        
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-lg ${colorClass} mr-5`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm">Download Report</button>
          <button className="btn-primary text-sm">Create Release</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Releases" 
          value={stats.totalReleases || 18} 
          icon={<FiBox className="w-6 h-6 text-blue-600" />} 
          colorClass="bg-blue-50"
        />
        <StatCard 
          title="Pending Changes" 
          value={stats.pendingCRs || 7} 
          icon={<FiGitPullRequest className="w-6 h-6 text-amber-600" />} 
          colorClass="bg-amber-50"
        />
        <StatCard 
          title="Approved Changes" 
          value={stats.approvedCRs || 42} 
          icon={<FiCheckCircle className="w-6 h-6 text-emerald-600" />} 
          colorClass="bg-emerald-50"
        />
        <StatCard 
          title="Pending Deployments" 
          value={stats.pendingDeployments || 3} 
          icon={<FiSend className="w-6 h-6 text-purple-600" />} 
          colorClass="bg-purple-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Change Requests by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40}>
                  {crData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {/* Mock recent activity */}
            {[
              { text: "v2.3.0 Released", time: "2 hours ago", type: "release" },
              { text: "CR-1024 Approved by Admin", time: "4 hours ago", type: "approval" },
              { text: "v2.2.0 Deployed to Production", time: "1 day ago", type: "deployment" },
              { text: "CR-1025 Submitted by Rakshit", time: "1 day ago", type: "cr" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`mt-0.5 w-2 h-2 rounded-full mt-2 mr-4 ${
                  activity.type === 'release' ? 'bg-blue-500' :
                  activity.type === 'approval' ? 'bg-emerald-500' :
                  activity.type === 'deployment' ? 'bg-purple-500' : 'bg-amber-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{activity.text}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
