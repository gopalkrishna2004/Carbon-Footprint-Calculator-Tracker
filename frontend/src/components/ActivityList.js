import React from 'react';
import './ActivityList.css';

const ActivityList = ({ activities, onEdit, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      transportation: '🚗',
      energy: '⚡',
      diet: '🍽️',
      consumption: '🛍️',
    };
    return icons[category] || '📊';
  };

  const getActivityDetails = (activity) => {
    switch (activity.category) {
      case 'transportation':
        return `${activity.transportMode?.replace('-', ' ')} - ${activity.distance} km`;
      case 'energy':
        return `${activity.energyType?.replace('-', ' ')} - ${activity.consumption} ${activity.unit}`;
      case 'diet':
        return `${activity.mealType} - ${activity.numberOfMeals} meal(s)`;
      case 'consumption':
        return `${activity.itemType} - ${activity.quantity} item(s)`;
      default:
        return 'Unknown';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="empty-state card">
        <div className="empty-icon">📝</div>
        <h3>No Activities Yet</h3>
        <p>Start tracking your carbon footprint by adding your first activity!</p>
      </div>
    );
  }

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div key={activity._id} className="activity-item card">
          <div className="activity-main">
            <div className="activity-icon">
              {getCategoryIcon(activity.category)}
            </div>
            <div className="activity-info">
              <div className="activity-header">
                <h4>{activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}</h4>
                <span className="activity-date">{formatDate(activity.date)}</span>
              </div>
              <p className="activity-details">{getActivityDetails(activity)}</p>
              {activity.notes && (
                <p className="activity-notes">📝 {activity.notes}</p>
              )}
            </div>
          </div>

          <div className="activity-emission">
            <div className="emission-value">{activity.carbonEmission.toFixed(2)}</div>
            <div className="emission-unit">kg CO₂</div>
          </div>

          <div className="activity-actions">
            <button
              className="btn-icon"
              onClick={() => onEdit(activity)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(activity._id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
