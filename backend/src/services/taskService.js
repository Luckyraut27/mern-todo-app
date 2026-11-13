const Task = require('../models/Task');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getTasks = async ({ search, status, priority, page = 1, limit = 50 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const p = Math.max(parseInt(page, 10) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l),
    Task.countDocuments(filter),
  ]);

  return { tasks, total, page: p, pages: Math.ceil(total / l) };
};

exports.getTaskById = (id) => Task.findById(id);

exports.createTask = (data) => Task.create(data);

exports.updateTask = (id, data) =>
  Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });

exports.updateStatus = (id, status) =>
  Task.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

exports.deleteTask = (id) => Task.findByIdAndDelete(id);
