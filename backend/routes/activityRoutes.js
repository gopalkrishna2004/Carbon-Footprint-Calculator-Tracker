const express = require('express');
const { body } = require('express-validator');
const {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  getStatistics,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const activityValidation = [
  body('category').isIn(['transportation', 'energy', 'diet', 'consumption']).withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

// All routes are protected
router.use(protect);

// Statistics route (must be before /:id route)
router.get('/stats', getStatistics);

// CRUD routes
router.route('/')
  .get(getActivities)
  .post(activityValidation, createActivity);

router.route('/:id')
  .get(getActivity)
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;
