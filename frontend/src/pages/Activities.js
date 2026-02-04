import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import './Activities.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await axios.get('/api/activities', { params });
      setActivities(response.data.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleActivityCreated = () => {
    fetchActivities();
    setShowForm(false);
    setEditingActivity(null);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`/api/activities/${id}`);
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  return (
    <div className="page-container">
      <div className="activities-container">
        <div className="activities-header">
          <h1>My Activities</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        </div>

        {showForm && (
          <ActivityForm
            activity={editingActivity}
            onSuccess={handleActivityCreated}
            onCancel={handleCancelForm}
          />
        )}

        <div className="filter-bar">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Activities
          </button>
          <button
            className={`filter-btn ${filter === 'transportation' ? 'active' : ''}`}
            onClick={() => setFilter('transportation')}
          >
            🚗 Transportation
          </button>
          <button
            className={`filter-btn ${filter === 'energy' ? 'active' : ''}`}
            onClick={() => setFilter('energy')}
          >
            ⚡ Energy
          </button>
          <button
            className={`filter-btn ${filter === 'diet' ? 'active' : ''}`}
            onClick={() => setFilter('diet')}
          >
            🍽️ Diet
          </button>
          <button
            className={`filter-btn ${filter === 'consumption' ? 'active' : ''}`}
            onClick={() => setFilter('consumption')}
          >
            🛍️ Consumption
          </button>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <ActivityList
            activities={activities}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Activities;
