import React, { createContext, useState, useEffect, useRef } from 'react'
import run from '../gemini';

// Create context with initial value
export const datacontext = createContext({
    recognition: null,
    startListening: () => {},
    stopListening: () => {},
    stopSpeaking: () => {},
    directSpeak: () => {},
    isListening: false,
    isSpeaking: false,
    weather: null,
    currentTime: '',
    permissionGranted: false,
    autoStarted: false,
    speechEnabled: false
});

function UserContext({children}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [autoStarted, setAutoStarted] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useState(false);
    const [enableWelcomeMessage, setEnableWelcomeMessage] = useState(true); // Toggle for welcome message

    const recognitionTimeout = useRef(null);
    const userHasInteracted = useRef(false);
    const recognition = useRef(null);
    const hasSpokenWelcome = useRef(false);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = 'en-US';

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('🎤 User said:', transcript);
                setIsListening(false);
                handleSpeech(transcript);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, []);

    // Simple start listening function
    const startListening = () => {
        if (!recognition.current) {
            console.error('Speech recognition not available');
            return;
        }

        if (isListening) {
            console.log('Already listening');
            return;
        }

        // Mark user interaction
        userHasInteracted.current = true;
        setSpeechEnabled(true);

        // Speak welcome message on first interaction (if enabled)
        if (!hasSpokenWelcome.current && enableWelcomeMessage) {
            hasSpokenWelcome.current = true;
            setTimeout(() => {
                directSpeak("Hello! I'm your AI voice assistant. I'm ready to help you. You can ask me questions, request weather information, or ask for the time.");
            }, 500);
            return; // Don't start listening immediately after welcome
        }

        try {
            recognition.current.start();
            setIsListening(true);
            console.log('🎤 Started listening');

            // Auto-stop after 10 seconds
            recognitionTimeout.current = setTimeout(() => {
                stopListening();
            }, 10000);
        } catch (error) {
            console.error('Error starting recognition:', error);
            setIsListening(false);
        }
    };

    // Simple stop listening function
    const stopListening = () => {
        if (recognitionTimeout.current) {
            clearTimeout(recognitionTimeout.current);
            recognitionTimeout.current = null;
        }

        if (recognition.current && isListening) {
            try {
                recognition.current.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
        }
        setIsListening(false);
        console.log('🛑 Stopped listening');
    };

    // Simple speech synthesis function
    const directSpeak = (text) => {
        console.log('🔊 Speaking:', text);

        // Only speak if user has interacted
        if (!userHasInteracted.current) {
            console.log('🚫 Blocking speech - no user interaction yet');
            return;
        }

        if (!window.speechSynthesis) {
            console.error('Speech synthesis not available');
            return;
        }

        // Cancel any existing speech
        window.speechSynthesis.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = 'en-US';

        utterance.onstart = () => {
            console.log('✅ Speech started');
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            console.log('✅ Speech ended');
            setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
            console.error('❌ Speech error:', event.error);
            setIsSpeaking(false);
        };

        // Speak
        window.speechSynthesis.speak(utterance);
    };

    // Stop speaking function
    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        console.log('🛑 Stopped speaking');
    };

    // AI response function
    const aiResponse = async (prompt) => {
        try {
            console.log('🤖 AI Response for:', prompt);

            // Add current date and time context to the prompt
            const now = new Date();
            const currentDateTime = now.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });

            const contextualPrompt = `Current date and time: ${currentDateTime}

User question: ${prompt}

Please provide an accurate response based on the current date and time provided above. If the user asks about today's date, time, or anything time-sensitive, use the current information provided.`;

            console.log('🕒 Sending prompt with current context:', contextualPrompt);

            const text = await run(contextualPrompt);
            console.log('✅ AI response received:', text);

            if (text && text.trim().length > 0) {
                directSpeak(text);
            } else {
                directSpeak("I'm sorry, I didn't understand that. Could you please try again?");
            }
        } catch (error) {
            console.error('❌ Error in AI response:', error);
            directSpeak("I'm sorry, I'm having trouble connecting to my AI service. Please try again.");
        }
    };

    // Handle speech input
    const handleSpeech = async (transcript) => {
        try {
            const lowerTranscript = transcript.toLowerCase();
            console.log('🔍 Processing:', lowerTranscript);

            if (lowerTranscript.includes('weather')) {
                const weatherInfo = await getWeather();
                directSpeak(weatherInfo);
            } else if (lowerTranscript.includes('time') && !lowerTranscript.includes('what time') && !lowerTranscript.includes('current time')) {
                const timeInfo = getTime();
                directSpeak(timeInfo);
            } else if (lowerTranscript.includes('date') || lowerTranscript.includes('today') || lowerTranscript.includes('what day')) {
                const dateInfo = getDate();
                directSpeak(dateInfo);
            } else if (lowerTranscript.includes('open youtube') || (lowerTranscript.includes('youtube') && lowerTranscript.includes('open'))) {
                openYouTube();
            } else if (lowerTranscript.includes('open google') || (lowerTranscript.includes('google') && lowerTranscript.includes('open'))) {
                openGoogle();
            } else if (lowerTranscript.includes('open facebook') || (lowerTranscript.includes('facebook') && lowerTranscript.includes('open'))) {
                openWebsite('https://www.facebook.com', 'Facebook');
            } else if (lowerTranscript.includes('open twitter') || (lowerTranscript.includes('twitter') && lowerTranscript.includes('open'))) {
                openWebsite('https://www.twitter.com', 'Twitter');
            } else if (lowerTranscript.includes('open instagram') || (lowerTranscript.includes('instagram') && lowerTranscript.includes('open'))) {
                openWebsite('https://www.instagram.com', 'Instagram');
            } else if (lowerTranscript.includes('open netflix') || (lowerTranscript.includes('netflix') && lowerTranscript.includes('open'))) {
                openWebsite('https://www.netflix.com', 'Netflix');
            } else if (lowerTranscript.includes('open amazon') || (lowerTranscript.includes('amazon') && lowerTranscript.includes('open'))) {
                openWebsite('https://www.amazon.com', 'Amazon');
            } else {
                // Send to AI with current context
                await aiResponse(transcript);
            }
        } catch (error) {
            console.error('❌ Error handling speech:', error);
            directSpeak("Sorry, I encountered an error processing your request.");
        }
    };

    // Get weather function
    const getWeather = async () => {
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: false
                });
            });

            const apiUrl = `/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
            }

            const data = await response.json();
            setWeather(data);
            return `The current temperature is ${Math.round(data.main.temp)}°C with ${data.weather[0].description}`;
        } catch (error) {
            console.error('Error fetching weather:', error);
            return "Sorry, I couldn't fetch the weather information right now.";
        }
    };

    // Get time function
    const getTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        setCurrentTime(timeString);
        return `The current time is ${timeString}`;
    };

    // Get date function
    const getDate = () => {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return `Today is ${dateString}`;
    };

    // Open YouTube function
    const openYouTube = () => {
        try {
            console.log('🎥 Opening YouTube...');
            window.open('https://www.youtube.com', '_blank');
            directSpeak("Opening YouTube for you!");
        } catch (error) {
            console.error('❌ Error opening YouTube:', error);
            directSpeak("Sorry, I couldn't open YouTube. Please try again.");
        }
    };

    // Open Google function
    const openGoogle = () => {
        try {
            console.log('🔍 Opening Google...');
            window.open('https://www.google.com', '_blank');
            directSpeak("Opening Google for you!");
        } catch (error) {
            console.error('❌ Error opening Google:', error);
            directSpeak("Sorry, I couldn't open Google. Please try again.");
        }
    };

    // Generic website opening function
    const openWebsite = (url, siteName) => {
        try {
            console.log(`🌐 Opening ${siteName}...`);
            window.open(url, '_blank');
            directSpeak(`Opening ${siteName} for you!`);
        } catch (error) {
            console.error(`❌ Error opening ${siteName}:`, error);
            directSpeak(`Sorry, I couldn't open ${siteName}. Please try again.`);
        }
    };

    // Request microphone permission
    const requestPermissionAndStart = async () => {
        try {
            console.log('Requesting microphone permission...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            setPermissionGranted(true);
            setAutoStarted(true);
            console.log('✅ Microphone permission granted');
        } catch (error) {
            console.error('❌ Permission request failed:', error);
            setPermissionGranted(false);
            setAutoStarted(true); // Still show the interface
        }
    };

    // Auto-start when component mounts
    useEffect(() => {
        if (!permissionGranted && !autoStarted) {
            requestPermissionAndStart();
        }
    }, [permissionGranted, autoStarted]);

    // Update time every second
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Toggle welcome message function
    const toggleWelcomeMessage = () => {
        setEnableWelcomeMessage(!enableWelcomeMessage);
        hasSpokenWelcome.current = false; // Reset so it can be spoken again
    };

    // Context value
    const contextValue = {
        recognition: recognition.current,
        startListening,
        stopListening,
        stopSpeaking,
        directSpeak,
        aiResponse,
        openYouTube,
        openGoogle,
        openWebsite,
        isListening,
        isSpeaking,
        weather,
        currentTime,
        permissionGranted,
        autoStarted,
        speechEnabled,
        enableWelcomeMessage,
        toggleWelcomeMessage
    };

    return (
        <datacontext.Provider value={contextValue}>
            {children}
        </datacontext.Provider>
    );
}

export default UserContext;
