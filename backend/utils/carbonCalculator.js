/**
 * Carbon Emission Calculation Utilities
 * All emissions calculated in kg CO2e (carbon dioxide equivalent)
 */

// Transportation emission factors (kg CO2 per km)
const TRANSPORT_EMISSIONS = {
  'car-petrol': 0.12,
  'car-diesel': 0.15,
  'car-electric': 0.05,
  'bus': 0.089,
  'train': 0.041,
  'flight-short': 0.255, // Short-haul flights (< 1500 km)
  'flight-long': 0.195,  // Long-haul flights (> 1500 km)
  'motorcycle': 0.103,
  'bicycle': 0,          // Zero emissions
};

// Energy emission factors (kg CO2 per kWh or unit)
const ENERGY_EMISSIONS = {
  'electricity': 0.5,        // kg CO2 per kWh
  'natural-gas': 0.185,      // kg CO2 per kWh
  'heating-oil': 2.52,       // kg CO2 per liter
  'coal': 0.34,              // kg CO2 per kWh
};

// Diet emission factors (kg CO2 per meal)
const DIET_EMISSIONS = {
  'beef': 6.0,
  'pork': 2.5,
  'chicken': 1.5,
  'fish': 1.3,
  'vegetarian': 1.5,
  'vegan': 0.9,
};

// Consumption emission factors (kg CO2 per item/kg)
const CONSUMPTION_EMISSIONS = {
  'clothing': 10.0,          // per item
  'electronics': 50.0,       // per item
  'furniture': 30.0,         // per item
  'paper': 1.8,              // per kg
  'plastic': 6.0,            // per kg
  'waste': 0.5,              // per kg
};

/**
 * Calculate carbon emission for transportation activities
 * @param {string} transportMode - Type of transport
 * @param {number} distance - Distance in kilometers
 * @returns {number} Carbon emission in kg CO2
 */
const calculateTransportEmission = (transportMode, distance) => {
  if (!transportMode || !distance || distance <= 0) {
    return 0;
  }
  
  const emissionFactor = TRANSPORT_EMISSIONS[transportMode] || 0;
  return emissionFactor * distance;
};

/**
 * Calculate carbon emission for energy activities
 * @param {string} energyType - Type of energy
 * @param {number} consumption - Amount consumed
 * @param {string} unit - Unit of measurement
 * @returns {number} Carbon emission in kg CO2
 */
const calculateEnergyEmission = (energyType, consumption, unit) => {
  if (!energyType || !consumption || consumption <= 0) {
    return 0;
  }
  
  const emissionFactor = ENERGY_EMISSIONS[energyType] || 0;
  
  // Convert units if necessary
  let adjustedConsumption = consumption;
  if (unit === 'cubic-meters' && energyType === 'natural-gas') {
    // 1 cubic meter of natural gas ≈ 10.55 kWh
    adjustedConsumption = consumption * 10.55;
  }
  
  return emissionFactor * adjustedConsumption;
};

/**
 * Calculate carbon emission for diet activities
 * @param {string} mealType - Type of meal
 * @param {number} numberOfMeals - Number of meals
 * @returns {number} Carbon emission in kg CO2
 */
const calculateDietEmission = (mealType, numberOfMeals) => {
  if (!mealType || !numberOfMeals || numberOfMeals <= 0) {
    return 0;
  }
  
  const emissionFactor = DIET_EMISSIONS[mealType] || 0;
  return emissionFactor * numberOfMeals;
};

/**
 * Calculate carbon emission for consumption activities
 * @param {string} itemType - Type of item
 * @param {number} quantity - Quantity
 * @returns {number} Carbon emission in kg CO2
 */
const calculateConsumptionEmission = (itemType, quantity) => {
  if (!itemType || !quantity || quantity <= 0) {
    return 0;
  }
  
  const emissionFactor = CONSUMPTION_EMISSIONS[itemType] || 5.0; // Default 5kg CO2
  return emissionFactor * quantity;
};

/**
 * Main calculation function that routes to appropriate calculator
 * @param {Object} activity - Activity object
 * @returns {number} Carbon emission in kg CO2
 */
const calculateCarbonEmission = (activity) => {
  const { category } = activity;
  
  switch (category) {
    case 'transportation':
      return calculateTransportEmission(activity.transportMode, activity.distance);
    
    case 'energy':
      return calculateEnergyEmission(activity.energyType, activity.consumption, activity.unit);
    
    case 'diet':
      return calculateDietEmission(activity.mealType, activity.numberOfMeals);
    
    case 'consumption':
      return calculateConsumptionEmission(activity.itemType, activity.quantity);
    
    default:
      return 0;
  }
};

/**
 * Get emission factor info for display
 * @param {string} category - Activity category
 * @param {string} type - Specific type within category
 * @returns {Object} Emission factor information
 */
const getEmissionFactor = (category, type) => {
  switch (category) {
    case 'transportation':
      return {
        factor: TRANSPORT_EMISSIONS[type] || 0,
        unit: 'kg CO2/km',
      };
    case 'energy':
      return {
        factor: ENERGY_EMISSIONS[type] || 0,
        unit: 'kg CO2/kWh',
      };
    case 'diet':
      return {
        factor: DIET_EMISSIONS[type] || 0,
        unit: 'kg CO2/meal',
      };
    case 'consumption':
      return {
        factor: CONSUMPTION_EMISSIONS[type] || 0,
        unit: 'kg CO2/item',
      };
    default:
      return { factor: 0, unit: '' };
  }
};

module.exports = {
  calculateCarbonEmission,
  calculateTransportEmission,
  calculateEnergyEmission,
  calculateDietEmission,
  calculateConsumptionEmission,
  getEmissionFactor,
  TRANSPORT_EMISSIONS,
  ENERGY_EMISSIONS,
  DIET_EMISSIONS,
  CONSUMPTION_EMISSIONS,
};
