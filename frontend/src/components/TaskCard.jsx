// src/components/TaskCard.jsx - Individual task card with actions

import { Check, Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';

  // Format due date
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  // Check if overdue
  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card priority-${task.priority} ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-header">
        {/* Checkbox to toggle status */}
        <div
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task)}
          title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          role="checkbox"
          aria-checked={isCompleted}
        >
          {isCompleted && <Check size={12} strokeWidth={3} />}
        </div>

        {/* Task Title */}
        <h3 className={`task-title ${isCompleted ? 'completed' : ''}`}>
          {task.title}
        </h3>

        {/* Action buttons (visible on hover) */}
        <div className="task-actions">
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn btn-danger btn-icon btn-sm"
            onClick={() => onDelete(task._id)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      {/* Meta: badges + due date */}
      <div className="task-meta">
        <span className={`badge badge-${task.status}`}>
          {task.status}
        </span>
        <span className={`badge badge-${task.priority}`}>
          {task.priority}
        </span>

        {task.dueDate && (
          <span className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
            {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
            {formatDate(task.dueDate)}
            {isOverdue && ' · Overdue'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
