const Activity = require('../models/Activity');
const { generateRecommendations, chatWithAI } = require('../services/aiService');

// @desc    Get AI-powered recommendations
// @route   GET /api/ai/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    // Get user's activities
    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: now },
    });

    // Calculate statistics
    const totalEmissions = activities.reduce((sum, activity) => sum + activity.carbonEmission, 0);

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

    // Prepare data for AI
    const userData = {
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      period,
      activityCount: activities.length,
      byCategory,
    };

    // Generate recommendations using AI
    const recommendations = await generateRecommendations(userData);

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        userData,
      },
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recommendations',
      error: error.message,
    });
  }
};

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message, period = 'month' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get user's current stats
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'week':
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: now },
    });

    const totalEmissions = activities.reduce((sum, activity) => sum + activity.carbonEmission, 0);

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

    const userData = {
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      period,
      byCategory,
    };

    // Get AI response
    const aiResponse = await chatWithAI(message, userData);

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
      error: error.message,
    });
  }
};

// @desc    Get insights about user's carbon footprint
// @route   GET /api/ai/insights
// @access  Private
exports.getInsights = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Get user's activities
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    const activities = await Activity.find({
      user: req.user._id,
      date: { $gte: startDate, $lte: now },
    });

    const totalEmissions = activities.reduce((sum, activity) => sum + activity.carbonEmission, 0);

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

    // Generate insights
    const insights = [];

    // Find highest emission category
    const highestCategory = Object.entries(byCategory)
      .sort(([, a], [, b]) => b.emissions - a.emissions)[0];

    if (highestCategory) {
      insights.push({
        type: 'warning',
        title: `${highestCategory[0].charAt(0).toUpperCase() + highestCategory[0].slice(1)} is your highest emission source`,
        description: `${((highestCategory[1].emissions / totalEmissions) * 100).toFixed(1)}% of your total emissions`,
        value: highestCategory[1].emissions.toFixed(2),
      });
    }

    // Average comparison (global average is ~4000 kg/year)
    const monthlyAvg = totalEmissions;
    const yearlyProjection = monthlyAvg * 12;
    const globalAvg = 4000;

    if (yearlyProjection < globalAvg) {
      insights.push({
        type: 'success',
        title: 'Below global average!',
        description: `Your projected yearly emissions (${yearlyProjection.toFixed(0)} kg) are below the global average of ${globalAvg} kg`,
        value: yearlyProjection.toFixed(2),
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Above global average',
        description: `Your projected yearly emissions (${yearlyProjection.toFixed(0)} kg) exceed the global average of ${globalAvg} kg`,
        value: yearlyProjection.toFixed(2),
      });
    }

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating insights',
      error: error.message,
    });
  }
};
