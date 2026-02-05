import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Chatbot from '../components/Chatbot';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [showChatbot, setShowChatbot] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ai/recommendations', {
        params: { period },
      });
      setRecommendations(response.data.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  const fetchInsights = useCallback(async () => {
    try {
      const response = await axios.get('/api/ai/insights', {
        params: { period },
      });
      setInsights(response.data.data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  }, [period]);

  useEffect(() => {
    fetchRecommendations();
    fetchInsights();
  }, [fetchRecommendations, fetchInsights]);

  const getCategoryIcon = (category) => {
    return '';
  };

  const getImpactColor = (impact) => {
    const colors = {
      high: '#10b981',
      medium: '#f59e0b',
      low: '#6b7280',
    };
    return colors[impact] || '#6b7280';
  };

  const getInsightType = (type) => {
    const types = {
      success: { icon: '', color: '#10b981' },
      warning: { icon: '⚠️', color: '#f59e0b' },
      info: { icon: 'ℹ️', color: '#3b82f6' },
    };
    return types[type] || types.info;
  };

  return (
    <div className="page-container">
      <div className="ai-container">
        <div className="ai-header">
          <div>
            <h1>🤖 AI-Powered Recommendations</h1>
            <p>Personalized tips to reduce your carbon footprint</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowChatbot(!showChatbot)}
          >
            {showChatbot ? 'View Recommendations' : 'Chat with AI'}
          </button>
        </div>

        {showChatbot ? (
          <Chatbot period={period} onClose={() => setShowChatbot(false)} />
        ) : (
          <>
            <div className="period-selector">
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

            {/* Insights Section */}
            {insights.length > 0 && (
              <div className="insights-section">
                <h2>Your Insights</h2>
                <div className="insights-grid">
                  {insights.map((insight, index) => {
                    const typeInfo = getInsightType(insight.type);
                    return (
                      <div
                        key={index}
                        className="insight-card card"
                        style={{ borderLeft: `4px solid ${typeInfo.color}` }}
                      >
                        <div className="insight-icon" style={{ color: typeInfo.color }}>
                          {typeInfo.icon}
                        </div>
                        <div className="insight-content">
                          <h3>{insight.title}</h3>
                          <p>{insight.description}</p>
                          {insight.value && (
                            <div className="insight-value">{insight.value} kg CO₂</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            <div className="recommendations-section">
              <h2>Personalized Recommendations</h2>

              {loading ? (
                <div className="spinner"></div>
              ) : recommendations.length > 0 ? (
                <div className="recommendations-grid">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-card card">
                      <div className="rec-header">
                        <span className="rec-icon">{getCategoryIcon(rec.category)}</span>
                        <span
                          className="rec-impact"
                          style={{
                            backgroundColor: getImpactColor(rec.impact),
                          }}
                        >
                          {rec.impact} impact
                        </span>
                      </div>
                      <h3>{rec.title}</h3>
                      <p>{rec.description}</p>
                      <div className="rec-footer">
                        <div className="rec-savings">
                          <span className="savings-label">Potential Savings:</span>
                          <span className="savings-value">{rec.savings}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state card">
                  <h3>Start Tracking Activities</h3>
                  <p>Log some activities to get personalized AI recommendations!</p>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <div className="refresh-section">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  fetchRecommendations();
                  fetchInsights();
                }}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Refresh Recommendations'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations;
