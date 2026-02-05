import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityForm.css';

const ActivityForm = ({ activity, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category: 'transportation',
    date: new Date().toISOString().split('T')[0],
    // Transportation
    transportMode: 'car-petrol',
    distance: '',
    // Energy
    energyType: 'electricity',
    consumption: '',
    unit: 'kwh',
    // Diet
    mealType: 'beef',
    numberOfMeals: '',
    // Consumption
    itemType: 'clothing',
    quantity: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setFormData({
        category: activity.category,
        date: new Date(activity.date).toISOString().split('T')[0],
        transportMode: activity.transportMode || 'car-petrol',
        distance: activity.distance || '',
        energyType: activity.energyType || 'electricity',
        consumption: activity.consumption || '',
        unit: activity.unit || 'kwh',
        mealType: activity.mealType || 'beef',
        numberOfMeals: activity.numberOfMeals || '',
        itemType: activity.itemType || 'clothing',
        quantity: activity.quantity || '',
        notes: activity.notes || '',
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        category: formData.category,
        date: formData.date,
        notes: formData.notes,
        activityType: '', // Will be set based on category
      };

      // Add category-specific fields
      if (formData.category === 'transportation') {
        submitData.transportMode = formData.transportMode;
        submitData.distance = parseFloat(formData.distance);
        submitData.activityType = formData.transportMode;
      } else if (formData.category === 'energy') {
        submitData.energyType = formData.energyType;
        submitData.consumption = parseFloat(formData.consumption);
        submitData.unit = formData.unit;
        submitData.activityType = formData.energyType;
      } else if (formData.category === 'diet') {
        submitData.mealType = formData.mealType;
        submitData.numberOfMeals = parseFloat(formData.numberOfMeals);
        submitData.activityType = formData.mealType;
      } else if (formData.category === 'consumption') {
        submitData.itemType = formData.itemType;
        submitData.quantity = parseFloat(formData.quantity);
        submitData.activityType = formData.itemType;
      }

      if (activity) {
        await axios.put(`/api/activities/${activity._id}`, submitData);
      } else {
        await axios.post('/api/activities', submitData);
      }

      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-form-container card">
      <h3>{activity ? 'Edit Activity' : 'Add New Activity'}</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="transportation">Transportation</option>
              <option value="energy">Energy</option>
              <option value="diet">Diet</option>
              <option value="consumption">Consumption</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Transportation Fields */}
        {formData.category === 'transportation' && (
          <>
            <div className="form-group">
              <label htmlFor="transportMode">Transport Mode *</label>
              <select
                id="transportMode"
                name="transportMode"
                value={formData.transportMode}
                onChange={handleChange}
                required
              >
                <option value="car-petrol">Car (Petrol)</option>
                <option value="car-diesel">Car (Diesel)</option>
                <option value="car-electric">Car (Electric)</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="flight-short">Flight (Short-haul)</option>
                <option value="flight-long">Flight (Long-haul)</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="distance">Distance (km) *</label>
              <input
                type="number"
                id="distance"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="e.g., 25.5"
                required
              />
            </div>
          </>
        )}

        {/* Energy Fields */}
        {formData.category === 'energy' && (
          <>
            <div className="form-group">
              <label htmlFor="energyType">Energy Type *</label>
              <select
                id="energyType"
                name="energyType"
                value={formData.energyType}
                onChange={handleChange}
                required
              >
                <option value="electricity">Electricity</option>
                <option value="natural-gas">Natural Gas</option>
                <option value="heating-oil">Heating Oil</option>
                <option value="coal">Coal</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="consumption">Consumption *</label>
                <input
                  type="number"
                  id="consumption"
                  name="consumption"
                  value={formData.consumption}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="e.g., 150"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="kwh">kWh</option>
                  <option value="liters">Liters</option>
                  <option value="cubic-meters">Cubic Meters</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Diet Fields */}
        {formData.category === 'diet' && (
          <>
            <div className="form-group">
              <label htmlFor="mealType">Meal Type *</label>
              <select
                id="mealType"
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                required
              >
                <option value="beef">Beef</option>
                <option value="pork">Pork</option>
                <option value="chicken">Chicken</option>
                <option value="fish">Fish</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numberOfMeals">Number of Meals *</label>
              <input
                type="number"
                id="numberOfMeals"
                name="numberOfMeals"
                value={formData.numberOfMeals}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="e.g., 3"
                required
              />
            </div>
          </>
        )}

        {/* Consumption Fields */}
        {formData.category === 'consumption' && (
          <>
            <div className="form-group">
              <label htmlFor="itemType">Item Type *</label>
              <select
                id="itemType"
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
                required
              >
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="furniture">Furniture</option>
                <option value="paper">Paper</option>
                <option value="plastic">Plastic</option>
                <option value="waste">Waste</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                step="1"
                placeholder="e.g., 2"
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional details..."
            maxLength="500"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : activity ? 'Update Activity' : 'Add Activity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
