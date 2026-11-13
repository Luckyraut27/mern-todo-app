import { useState } from 'react';

const empty = { title: '', description: '', priority: 'medium', dueDate: '' };

const toForm = (t) =>
  t
    ? {
        title: t.title,
        description: t.description || '',
        priority: t.priority,
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
      }
    : empty;

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(toForm(initial));
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setLocalError('Give the task a title.');
      return;
    }
    setLocalError('');
    setSaving(true);
    const ok = await onSubmit({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
    setSaving(false);
    if (ok && !initial) setForm(empty);
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input
        name="title"
        value={form.title}
        onChange={change}
        placeholder="What needs doing?"
        maxLength={120}
        aria-label="Task title"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={change}
        placeholder="Details (optional)"
        maxLength={500}
        rows={2}
        aria-label="Task description"
      />
      <div className="form-row">
        <select name="priority" value={form.priority} onChange={change} aria-label="Priority">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input type="date" name="dueDate" value={form.dueDate} onChange={change} aria-label="Due date" />
      </div>
      {localError && <p className="field-error">{localError}</p>}
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add task'}
        </button>
        {onCancel && (
          <button className="btn ghost" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
