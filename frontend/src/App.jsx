import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import DriveList from './pages/student/DriveList.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';

import TnpDashboard from './pages/tnp/TnpDashboard.jsx';
import ManageDrives from './pages/tnp/ManageDrives.jsx';
import DriveApplications from './pages/tnp/DriveApplications.jsx';
import ManageStudents from './pages/tnp/ManageStudents.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import PolicyConfig from './pages/admin/PolicyConfig.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

const ROLE_HOME = {
  student: '/student/drives',
  tnp: '/tnp/dashboard',
  admin: '/admin/dashboard',
};

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role]} replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={user ? <HomeRedirect /> : <Login />} />
          <Route path="/register" element={user ? <HomeRedirect /> : <Register />} />

          <Route path="/student/drives" element={
            <ProtectedRoute roles={['student']}><DriveList /></ProtectedRoute>
          } />
          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
          } />

          <Route path="/tnp/dashboard" element={
            <ProtectedRoute roles={['tnp', 'admin']}><TnpDashboard /></ProtectedRoute>
          } />
          <Route path="/tnp/drives" element={
            <ProtectedRoute roles={['tnp', 'admin']}><ManageDrives /></ProtectedRoute>
          } />
          <Route path="/tnp/drives/:driveId/applications" element={
            <ProtectedRoute roles={['tnp', 'admin']}><DriveApplications /></ProtectedRoute>
          } />
          <Route path="/tnp/students" element={
            <ProtectedRoute roles={['tnp', 'admin']}><ManageStudents /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/policy" element={
            <ProtectedRoute roles={['admin']}><PolicyConfig /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>
          } />

          <Route path="*" element={<div className="empty-state">Page not found.</div>} />
        </Routes>
      </div>
    </>
  );
}
