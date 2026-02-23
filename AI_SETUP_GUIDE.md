# ASTRA - AI-Powered Adaptive Learning Platform

## 🚀 Overview

ASTRA (Adaptive Skills Training and Resource Application) is an AI-powered adaptive learning platform that uses Google's Gemini AI to provide personalized assessments, career guidance, and learning roadmaps.

## ✨ AI Features

### 1. **Adaptive Assessments**
- AI generates unique, personalized questions based on skill level
- Questions adapt in real-time based on performance
- Detailed performance analysis with AI-powered feedback
- Identifies strengths, weaknesses, and provides actionable next steps

### 2. **AI Career Recommendations**
- Intelligent career path analysis based on questionnaire responses
- Personalized reasoning for each career match
- Considers education, interests, and career goals
- Provides realistic salary ranges and timelines

### 3. **Personalized Learning Roadmaps**
- AI-generated learning paths tailored to individual goals
- Includes specific resources, projects, and milestones
- Adapts to current skill level and timeframe
- Detailed phase-by-phase guidance

### 4. **AI Learning Assistant**
- Interactive chat interface for learning guidance
- Context-aware responses based on user progress
- Available across the platform via floating assistant
- Provides encouragement and practical advice

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Google Gemini API key

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace `your_gemini_api_key_here` with your actual API key:

\`\`\`env
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
\`\`\`

**Important:** Never commit your `.env` file to version control!

### Step 3: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 4: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:8080`

## 🎯 Using AI Features

### For Students

1. **Take the Career Questionnaire**
   - Enable "AI Mode" for enhanced analysis
   - Answer all questions thoughtfully
   - Receive AI-powered career recommendations

2. **View Your Roadmap**
   - AI generates detailed learning paths
   - Includes resources, projects, and milestones
   - Toggle AI mode on/off to compare

3. **Use the AI Assistant**
   - Click the Sparkles icon in the bottom right
   - Ask questions about your learning journey
   - Get personalized guidance and support

### For Employees

1. **Take Skill Assessments**
   - Enable "AI Mode" for dynamic questions
   - Questions adapt to your skill level
   - Receive detailed performance analysis

2. **Review AI Feedback**
   - Get insights on strengths and improvements
   - Receive specific next steps
   - Track progress over time

## 🔒 Security & Privacy

- API keys are stored locally in `.env` files
- Never shared or transmitted except to Google's API
- All communication with Gemini API is encrypted (HTTPS)
- No user data is stored on external servers

## 🛠️ Troubleshooting

### "API key not configured" Error

**Solution:** Ensure your `.env` file exists and contains a valid API key:
\`\`\`env
VITE_GEMINI_API_KEY=your_actual_key_here
\`\`\`

Restart the development server after adding the key.

### "Gemini API error" Messages

**Common causes:**
1. Invalid API key
2. API quota exceeded (free tier limits)
3. Network connectivity issues

**Solutions:**
- Verify your API key is correct
- Check your [API usage](https://makersuite.google.com/app/apikey)
- Try again in a few minutes
- Toggle "AI Mode" off to use fallback features

### AI Features Not Working

**Solutions:**
1. Check browser console for errors
2. Verify `.env` file is properly formatted
3. Ensure you've restarted the dev server after adding the API key
4. Try disabling browser extensions that might block API calls

## 📊 API Usage & Limits

**Gemini API Free Tier:**
- 60 requests per minute
- 1,500 requests per day
- Sufficient for testing and small deployments

**For Production:**
- Consider upgrading to a paid plan
- Implement request caching
- Add rate limiting to protect your quota

## 🎨 Customization

### Adjusting AI Behavior

Edit `src/services/geminiService.ts` to customize:
- Temperature (creativity): 0.0 - 1.0
- Max tokens (response length)
- Prompt templates
- Response parsing logic

### Disabling AI Features

Users can toggle "AI Mode" on/off in the UI to:
- Use static questions instead of AI-generated
- Use rule-based career matching
- Use template roadmaps

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## 🤝 Contributing

When contributing AI features:
1. Always handle API errors gracefully
2. Provide fallback functionality
3. Test with API key disabled
4. Document new AI prompts
5. Consider API costs and quotas

## 📖 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Best Practices for Prompting](https://ai.google.dev/docs/prompting_guidelines)

## 🐛 Known Issues

- AI responses may take 2-5 seconds to generate
- Free tier has daily limits
- Some prompts may occasionally need refinement
- Network errors should retry with exponential backoff (TODO)

## 🔮 Future Enhancements

- [ ] Add response caching to reduce API calls
- [ ] Implement retry logic with exponential backoff
- [ ] Add support for multiple AI providers
- [ ] Create admin dashboard for AI analytics
- [ ] Implement conversation history persistence
- [ ] Add voice interface for AI assistant

---

**Need Help?** Check the troubleshooting section or create an issue on GitHub.
