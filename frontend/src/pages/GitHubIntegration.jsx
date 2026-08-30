import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiGithub, FiGitCommit, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';

const GitHubIntegration = () => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const response = await api.get('/api/github/commits');
        setCommits(response.data);
      } catch (error) {
        console.error("Error fetching github commits", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGitHubData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center">
            <FiGithub className="mr-2" /> GitHub Integration
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track commits, branches, and tags from the connected repository.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <FiGitCommit className="mr-2 text-slate-500" /> Recent Commits
          </h2>
          <span className="text-sm text-slate-500">Repository Connected</span>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-slate-500">Loading commits...</div>
        ) : commits.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No commits found or integration not configured.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {commits.map((commitData, index) => (
              <div key={index} className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-start">
                <div>
                  <h3 className="text-md font-medium text-slate-800 mb-1">{commitData.commit.message}</h3>
                  <div className="text-sm text-slate-500 flex items-center">
                    <span className="font-medium text-slate-700 mr-2">{commitData.commit.author.name}</span>
                    <span>{format(new Date(commitData.commit.author.date), 'MMM dd, yyyy HH:mm')}</span>
                  </div>
                </div>
                <div className="flex items-center text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {commitData.sha.substring(0, 7)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubIntegration;
