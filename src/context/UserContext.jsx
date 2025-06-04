import React, { createContext, useState, useEffect, useRef } from 'react'
import run from '../gemini';

// Create context with initial value
export const datacontext = createContext({
    recognition: null,
    speak: () => {},
    startListening: () => {},
    stopListening: () => {},
    isListening: false,
    isSpeaking: false,
    weather: null,
    currentTime: ''
});

function UserContext({children}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const intervalRef = useRef();
    const speechQueue = useRef([]);
    const isSpeechQueued = useRef(false);

    // Add voice loading state and ref
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const selectedVoice = useRef(null);

    // Initialize speech recognition with error handling
    const initializeRecognition = () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                throw new Error('Speech recognition not supported');
            }
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'en-US';
            return recognition;
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            return null;
        }
    };

    const recognition = useRef(initializeRecognition()).current;

    useEffect(() => {
        if (!window.speechSynthesis) {
            console.error('Speech synthesis not supported');
            return;
        }

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const femaleVoice = voices.find(voice => 
                    voice.lang === 'en-US' && voice.name.includes('Female')
                ) || voices.find(voice => 
                    voice.lang.startsWith('en')
                ) || voices[0];
                
                selectedVoice.current = femaleVoice;
                setVoicesLoaded(true);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const processSpeechQueue = () => {
        if (speechQueue.current.length === 0 || isSpeechQueued.current || !voicesLoaded) {
            return;
        }

        isSpeechQueued.current = true;
        const utterance = speechQueue.current[0];

        const startSpeaking = () => {
            try {
                window.speechSynthesis.cancel(); // Cancel any ongoing speech
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, 100); // Small delay before speaking
            } catch (error) {
                console.error('Speech synthesis error:', error);
                isSpeechQueued.current = false;
            }
        };

        utterance.onend = () => {
            speechQueue.current.shift();
            isSpeechQueued.current = false;
            if (speechQueue.current.length === 0) {
                setIsSpeaking(false);
            } else {
                setTimeout(processSpeechQueue, 250); // Add delay between chunks
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event);
            isSpeechQueued.current = false;
            setTimeout(() => {
                if (speechQueue.current.length > 0) {
                    processSpeechQueue();
                }
            }, 1000);
        };

        startSpeaking();
    };

    function speak(text) {
        if (!window.speechSynthesis || !voicesLoaded) return;

        window.speechSynthesis.cancel();
        speechQueue.current = [];
        isSpeechQueued.current = false;

        const chunks = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        
        chunks.forEach((chunk) => {
            const utterance = new SpeechSynthesisUtterance(chunk.trim());
            
            if (selectedVoice.current) {
                utterance.voice = selectedVoice.current;
            }

            utterance.volume = 1;
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            utterance.lang = 'en-US';

            speechQueue.current.push(utterance);
        });

        setIsSpeaking(true);
        setTimeout(processSpeechQueue, 100);
    }
    async function aiResponse(prompt){
        let text = await run(prompt);
        console.log(text);
        speak(text); // Speak the AI response
    }

    const getWeather = async () => {
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            const API_KEY = '469781dd737b4f00e3bfe9d280ec1ad3';
            // Use cors-anywhere or OpenWeather's HTTPS endpoint
            const response = await fetch(
                `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}&units=metric`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': 'http://localhost:5173',
                        'Accept': 'application/json'
                    },
                    mode: 'cors' // Explicitly set CORS mode
                }
            );

            if (!response.ok) {
                throw new Error(`Weather API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Weather data:', data);
            
            if (!data.main || !data.weather) {
                throw new Error('Invalid weather data format');
            }

            setWeather(data);
            return `The current temperature is ${Math.round(data.main.temp)}°C with ${data.weather[0].description}`;
        } catch (error) {
            console.error('Error fetching weather:', error);
            // More descriptive error message
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                return "Sorry, there was a network error. Please check your internet connection.";
            }
            return "Sorry, I couldn't fetch the weather information. CORS error occurred.";
        }
    };

    const getTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        setCurrentTime(timeString);
        return `The current time is ${timeString}`;
    };

    recognition.onresult = async (e) => {
        let currentIndex = e.resultIndex;
        let transcript = e.results[currentIndex][0].transcript;
        console.log("User said:", transcript);
        await handleSpeech(transcript); // Call handleSpeech first
        if (!transcript.toLowerCase().includes('weather') && !transcript.toLowerCase().includes('time')) {
            aiResponse(transcript); // Only call aiResponse if it's not a weather or time command
        }
    };

    const handleSpeech = async (transcript) => {
        const lowerTranscript = transcript.toLowerCase();
        
        if (lowerTranscript.includes('weather')) {
            const weatherInfo = await getWeather();
            speak(weatherInfo);
            return true;
        } else if (lowerTranscript.includes('time')) {
            const timeInfo = getTime();
            speak(timeInfo);
            return true;
        }
        return false;
    };

    const startListening = () => {
        if (!recognition) {
            console.error('Speech recognition not initialized');
            return;
        }
        try {
            if (!isListening) {
                recognition.start();
                setIsListening(true);
            }
        } catch (error) {
            console.error('Error starting recognition:', error);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        try {
            recognition.stop();
            setIsListening(false);
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (isSpeaking && !window.speechSynthesis.speaking) {
                processSpeechQueue();
            }
        }, 250);

        return () => {
            clearInterval(interval);
            window.speechSynthesis.cancel();
        };
    }, [isSpeaking]);

    // Move value object outside of return
    const contextValue = {
        recognition,
        speak,
        startListening,
        stopListening,
        isListening,
        isSpeaking,
        weather,
        currentTime
    };

    return (
        <datacontext.Provider value={contextValue}>
            {children}
        </datacontext.Provider>
    );
}

export default UserContext;