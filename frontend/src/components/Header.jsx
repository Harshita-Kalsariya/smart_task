// src/components/Header.jsx - Top navigation bar

import { Search, Sun, Moon, Plus, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onAddTask, searchQuery, onSearchChange, onMenuToggle }) => {
  const { user, darkMode, toggleDarkMode } = useAuth();

  return (
    <header className="header">
      {/* Hamburger (mobile) */}
      <button className="hamburger btn-ghost btn btn-icon" onClick={onMenuToggle} aria-label="Toggle menu">
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* Add Task button */}
        <button className="btn btn-primary btn-sm" onClick={onAddTask} id="add-task-btn">
          <Plus size={16} />
          <span>Add Task</span>
        </button>

        {/* Dark mode toggle */}
        <button
          className={`theme-toggle ${darkMode ? 'dark' : ''}`}
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-toggle-thumb"></span>
        </button>

        {/* Avatar */}
        <div
          className="header-avatar"
          title={user?.name}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;
