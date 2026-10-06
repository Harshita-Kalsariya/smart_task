// src/pages/DashboardPage.jsx - Main task management page

import { useState, useEffect, useMemo, useCallback } from 'react';
import { LayoutDashboard, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  // ─── State ────────────────────────────────────────────
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ─── Fetch Tasks ─────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setFetchError('');
      const { data } = await taskAPI.getAll();
      setTasks(data);
    } catch (err) {
      setFetchError('Failed to load tasks. Please refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─── Task Counts ─────────────────────────────────────
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
  }), [tasks]);

  // ─── Filtered + Searched Tasks ───────────────────────
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Status filter
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tasks, activeFilter, searchQuery]);

  // ─── Handlers ────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (formData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        const { data } = await taskAPI.update(editingTask._id, formData);
        setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      } else {
        const { data } = await taskAPI.create(formData);
        setTasks((prev) => [data, ...prev]);
      }
      handleCloseForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      const { data } = await taskAPI.update(task._id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  // ─── Filter Tab Label ────────────────────────────────
  const filterLabel = {
    all: 'All Tasks',
    pending: 'Pending Tasks',
    completed: 'Completed Tasks',
  }[activeFilter];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        taskCounts={taskCounts}
        onAddTask={handleOpenAdd}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main */}
      <div className="main-content">
        <Header
          onAddTask={handleOpenAdd}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />

        <main className="page-content">
          {/* Welcome */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
              Here's what's on your plate today.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card" onClick={() => setActiveFilter('all')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon purple"><LayoutDashboard size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{taskCounts.all}</div>
                <div className="stat-label">Total Tasks</div>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveFilter('pending')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon amber"><Clock size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{taskCounts.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card" onClick={() => setActiveFilter('completed')} style={{ cursor: 'pointer' }}>
              <div className="stat-icon green"><CheckSquare size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{taskCounts.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><AlertTriangle size={22} /></div>
              <div className="stat-info">
                <div className="stat-value">{taskCounts.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          </div>

          {/* Error */}
          {fetchError && (
            <div className="alert alert-error">{fetchError}</div>
          )}

          {/* Tasks section */}
          <div className="tasks-header">
            <h2 className="tasks-title">
              {filterLabel}
              {searchQuery && ` · "${searchQuery}"`}
              <span style={{ marginLeft: 8, fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                ({filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'})
              </span>
            </h2>

            {/* Filter tabs */}
            <div className="filter-tabs">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner" style={{ width: 36, height: 36, borderWidth: 4 }}></div>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <CheckSquare size={36} />
                  </div>
                  <div className="empty-state-title">
                    {searchQuery ? 'No tasks match your search' : 'No tasks yet'}
                  </div>
                  <div className="empty-state-desc">
                    {searchQuery
                      ? `Try a different search term`
                      : activeFilter === 'completed'
                      ? 'Complete some tasks to see them here'
                      : 'Click "Add Task" to create your first task'}
                  </div>
                  {!searchQuery && activeFilter !== 'completed' && (
                    <button className="btn btn-primary" onClick={handleOpenAdd}>
                      + Add Your First Task
                    </button>
                  )}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
        loading={formLoading}
      />
    </div>
  );
};

export default DashboardPage;
