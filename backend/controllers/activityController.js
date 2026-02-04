const Activity = require('../models/Activity');
const { calculateCarbonEmission } = require('../utils/carbonCalculator');
const { validationResult } = require('express-validator');

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const activityData = {
      ...req.body,
      user: req.user._id,
    };

    // Calculate carbon emission
    activityData.carbonEmission = calculateCarbonEmission(activityData);

    // Round to 2 decimal places
    activityData.carbonEmission = Math.round(activityData.carbonEmission * 100) / 100;

    const activity = await Activity.create(activityData);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating activity',
      error: error.message,
    });
  }
};

// @desc    Get all activities for logged-in user
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  try {
    const { category, startDate, endDate, limit } = req.query;

    // Build query
    const query = { user: req.user._id };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Execute query
    let activitiesQuery = Activity.find(query).sort({ date: -1 });

    if (limit) {
      activitiesQuery = activitiesQuery.limit(parseInt(limit));
    }

    const activities = await activitiesQuery;

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities',
      error: error.message,
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
exports.getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check ownership
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this activity',
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity',
      error: error.message,
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check ownership
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this activity',
      });
    }

    // Update activity data
    const updatedData = { ...req.body };

    // Recalculate carbon emission
    updatedData.carbonEmission = calculateCarbonEmission({
      ...activity.toObject(),
      ...updatedData,
    });

    // Round to 2 decimal places
    updatedData.carbonEmission = Math.round(updatedData.carbonEmission * 100) / 100;

    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating activity',
      error: error.message,
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check ownership
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity',
      });
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting activity',
      error: error.message,
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        // Start of today
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        // Start of this week (Sunday)
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        // First day of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      case 'year':
        // January 1st of current year
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      default:
        // Default to start of week (Sunday)
        const defaultDayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - defaultDayOfWeek);
        startDate.setHours(0, 0, 0, 0);
    }

    // Get activities in date range
    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: now },
    });

    // Calculate totals
    const totalEmissions = activities.reduce((sum, activity) => sum + activity.carbonEmission, 0);

    // Group by category
    const byCategory = activities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = {
          count: 0,
          emissions: 0,
        };
      }
      acc[activity.category].count++;
      acc[activity.category].emissions += activity.carbonEmission;
      return acc;
    }, {});

    // Group by date for trend
    const byDate = activities.reduce((acc, activity) => {
      const dateKey = activity.date.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      acc[dateKey] += activity.carbonEmission;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        period,
        totalEmissions: Math.round(totalEmissions * 100) / 100,
        activityCount: activities.length,
        byCategory,
        byDate,
        startDate,
        endDate: now,
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message,
    });
  }
};
