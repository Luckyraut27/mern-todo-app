import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function App() {
  const {
    tasks, loading, error, setError, reload,
    search, setSearch, statusFilter, setStatusFilter,
    addTask, editTask, changeStatus, removeTask,
  } = useTasks();

  const filtering = search.trim() || statusFilter;

  return (
    <main className="app">
      <header>
        <h1>Taskbook</h1>
        <p>Write it down, tick it off.</p>
      </header>

      <section className="panel">
        <TaskForm onSubmit={addTask} />
      </section>

      <section className="toolbar">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks"
          aria-label="Search tasks"
        />
        <div className="chips" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`chip ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="error" role="alert">
          <span>{error}</span>
          <div>
            <button className="btn ghost" onClick={reload}>Retry</button>
            <button className="btn ghost" onClick={() => setError('')}>Dismiss</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="state"><span className="spinner" /> Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <div className="state">
          {filtering ? 'No tasks match. Clear the search or filter.' : 'No tasks yet. Add your first one above.'}
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <TaskItem
              key={t._id}
              task={t}
              onStatus={changeStatus}
              onEdit={editTask}
              onDelete={removeTask}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
