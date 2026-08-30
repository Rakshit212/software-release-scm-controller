import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Releases from './pages/Releases';
import ChangeRequests from './pages/ChangeRequests';

import Approvals from './pages/Approvals';
import Deployments from './pages/Deployments';
import PatchNotes from './pages/PatchNotes';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import GitHubIntegration from './pages/GitHubIntegration';

// A simple protective wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="releases" element={<Releases />} />
          <Route path="change-requests" element={<ChangeRequests />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="patch-notes" element={<PatchNotes />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="users" element={<Users />} />
          <Route path="github" element={<GitHubIntegration />} />
          <Route path="history" element={<Releases />} />
          <Route path="settings" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
