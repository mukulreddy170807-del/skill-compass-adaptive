# ASTRA - Adaptive Skills Training and Resource Application

## 🎯 Overview

ASTRA is an AI-powered adaptive learning platform that provides personalized skill assessments, career guidance, and learning roadmaps. Built with cutting-edge AI technology from Google Gemini, ASTRA creates a truly adaptive learning experience for students and employees.

## ✨ Key Features

### 🤖 AI-Powered Features
- **Adaptive Assessments**: AI generates unique questions that adapt to your skill level in real-time
- **Career Recommendations**: Intelligent career path analysis with personalized reasoning
- **Learning Roadmaps**: AI-generated learning paths with resources, projects, and milestones
- **AI Learning Assistant**: Interactive chat-based guidance available throughout the platform

### 👥 User Roles
- **Students**: Career exploration, questionnaires, and personalized roadmaps
- **Employees**: Skill assessments and performance tracking
- **Managers**: Team analytics and skill gap analysis
- **HR/Admin**: Organization-wide analytics and management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd skill-compass-adaptive

# Install dependencies
npm install

# Configure your Gemini API key
# 1. Copy .env.example to .env
# 2. Add your API key to .env file
# 3. See AI_SETUP_GUIDE.md for detailed instructions

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📚 Documentation

- **[AI Setup Guide](AI_SETUP_GUIDE.md)** - Comprehensive guide for setting up AI features
- **[User Guide](docs/user-guide.md)** - How to use the platform (coming soon)
- **[API Documentation](docs/api.md)** - Technical API reference (coming soon)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **AI**: Google Gemini API
- **Testing**: Vitest + Testing Library

## 🎨 Project Structure

```
skill-compass-adaptive/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── AIGuidance.tsx
│   ├── features/        # Feature-specific logic
│   │   ├── assessment/  # Adaptive assessment engine
│   │   └── student/     # Career guidance engine
│   ├── pages/           # Page components
│   ├── services/        # External services (Gemini API)
│   ├── store/           # State management
│   └── types/           # TypeScript definitions
├── public/              # Static assets
└── .env                 # Environment configuration
```

## 🧪 Testing

```sh
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔒 Security

- Never commit your `.env` file
- Keep your Gemini API key secure
- Use environment variables for all sensitive data
- Review the [Security Guide](docs/security.md) for best practices (coming soon)
