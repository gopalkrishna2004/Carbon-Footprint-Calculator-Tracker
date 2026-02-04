import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EmissionsChart from '../components/EmissionsChart';
import CategoryPieChart from '../components/CategoryPieChart';
import ComparisonCard from '../components/ComparisonCard';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [previousStats, setPreviousStats] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/activities/stats', {
        params: { period },
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  const fetchPreviousStats = useCallback(async () => {
    try {
      // Calculate previous period dates
      const now = new Date();
      let startDate, endDate;

      switch (period) {
        case 'day':
          // Yesterday
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          endDate.setDate(now.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'week':
          // Last week (Sunday to Saturday of previous week)
          const dayOfWeek = now.getDay(); // 0 = Sunday
          // Get Sunday of this week
          const thisWeekSunday = new Date(now);
          thisWeekSunday.setDate(now.getDate() - dayOfWeek);
          thisWeekSunday.setHours(0, 0, 0, 0);
          // Last week starts 7 days before this Sunday
          startDate = new Date(thisWeekSunday);
          startDate.setDate(thisWeekSunday.getDate() - 7);
          // Last week ends 1 day before this Sunday (last Saturday)
          endDate = new Date(thisWeekSunday);
          endDate.setDate(thisWeekSunday.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'month':
          // Last month (full calendar month)
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
          break;
        case 'year':
          // Last year (full calendar year)
          startDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
          endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
          break;
        default:
          // Default to last week (Sunday to Saturday)
          const defaultDayOfWeek = now.getDay();
          const defaultThisWeekSunday = new Date(now);
          defaultThisWeekSunday.setDate(now.getDate() - defaultDayOfWeek);
          defaultThisWeekSunday.setHours(0, 0, 0, 0);
          startDate = new Date(defaultThisWeekSunday);
          startDate.setDate(defaultThisWeekSunday.getDate() - 7);
          endDate = new Date(defaultThisWeekSunday);
          endDate.setDate(defaultThisWeekSunday.getDate() - 1);
          endDate.setHours(23, 59, 59, 999);
      }

      const response = await axios.get('/api/activities', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });

      // Calculate stats from activities
      const activities = response.data.data;
      const totalEmissions = activities.reduce((sum, act) => sum + act.carbonEmission, 0);
      
      setPreviousStats({
        totalEmissions,
        activityCount: activities.length,
      });
    } catch (error) {
      console.error('Error fetching previous stats:', error);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
    fetchPreviousStats();
  }, [fetchStats, fetchPreviousStats]);

  const getCategoryColor = (category) => {
    const colors = {
      transportation: '#3b82f6',
      energy: '#f59e0b',
      diet: '#10b981',
      consumption: '#8b5cf6',
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="page-container">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Track your carbon footprint and make a difference</p>
          </div>
          <Link to="/activities">
            <button className="btn btn-primary">+ Add Activity</button>
          </Link>
        </div>

        <div className="period-selector">
          <button
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            Today
          </button>
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            This Week
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            This Month
          </button>
          <button
            className={`period-btn ${period === 'year' ? 'active' : ''}`}
            onClick={() => setPeriod('year')}
          >
            This Year
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : stats ? (
          <>
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">🌍</div>
                <div className="stat-info">
                  <h3>Total Emissions</h3>
                  <div className="stat-value">{stats.totalEmissions} <span>kg CO₂</span></div>
                  <p className="stat-period">
                    {period === 'day' ? 'Today' : period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'This year'}
                  </p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Activities Logged</h3>
                  <div className="stat-value">{stats.activityCount} <span>activities</span></div>
                  <p className="stat-period">Keep tracking!</p>
                </div>
              </div>

              <div className="stat-card card">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h3>Daily Average</h3>
                  <div className="stat-value">
                    {stats.activityCount > 0 
                      ? (stats.totalEmissions / Math.max(Object.keys(stats.byDate || {}).length, 1)).toFixed(2)
                      : 0
                    } <span>kg CO₂/day</span>
                  </div>
                  <p className="stat-period">Average emissions</p>
                </div>
              </div>
            </div>

            {stats.activityCount > 0 ? (
              <>
                {/* Comparison Card */}
                {previousStats && (
                  <ComparisonCard
                    currentStats={stats}
                    previousStats={previousStats}
                    period={period}
                  />
                )}

                {/* Charts Grid */}
                <div className="charts-grid">
                  {/* Emissions Trend Chart */}
                  {Object.keys(stats.byDate).length > 0 && (
                    <div className="chart-full-width">
                      <EmissionsChart data={stats.byDate} period={period} />
                    </div>
                  )}

                  {/* Pie Chart */}
                  {Object.keys(stats.byCategory).length > 0 && (
                    <CategoryPieChart data={stats.byCategory} />
                  )}

                  {/* Category Bars (Keep for additional detail) */}
                  <div className="chart-section card">
                    <h2>📋 Detailed Breakdown</h2>
                    <div className="category-breakdown">
                      {Object.entries(stats.byCategory).map(([category, data]) => (
                        <div key={category} className="category-item">
                          <div className="category-header">
                            <span className="category-name">
                              {category === 'transportation' && '🚗'}
                              {category === 'energy' && '⚡'}
                              {category === 'diet' && '🍽️'}
                              {category === 'consumption' && '🛍️'}
                              {' '}{category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                            <span className="category-value">{data.emissions.toFixed(2)} kg CO₂</span>
                          </div>
                          <div className="category-bar">
                            <div
                              className="category-fill"
                              style={{
                                width: `${(data.emissions / stats.totalEmissions) * 100}%`,
                                backgroundColor: getCategoryColor(category),
                              }}
                            ></div>
                          </div>
                          <div className="category-percentage">
                            {((data.emissions / stats.totalEmissions) * 100).toFixed(1)}% of total • {data.count} activities
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-dashboard card">
                <div className="empty-icon">📝</div>
                <h3>No Activities Yet</h3>
                <p>Start tracking your carbon footprint by adding your first activity!</p>
                <Link to="/activities">
                  <button className="btn btn-primary">Add Your First Activity</button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="empty-dashboard card">
            <div className="empty-icon">📊</div>
            <h3>Unable to Load Statistics</h3>
            <p>Please try refreshing the page</p>
          </div>
        )}

        <div className="info-card card">
          <h2>About Carbon Footprint</h2>
          <div className="info-grid">
            <div className="info-item">
              <h4>🚗 Transportation</h4>
              <p>Track emissions from cars, buses, trains, and flights</p>
            </div>
            <div className="info-item">
              <h4>⚡ Energy</h4>
              <p>Monitor electricity, heating, and cooling consumption</p>
            </div>
            <div className="info-item">
              <h4>🍽️ Diet</h4>
              <p>Calculate impact from food choices and waste</p>
            </div>
            <div className="info-item">
              <h4>🛍️ Consumption</h4>
              <p>Assess shopping habits and waste generation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
