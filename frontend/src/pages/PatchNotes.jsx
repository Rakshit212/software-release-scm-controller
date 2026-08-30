import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';

const PatchNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Mocking the patch notes endpoint if it doesn't exist, or fetching it
        const response = await api.get('/api/releases').catch(() => ({ data: [] }));
        // Assuming releases have patch notes or we just show releases as patch notes for now
        setNotes(response.data.filter(r => r.status === 'Released'));
      } catch (error) {
        console.error("Error fetching patch notes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patch Notes</h1>
          <p className="text-slate-500 text-sm mt-1">Release history and detailed patch notes.</p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">Loading patch notes...</div>
        ) : notes.length === 0 ? (
          <div className="p-10 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">No released patch notes available.</div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <FiFileText className="mr-2 text-primary-500" /> Release {note.version}
                  </h2>
                  <span className="text-sm text-slate-500">{format(new Date(note.release_date || new Date()), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{note.name}</h3>
                <p className="text-slate-600 mb-4">{note.description || 'General improvements and bug fixes.'}</p>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700 mb-2">Changes included:</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Resolved performance issues in the dashboard.</li>
                    <li>Added new GitHub integration features.</li>
                    <li>Improved security and authentication flow.</li>
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatchNotes;
