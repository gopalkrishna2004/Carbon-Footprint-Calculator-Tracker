const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

/**
 * Generate personalized recommendations based on user's emission data
 */
exports.generateRecommendations = async (userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert environmental consultant helping users reduce their carbon footprint.

User's Carbon Footprint Data:
- Total Emissions: ${userData.totalEmissions} kg CO₂
- Time Period: ${userData.period}
- Activity Breakdown:
${Object.entries(userData.byCategory || {})
  .map(([category, data]) => `  • ${category}: ${data.emissions.toFixed(2)} kg CO₂ (${data.count} activities)`)
  .join('\n')}

Based on this data, provide 5 personalized, actionable recommendations to reduce their carbon footprint. Focus on:
1. Their highest emission categories
2. Specific, practical actions they can take
3. Estimated CO₂ savings for each recommendation

Format your response as a JSON array with this structure:
[
  {
    "title": "Short recommendation title",
    "description": "Detailed explanation of the action",
    "category": "transportation|energy|diet|consumption",
    "impact": "high|medium|low",
    "savings": "Estimated CO₂ savings in kg per month"
  }
]

Return ONLY valid JSON, no additional text.`;

    console.log('Prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      return recommendations;
    }
    
    // Fallback if JSON parsing fails
    return generateFallbackRecommendations(userData);
  } catch (error) {
    console.error('AI Service Error:', error);
    return generateFallbackRecommendations(userData);
  }
};

/**
 * Chat with AI about carbon footprint
 */
exports.chatWithAI = async (userMessage, userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a friendly and knowledgeable environmental assistant helping users understand and reduce their carbon footprint.

User's Current Carbon Footprint:
- Total Emissions: ${userData.totalEmissions} kg CO₂ (${userData.period})
- Categories: ${Object.keys(userData.byCategory || {}).join(', ')}

- Activity Breakdown:
${Object.entries(userData.byCategory || {})
  .map(([category, data]) => `  • ${category}: ${data.emissions.toFixed(2)} kg CO₂ (${data.count} activities)`)
  .join('\n')}

User Question: ${userMessage}

Provide a helpful, friendly, and informative response. Be specific and actionable. If relevant, reference their specific emission data.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      message: response.text(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return {
      message: "I'm having trouble connecting right now. Please try again in a moment!",
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Fallback recommendations if AI fails
 */
function generateFallbackRecommendations(userData) {
  const recommendations = [];
  
  const categories = userData.byCategory || {};
  
  // Sort categories by emissions
  const sortedCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b.emissions - a.emissions);

  // Transportation recommendations
  if (categories.transportation) {
    recommendations.push({
      title: 'Switch to Public Transportation',
      description: 'Consider using public transit, carpooling, or cycling for short trips. This can reduce your transportation emissions by up to 50%.',
      category: 'transportation',
      impact: 'high',
      savings: `${(categories.transportation.emissions * 0.5).toFixed(1)} kg CO₂/month`,
    });
  }

  // Energy recommendations
  if (categories.energy) {
    recommendations.push({
      title: 'Switch to LED Bulbs & Unplug Devices',
      description: 'Replace all bulbs with LEDs and unplug devices when not in use. This can save 10-20% on electricity.',
      category: 'energy',
      impact: 'medium',
      savings: `${(categories.energy.emissions * 0.15).toFixed(1)} kg CO₂/month`,
    });
  }

  // Diet recommendations
  if (categories.diet) {
    recommendations.push({
      title: 'Reduce Meat Consumption',
      description: 'Try "Meatless Mondays" or reduce beef consumption. Plant-based meals have 10x lower emissions.',
      category: 'diet',
      impact: 'high',
      savings: `${(categories.diet.emissions * 0.3).toFixed(1)} kg CO₂/month`,
    });
  }

  // Consumption recommendations
  if (categories.consumption) {
    recommendations.push({
      title: 'Buy Second-Hand & Repair',
      description: 'Choose second-hand items and repair instead of replacing. Manufacturing accounts for huge emissions.',
      category: 'consumption',
      impact: 'medium',
      savings: `${(categories.consumption.emissions * 0.4).toFixed(1)} kg CO₂/month`,
    });
  }

  // General recommendation
  recommendations.push({
    title: 'Track & Set Goals',
    description: 'Continue tracking your activities and set a monthly reduction goal. Awareness is the first step to change!',
    category: 'general',
    impact: 'medium',
    savings: '5-10 kg CO₂/month',
  });

  return recommendations.slice(0, 5);
}
