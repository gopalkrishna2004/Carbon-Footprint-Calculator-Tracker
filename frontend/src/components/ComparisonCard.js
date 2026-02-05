import React from 'react';
import './ComparisonCard.css';

const ComparisonCard = ({ currentStats, previousStats, period }) => {
  if (!currentStats || !previousStats) {
    return null;
  }

  const currentTotal = currentStats.totalEmissions || 0;
  const previousTotal = previousStats.totalEmissions || 0;
  
  const difference = currentTotal - previousTotal;
  const percentChange = previousTotal !== 0 
    ? ((difference / previousTotal) * 100).toFixed(1)
    : 0;

  const isIncrease = difference > 0;

  const getPeriodText = () => {
    switch (period) {
      case 'day':
        return 'yesterday';
      case 'week':
        return 'last week';
      case 'month':
        return 'last month';
      case 'year':
        return 'last year';
      default:
        return 'previous period';
    }
  };

  return (
    <div className="comparison-card card">
      <h2>Period Comparison</h2>
      
      <div className="comparison-content">
        <div className="comparison-row">
          <div className="comparison-item">
            <div className="comparison-label">Current Period</div>
            <div className="comparison-value current">{currentTotal.toFixed(2)} kg CO₂</div>
            <div className="comparison-count">{currentStats.activityCount} activities</div>
          </div>

          <div className="comparison-divider">
            <div className="vs-badge">VS</div>
          </div>

          <div className="comparison-item">
            <div className="comparison-label">
              {getPeriodText().charAt(0).toUpperCase() + getPeriodText().slice(1)}
            </div>
            <div className="comparison-value previous">{previousTotal.toFixed(2)} kg CO₂</div>
            <div className="comparison-count">{previousStats.activityCount} activities</div>
          </div>
        </div>

        <div className="comparison-result">
          {difference === 0 ? (
            <div className="no-change">
              <span className="change-icon">➖</span>
              <span className="change-text">No change from {getPeriodText()}</span>
            </div>
          ) : isIncrease ? (
            <div className="increase">
              <span className="change-text">
                <strong>+{Math.abs(difference).toFixed(2)} kg CO₂</strong> ({percentChange}%) increase from {getPeriodText()}
              </span>
              <div className="suggestion">
                Consider reviewing your activities to reduce emissions
              </div>
            </div>
          ) : (
            <div className="decrease">
              <span className="change-text">
                <strong>-{Math.abs(difference).toFixed(2)} kg CO₂</strong> ({Math.abs(percentChange)}%) decrease from {getPeriodText()}
              </span>
              <div className="suggestion">
                Great job! You're reducing your carbon footprint!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;
