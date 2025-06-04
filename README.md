# 🤖 AI Voice Assistant

A modern, interactive AI-powered voice assistant built with React and Google's Gemini AI. This application provides real-time speech recognition, AI-powered responses, weather information, and time queries through an intuitive voice interface.

## 📱 Screenshots

<div align="center">

### Main Interface
![AI Voice Assistant Interface](https://res.cloudinary.com/dporz9gz6/image/upload/v1749035935/WhatsApp_Image_2025-06-04_at_16.46.07_67d1d929_ec4zzz.jpg)

### Active Listening State
![Listening Mode](https://res.cloudinary.com/dporz9gz6/image/upload/v1749035935/WhatsApp_Image_2025-06-04_at_16.47.04_4539fe94_casjiu.jpg)

### AI Response Display
![AI Response](https://res.cloudinary.com/dporz9gz6/image/upload/v1749035936/WhatsApp_Image_2025-06-04_at_16.46.09_762c8468_kdztk5.jpg)

</div>

## 🌟 Features

### 🎤 Voice Interaction
- **Real-time Speech Recognition**: Powered by Web Speech API for accurate voice input
- **Natural Text-to-Speech**: Customizable voice responses with multiple voice options
- **Double-tap Activation**: Click anywhere to start listening after AI responds
- **Visual Feedback**: Dynamic animations showing listening and speaking states
- **Interactive Controls**: One-click microphone activation with visual indicators

### 🧠 AI-Powered Intelligence
- **Google Gemini Integration**: Advanced AI responses using Gemini 1.5 Flash model
- **Contextual Conversations**: Maintains conversation history for coherent interactions
- **Smart Query Processing**: Handles complex questions and provides detailed responses
- **Fallback Mechanisms**: Graceful handling of API limitations and errors

### 🌤️ Smart Capabilities
- **Weather Information**: Real-time weather data for any global location
- **Time & Date Queries**: Instant time display with voice confirmation
- **Multi-domain Knowledge**: Science, technology, general knowledge, and more
- **Error Recovery**: User-friendly error messages and retry mechanisms

### 📱 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Animated Interface**: Smooth transitions and engaging visual feedback
- **Gradient Styling**: Modern cyan-themed gradients and glowing effects
- **Dark Theme**: Sleek interface with high contrast and accessibility
- **Intuitive Controls**: Simple, accessible interaction patterns

## 🚀 Live Demo

**🌐 [Try the AI Voice Assistant](https://ai-voice-assistant-omhcgysce-eshani-pauls-projects.vercel.app)**

Experience the full functionality of the voice assistant in your browser!

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0 with modern hooks and components
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Speech APIs**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Weather Service**: OpenWeatherMap API for real-time weather data
- **Icons**: React Icons for beautiful UI elements
- **Styling**: Modern CSS3 with gradients, animations, and responsive design
- **Deployment**: Vercel for seamless hosting and CI/CD

## 📦 Dependencies

```json
{
  "dependencies": {
    "@google/genai": "^1.3.0",
    "@google/generative-ai": "^0.24.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.1",
    "vite": "^6.3.5",
    "eslint": "^9.25.0"
  }
}
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Modern web browser** with Web Speech API support (Chrome recommended)
- **Internet connection** for AI and weather services

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-voice-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API Keys**

   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   VITE_WEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## 🎯 How to Use

### Getting Started
1. **Allow Microphone Access**: Grant microphone permissions when prompted
2. **Double-tap/Click to Listen**: Click anywhere on screen or use the microphone button
3. **Speak Clearly**: Voice your question or command
4. **Listen to Response**: The AI will respond with both voice and text
5. **Click to Stop**: Click anywhere while AI is speaking to stop

### Voice Commands Examples

#### 💬 General Conversations
- "Hello, how are you today?"
- "Tell me an interesting fact"
- "What can you help me with?"
- "Explain artificial intelligence"

#### 🌤️ Weather Queries
- "What's the weather like today?"
- "Weather forecast for New York"
- "Is it going to rain tomorrow?"
- "Temperature in London"

#### ⏰ Time & Date
- "What time is it?"
- "Current date and time"
- "What day is today?"

#### 🧠 Knowledge Questions
- "How does photosynthesis work?"
- "Tell me about space exploration"
- "Explain quantum computing"
- "What is machine learning?"

## 🏗️ Project Architecture

```
ai-voice-assistant/
├── 📁 public/
│   ├── 🖼️ ai.png              # Backup AI avatar
│   ├── 🎭 favicon.ico         # App favicon
│   └── ⚡ vite.svg            # Vite logo
├── 📁 src/
│   ├── 📁 assets/
│   │   ├── 🤖 sphere.gif      # Main AI avatar animation
│   │   ├── 🎬 aiVoice.gif     # Speaking animation
│   │   ├── 🎤 speak.gif       # Listening animation
│   │   └── 🏷️ logo.png        # App logo
│   ├── 📁 context/
│   │   └── 🌐 UserContext.jsx # Global state management
│   ├── 📄 App.jsx             # Main component
│   ├── 🎨 App.css             # Component styles
│   ├── 🧠 gemini.js           # AI integration
│   ├── 🌐 index.css           # Global styles
│   └── 🚀 main.jsx            # Entry point
├── 📁 dist/                   # Production build
├── 🔥 firebase.json           # Firebase config
├── 📦 package.json            # Dependencies
└── ⚙️ vite.config.js          # Vite configuration
```

## 🔧 Core Components

### 🌐 UserContext.jsx
**Global State Management & Speech Processing**
- Manages application-wide state and speech functionality
- Integrates Web Speech API for voice recognition and synthesis
- Handles weather API calls and time management
- Implements error handling and retry logic
- Provides context to all child components
- **New**: Removed continuous listening, added double-tap activation

### 📱 App.jsx
**Main User Interface**
- Renders the primary application interface
- Manages voice control interactions and visual feedback
- Implements responsive design patterns
- Handles animation states and user interactions
- Displays AI responses and conversation history
- **New**: Enhanced click handling for double-tap activation

### 🧠 gemini.js
**AI Integration Layer**
- Connects to Google's Gemini 1.5 Flash model
- Implements retry logic with exponential backoff
- Handles API rate limiting and error scenarios
- Processes natural language queries
- Returns structured AI responses

## 🌐 Browser Support

| Browser | Speech Recognition | Text-to-Speech | Overall Support |
|---------|-------------------|----------------|-----------------|
| **Chrome** | ✅ Full | ✅ Full | 🟢 Excellent |
| **Edge** | ✅ Full | ✅ Full | 🟢 Excellent |
| **Firefox** | ⚠️ Limited | ⚠️ Limited | 🟡 Partial |
| **Safari** | ⚠️ Limited | ⚠️ Limited | 🟡 Partial |
| **Mobile Chrome** | ✅ Good | ✅ Good | 🟢 Good |
| **Mobile Safari** | ⚠️ Limited | ⚠️ Limited | 🟡 Limited |

**Recommendation**: Use Chrome or Edge for the best experience.

## 🔑 API Configuration

### 🧠 Google Gemini AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file as `VITE_GEMINI_API_KEY`
5. Review usage limits and pricing

### 🌤️ OpenWeatherMap Setup (Optional)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Verify your email address
3. Generate a free API key
4. Add to `.env` as `VITE_WEATHER_API_KEY`
5. Note: Free tier allows 1,000 calls/month

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist folder via Netlify UI
# Configure environment variables in site settings
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 🔧 Customization

### 🎨 Styling Customization
- Modify `App.css` for component-specific styles
- Update `index.css` for global theme changes
- Customize gradient colors and animations
- Adjust responsive breakpoints

### 🔊 Voice Settings
- Change voice selection in `UserContext.jsx`
- Adjust speech rate and pitch parameters
- Customize language and accent preferences
- Implement voice filtering options

### 🤖 AI Behavior
- Modify prompts in `gemini.js`
- Adjust response length and style
- Implement custom conversation flows
- Add specialized knowledge domains

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### 📋 Contribution Guidelines
- Follow React best practices
- Write clear, commented code
- Test on multiple browsers
- Update documentation as needed
- Respect the existing code style

## 🐛 Troubleshooting

### Common Issues

**Microphone not working**
- Check browser permissions
- Ensure HTTPS connection
- Try refreshing the page
- Test with different browsers

**AI responses not working**
- Verify API keys are correctly set
- Check internet connection
- Review browser console for errors
- Ensure API quotas aren't exceeded

**Voice synthesis issues**
- Check browser compatibility
- Verify audio permissions
- Try different voice selections
- Test system audio settings

**Double-tap/click not working**
- Check browser console for click events
- Ensure permissions are granted
- Try refreshing the page
- Verify speech recognition is initialized

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for complete details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For providing advanced AI capabilities
- **OpenWeatherMap** - For reliable weather data services
- **React Team** - For the amazing React framework
- **Vite** - For the lightning-fast build tool
- **Vercel** - For seamless deployment and hosting
- **Web Speech API** - For enabling voice interactions
- **Open Source Community** - For inspiration and resources

## 📞 Support & Community

### 🆘 Get Help
- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Documentation**: Check this README and inline code comments

### 🌟 Show Your Support
If you found this project helpful:
- ⭐ Star the repository
- 🍴 Fork for your own projects
- 📢 Share with others
- 💝 Consider sponsoring development

---

<div align="center">

**🚀 Made with ❤️ using React and AI**

*Building the future of voice interactions, one conversation at a time.*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/euii-ii/AI-VOICE-ASSISTANCE.git)

</div>
