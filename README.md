# 🤖 AI Voice Assistant

A modern, interactive AI-powered voice assistant built with React and Google's Gemini AI. This application provides real-time speech recognition, AI-powered responses, weather information, and time queries through an intuitive voice interface.

## 🌟 Features

### 🎤 Voice Interaction
- **Speech Recognition**: Real-time voice input using Web Speech API
- **Text-to-Speech**: Natural voice responses with customizable voice selection
- **Interactive UI**: Visual feedback with listening and speaking animations

### 🧠 AI-Powered Responses
- **Google Gemini Integration**: Powered by Google's Gemini 1.5 Flash model
- **Intelligent Conversations**: Natural language processing for meaningful interactions
- **Context Awareness**: Maintains conversation context for better responses

### 🌤️ Smart Features
- **Weather Information**: Real-time weather data for any location
- **Time Queries**: Current time display and voice responses
- **Error Handling**: Graceful error handling with user-friendly messages

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Animated Interface**: Smooth animations and visual feedback
- **Gradient Styling**: Modern gradient text and glowing button effects
- **Dark Theme**: Sleek dark interface with cyan accent colors

## 🚀 Live Demo

**🌐 [Try the AI Voice Assistant](https://ai-voice-assistant-omhcgysce-eshani-pauls-projects.vercel.app)**

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with Vite
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Speech APIs**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Weather API**: OpenWeatherMap API
- **Icons**: React Icons
- **Styling**: CSS3 with modern gradients and animations
- **Deployment**: Vercel

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with Web Speech API support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-voice-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API Keys**

   Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   VITE_WEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Usage

### Basic Voice Commands

1. **Click the microphone button** or say "Click Here" to start listening
2. **Speak your query** - the assistant will process your voice input
3. **Listen to the response** - the AI will respond with voice and text

### Supported Commands

- **General Questions**: "What is the weather like?", "Tell me a joke", "Explain quantum physics"
- **Weather Queries**: "What's the weather in New York?", "Is it raining today?"
- **Time Queries**: "What time is it?", "Current time please"
- **Conversations**: Ask follow-up questions and maintain context

## 🏗️ Project Structure

```
ai-voice-assistant/
├── public/
│   ├── ai.png              # Backup AI avatar image
│   └── vite.svg            # Vite logo
├── src/
│   ├── assets/
│   │   ├── ai.png          # Main AI avatar image
│   │   ├── aiVoice.gif     # Speaking animation
│   │   ├── speak.gif       # Listening animation
│   │   └── logo.png        # App logo
│   ├── context/
│   │   └── UserContext.jsx # Global state management
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── gemini.js           # Google Gemini AI integration
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── dist/                   # Production build files
├── firebase.json           # Firebase hosting configuration
├── package.json            # Project dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔧 Key Components

### UserContext.jsx
- **Global State Management**: Manages speech recognition, synthesis, and application state
- **Speech Recognition**: Handles voice input using Web Speech API
- **Weather Integration**: Fetches weather data from OpenWeatherMap API
- **Time Management**: Provides current time functionality
- **Error Handling**: Graceful error handling for speech and API failures

### App.jsx
- **Main UI Component**: Renders the primary user interface
- **Voice Controls**: Interactive microphone button and visual feedback
- **Responsive Design**: Adaptive layout for different screen sizes
- **Animation States**: Shows different animations for listening/speaking states

### gemini.js
- **AI Integration**: Connects to Google's Gemini 1.5 Flash model
- **Retry Logic**: Implements exponential backoff for API rate limiting
- **Error Handling**: Provides fallback responses for API failures

## 🌐 Browser Compatibility

- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Firefox**: Limited speech synthesis support
- **Safari**: Limited Web Speech API support
- **Mobile Browsers**: Varies by platform

## 🔑 API Keys Setup

### Google Gemini AI
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file as `VITE_GEMINI_API_KEY`

### OpenWeatherMap (Optional)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to your `.env` file as `VITE_WEATHER_API_KEY`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the AI capabilities
- **OpenWeatherMap** for weather data
- **React Team** for the amazing framework
- **Vite** for the fast build tool
- **Vercel** for seamless deployment

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

---

**Made with ❤️ and React**

🌟 **Star this repository if you found it helpful!**
