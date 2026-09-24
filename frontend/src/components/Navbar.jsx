import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ROLE_HOME = {
  student: '/student/drives',
  tnp: '/tnp/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="navbar">
      <Link to={ROLE_HOME[user.role]} className="brand">PlaceFlow</Link>
      <div className="nav-links">
        {user.role === 'student' && (
          <>
            <Link to="/student/drives">Drives</Link>
            <Link to="/student/dashboard">My Dashboard</Link>
          </>
        )}
        {user.role === 'tnp' && (
          <>
            <Link to="/tnp/dashboard">Dashboard</Link>
            <Link to="/tnp/drives">Manage Drives</Link>
            <Link to="/tnp/students">Students</Link>
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/policy">Policy</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}
        <span className={`badge role-${user.role}`}>{user.role.toUpperCase()}</span>
        <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.name}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
