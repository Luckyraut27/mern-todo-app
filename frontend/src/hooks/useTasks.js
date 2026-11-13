import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/taskApi';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      setTasks(await api.fetchTasks(params));
    } catch (e) {
      setError(api.getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Debounce so we don't call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  // Wraps a mutation: surfaces errors, returns true on success.
  const run = async (fn) => {
    setError('');
    try {
      await fn();
      return true;
    } catch (e) {
      setError(api.getErrorMessage(e));
      return false;
    }
  };

  const addTask = (data) =>
    run(async () => {
      const task = await api.createTask(data);
      setTasks((prev) => [task, ...prev]);
    });

  const editTask = (id, data) =>
    run(async () => {
      const task = await api.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t._id === id ? task : t)));
    });

  const changeStatus = (id, status) =>
    run(async () => {
      const task = await api.updateTaskStatus(id, status);
      setTasks((prev) => prev.map((t) => (t._id === id ? task : t)));
    });

  const removeTask = (id) =>
    run(async () => {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

  return {
    tasks, loading, error, setError, reload: load,
    search, setSearch, statusFilter, setStatusFilter,
    addTask, editTask, changeStatus, removeTask,
  };
}
