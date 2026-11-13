const mongoose = require('mongoose');

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

const fail = (res, errors) =>
  res.status(400).json({ success: false, message: 'Validation failed', errors });

exports.validateId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid task id' });
  }
  next();
};

const checkBody = (body, { requireTitle }) => {
  const errors = [];
  const { title, description, status, priority, dueDate } = body;

  if (requireTitle && (typeof title !== 'string' || !title.trim())) {
    errors.push('Title is required');
  } else if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) errors.push('Title cannot be empty');
    else if (title.trim().length > 120) errors.push('Title cannot exceed 120 characters');
  }
  if (description !== undefined && (typeof description !== 'string' || description.length > 500)) {
    errors.push('Description must be text up to 500 characters');
  }
  if (status !== undefined && !STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${STATUSES.join(', ')}`);
  }
  if (priority !== undefined && !PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(', ')}`);
  }
  if (dueDate !== undefined && dueDate !== null && dueDate !== '' && isNaN(Date.parse(dueDate))) {
    errors.push('Due date must be a valid date');
  }
  return errors;
};

exports.validateCreate = (req, res, next) => {
  const errors = checkBody(req.body || {}, { requireTitle: true });
  if (errors.length) return fail(res, errors);
  next();
};

exports.validateUpdate = (req, res, next) => {
  const body = req.body || {};
  if (!Object.keys(body).length) return fail(res, ['Provide at least one field to update']);
  const errors = checkBody(body, { requireTitle: false });
  if (errors.length) return fail(res, errors);
  next();
};

exports.validateStatus = (req, res, next) => {
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return fail(res, [`Status must be one of: ${STATUSES.join(', ')}`]);
  }
  next();
};
