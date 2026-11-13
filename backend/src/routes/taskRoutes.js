const express = require('express');
const c = require('../controllers/taskController');
const { validateId, validateCreate, validateUpdate, validateStatus } = require('../middleware/validate');

const router = express.Router();

router.route('/').get(c.getTasks).post(validateCreate, c.createTask);

router
  .route('/:id')
  .get(validateId, c.getTask)
  .put(validateId, validateUpdate, c.updateTask)
  .delete(validateId, c.deleteTask);

router.patch('/:id/status', validateId, validateStatus, c.updateStatus);

module.exports = router;
