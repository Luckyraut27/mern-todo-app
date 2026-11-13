const taskService = require('../services/taskService');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFoundTask = (res) => res.status(404).json({ success: false, message: 'Task not found' });

exports.getTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getTasks(req.query);
  res.json({ success: true, ...result });
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id);
  if (!task) return notFoundTask(res);
  res.json({ success: true, task });
});

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await taskService.createTask({
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
  });
  res.status(201).json({ success: true, message: 'Task created', task });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
  const data = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) data[k] = k === 'dueDate' && req.body[k] === '' ? null : req.body[k];
  });
  const task = await taskService.updateTask(req.params.id, data);
  if (!task) return notFoundTask(res);
  res.json({ success: true, message: 'Task updated', task });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateStatus(req.params.id, req.body.status);
  if (!task) return notFoundTask(res);
  res.json({ success: true, message: 'Status updated', task });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await taskService.deleteTask(req.params.id);
  if (!task) return notFoundTask(res);
  res.json({ success: true, message: 'Task deleted', task });
});
