
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  timeout: 15000,
});

// Turn any axios error into a readable message.
export const getErrorMessage = (err) => {
  if (err.response) {
    const { message, errors } = err.response.data || {};
    return errors?.length
      ? errors.join('. ')
      : message || `Request failed (${err.response.status})`;
  }

  if (err.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Try again.';
  }

  return 'Cannot reach the server. Check your connection or the API URL.';
};

export const fetchTasks = (params) =>
  api.get('/tasks', { params }).then((r) => r.data.tasks);

export const createTask = (data) =>
  api.post('/tasks', data).then((r) => r.data.task);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then((r) => r.data.task);

export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status }).then((r) => r.data.task);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`).then((r) => r.data.task);
