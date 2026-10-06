// src/components/Sidebar.jsx - Navigation sidebar

import { CheckSquare, Clock, PlusCircle, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose, activeFilter, onFilterChange, taskCounts, onAddTask, searchQuery, onSearchChange }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: LayoutDashboard, count: taskCounts.all },
    { id: 'pending', label: 'Pending Tasks', icon: Clock, count: taskCounts.pending },
    { id: 'completed', label: 'Completed Tasks', icon: CheckSquare, count: taskCounts.completed },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'var(--bg-overlay)',
            zIndex: 99, display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <CheckSquare size={20} />
          </div>
          <div>
            <div className="sidebar-logo-text">SmartTask</div>
            <div className="sidebar-logo-sub">Management System</div>
          </div>
        </div>

        {/* Search (mobile) */}
        <div style={{ padding: '12px 12px 0' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 32, fontSize: '0.8125rem', padding: '8px 10px 8px 32px' }}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${activeFilter === item.id ? 'active' : ''}`}
              onClick={() => { onFilterChange(item.id); onClose(); }}
            >
              <item.icon size={16} />
              {item.label}
              <span className="sidebar-item-count">{item.count}</span>
            </button>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 8 }}>Actions</div>
          <button className="sidebar-item" onClick={() => { onAddTask(); onClose(); }}>
            <PlusCircle size={16} />
            Add New Task
          </button>
        </nav>

        {/* User / Footer */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px', marginBottom: 8 }}>
            <div className="header-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button className="sidebar-item btn-danger" onClick={logout} style={{ color: 'var(--danger)', width: '100%' }}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
