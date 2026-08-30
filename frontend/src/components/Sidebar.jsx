import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiGitPullRequest, FiCheckSquare, FiSend, FiFileText, FiGithub, FiClock, FiActivity, FiUsers, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome /> },
    { name: 'Releases', path: '/releases', icon: <FiBox /> },
    { name: 'Change Requests', path: '/change-requests', icon: <FiGitPullRequest /> },
    { name: 'Approvals', path: '/approvals', icon: <FiCheckSquare /> },
    { name: 'Deployments', path: '/deployments', icon: <FiSend /> },
    { name: 'Patch Notes', path: '/patch-notes', icon: <FiFileText /> },
    { name: 'GitHub / SCM', path: '/github', icon: <FiGithub /> },
    { name: 'Release History', path: '/history', icon: <FiClock /> },
    { name: 'Audit Logs', path: '/audit', icon: <FiActivity /> },
    { name: 'Users', path: '/users', icon: <FiUsers /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl hidden md:flex h-full transition-all duration-300">
      <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-300">
          SCM Controller
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
