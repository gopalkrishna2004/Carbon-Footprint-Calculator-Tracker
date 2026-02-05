# Carbon Footprint Calculator & Tracker

A full-stack web application that helps individuals and small businesses track and reduce their carbon footprint through AI-powered personalized recommendations.

## 📺 Demo

Watch the demo video: [View Demo](https://drive.google.com/file/d/1yrBlqKOjrKGAmR4wUO4SmFErm1I3S6yP/view?usp=drive_link)

## ✨ Features

- **User Authentication**: Secure registration and login system with JWT-based authentication
- **Activity Tracking**: Log daily activities across multiple categories:
  - Transportation (car, bus, train, flight, etc.)
  - Energy consumption (electricity, heating, cooling)
  - Food choices (meat, dairy, plant-based)
  - Waste management (recycling, composting)
- **Dashboard Analytics**: 
  - Real-time carbon emissions tracking
  - Visual charts and graphs using Recharts
  - Category-wise breakdown with pie charts
  - Emissions trends over time
- **AI-Powered Recommendations**: 
  - Personalized suggestions powered by Google Gemini AI
  - Context-aware recommendations based on user activities
  - Interactive chatbot for carbon footprint queries
- **Comparison Metrics**: Compare your carbon footprint against national/global averages
- **User Profile**: Manage personal information and view overall statistics

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Context API** - State management

### Backend
- **Node.js** & **Express** - Server framework
- **MongoDB** - Database
- **Google Generative AI**- AI recommendations (Gemini)
- **JWT** - Authentication tokens


## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** 
- **MongoDB** (local installation or MongoDB Atlas account)
- **Google Gemini API Key** (for AI recommendations)
- **npm** package manager

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Carbon
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Carbon/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── activityController.js # Activity CRUD operations
│   │   ├── aiController.js       # AI recommendation logic
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── Activity.js           # Activity schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── activityRoutes.js     # Activity API routes
│   │   ├── aiRoutes.js           # AI API routes
│   │   └── authRoutes.js         # Auth API routes
│   ├── services/
│   │   └── aiService.js          # Google Gemini integration
│   ├── utils/
│   │   └── carbonCalculator.js  # CO2 calculation logic
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityForm.js   # Activity input form
│   │   │   ├── ActivityList.js   # List of activities
│   │   │   ├── CategoryPieChart.js # Pie chart visualization
│   │   │   ├── Chatbot.js        # AI chatbot interface
│   │   │   ├── ComparisonCard.js # Comparison metrics
│   │   │   ├── EmissionsChart.js # Line/bar charts
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   └── PrivateRoute.js   # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── pages/
│   │   │   ├── Activities.js     # Activities page
│   │   │   ├── AIRecommendations.js # AI recommendations page
│   │   │   ├── Dashboard.js      # Main dashboard
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Profile.js        # User profile page
│   │   │   └── Register.js       # Registration page
│   │   ├── App.js                # Main app component
│   │   └── index.js              # React entry point
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Activities
- `GET /api/activities` - Get all user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `GET /api/activities/stats` - Get activity statistics

### AI Recommendations
- `POST /api/ai/recommendations` - Get AI-powered recommendations
- `POST /api/ai/chat` - Chat with AI assistant

## 🌱 Carbon Calculation

The application calculates CO2 emissions based on:

- **Transportation**: Distance × emission factor per mode
- **Energy**: kWh consumption × regional grid emission factor
- **Food**: Portion size × food type emission factor
- **Waste**: Weight × waste type emission factor

## 🤖 AI Integration

Powered by Google Gemini AI to provide:
- Personalized reduction strategies
- Context-aware recommendations based on user data
- Interactive chatbot for sustainability questions
- Real-time analysis of carbon footprint patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

