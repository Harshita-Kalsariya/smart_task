// src/components/TaskForm.jsx - Modal form to create or edit a task

import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ isOpen, onClose, onSubmit, editingTask, loading }) => {
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState('');

  // Populate form when editing an existing task
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setForm(INITIAL_STATE);
    }
    setError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    try {
      await onSubmit(form);
      setForm(INITIAL_STATE);
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTask ? '✏️ Edit Task' : '➕ New Task'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              name="description"
              className="form-textarea"
              placeholder="Add more details (optional)..."
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <select id="task-priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              name="dueDate"
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="task-submit-btn"
            >
              {loading ? <><Loader size={16} className="spinner" style={{ border: 'none', borderTop: '2px solid white', width: 16, height: 16 }} /> Saving...</> : editingTask ? 'Update Task' : 'Create Task'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
