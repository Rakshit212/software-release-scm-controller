import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiUsers, FiUser, FiMail } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users & Roles</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform access and role-based permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{user.full_name}</h3>
                <div className="text-sm text-slate-500 flex items-center mb-1">
                  <FiMail className="mr-1 text-xs" /> {user.email}
                </div>
                <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full font-medium">
                  {user.role?.name || 'User'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
