import { useState } from 'react';
import TaskForm from './TaskForm';

const STATUS_LABEL = { pending: 'Pending', 'in-progress': 'In progress', completed: 'Completed' };

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function TaskItem({ task, onStatus, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const done = task.status === 'completed';
  const overdue = task.dueDate && !done && new Date(task.dueDate) < new Date(new Date().toDateString());

  if (editing) {
    return (
      <li className="task editing">
        <TaskForm
          initial={task}
          onCancel={() => setEditing(false)}
          onSubmit={async (data) => {
            const ok = await onEdit(task._id, data);
            if (ok) setEditing(false);
            return ok;
          }}
        />
      </li>
    );
  }

  return (
    <li className={`task priority-${task.priority} ${done ? 'done' : ''}`}>
      <input
        type="checkbox"
        className="check"
        checked={done}
        onChange={() => onStatus(task._id, done ? 'pending' : 'completed')}
        aria-label={done ? 'Mark as pending' : 'Mark as completed'}
      />
      <div className="task-body">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          <span className={`badge ${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={overdue ? 'due overdue' : 'due'}>
              {overdue ? 'Overdue: ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatus(task._id, e.target.value)}
          aria-label="Change status"
        >
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button className="btn ghost" onClick={() => setEditing(true)}>Edit</button>
        <button
          className="btn danger"
          onClick={() => window.confirm(`Delete "${task.title}"?`) && onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
