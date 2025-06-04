import React, { createContext, useState, useEffect, useRef } from 'react'
import run from '../gemini';

// Create context with initial value
export const datacontext = createContext({
    recognition: null,
    speak: () => {},
    startListening: () => {},
    stopListening: () => {},
    stopSpeaking: () => {},
    toggleContinuousListening: () => {},
    enableSpeechSynthesis: () => {},
    isListening: false,
    isSpeaking: false,
    weather: null,
    currentTime: '',
    permissionGranted: false,
    autoStarted: false,
    isContinuousListening: true,
    speechEnabled: false
});

function UserContext({children}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [weather, setWeather] = useState(null);
    const [currentTime, setCurrentTime] = useState('');
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [autoStarted, setAutoStarted] = useState(false);
    const [isContinuousListening, setIsContinuousListening] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useState(false);
    const intervalRef = useRef();
    const speechQueue = useRef([]);
    const isSpeechQueued = useRef(false);
    const continuousListening = useRef(false);
    const restartTimeout = useRef(null);
    const speechInitialized = useRef(false);
    const currentUtterance = useRef(null);
    const speechInterrupted = useRef(false);
    const recognitionTimeout = useRef(null);

    // Toggle continuous listening
    const toggleContinuousListening = () => {
        const newValue = !isContinuousListening;
        setIsContinuousListening(newValue);
        continuousListening.current = newValue;

        if (!newValue && isListening) {
            // If disabling continuous listening and currently listening, stop
            stopListening();
        } else if (newValue && !isListening && !isSpeaking && permissionGranted) {
            // If enabling continuous listening and not currently listening, start
            setTimeout(() => startListening(), 100);
        }
    };

    // Add voice loading state and ref
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    const selectedVoice = useRef(null);

    // Speech recognition event handlers
    const handleRecognitionResult = async (e) => {
        let currentIndex = e.resultIndex;
        let transcript = e.results[currentIndex][0].transcript;

        // Clear timeout when speech is detected
        if (recognitionTimeout.current) {
            clearTimeout(recognitionTimeout.current);
            recognitionTimeout.current = null;
        }

        // Only process final results to avoid multiple triggers
        if (e.results[currentIndex].isFinal) {
            console.log("User said:", transcript);

            // Temporarily pause listening while processing to avoid feedback
            if (isListening) {
                recognition.stop();
                setIsListening(false);
            }

            await handleSpeech(transcript); // Call handleSpeech first
            if (!transcript.toLowerCase().includes('weather') && !transcript.toLowerCase().includes('time')) {
                aiResponse(transcript); // Only call aiResponse if it's not a weather or time command
            }
        }
    };

    const handleRecognitionEnd = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
        // No auto-restart listening - user needs to double-tap/click to start listening again
    };

    const handleRecognitionError = (event) => {
        console.error('Speech recognition error:', event.error);
        // All errors stop listening - no auto-restart, user needs to double-tap/click to start again
        setIsListening(false);
        console.log('Speech recognition stopped:', event.error);
    };

    // Initialize speech recognition with error handling
    const initializeRecognition = () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                throw new Error('Speech recognition not supported');
            }
            const recognition = new SpeechRecognition();
            recognition.continuous = true; // Enable continuous listening
            recognition.interimResults = true; // Get interim results
            recognition.lang = 'en-US';
            recognition.maxAlternatives = 1;

            // Set timeouts to handle no-speech scenarios
            if ('webkitSpeechRecognition' in window) {
                // Chrome/Edge specific settings
                recognition.serviceURI = 'wss://www.google.com/speech-api/v2/recognize';
            }

            // Attach event handlers immediately
            recognition.onresult = handleRecognitionResult;
            recognition.onend = handleRecognitionEnd;
            recognition.onerror = handleRecognitionError;

            return recognition;
        } catch (error) {
            console.error('Error initializing speech recognition:', error);
            return null;
        }
    };

    const recognition = useRef(initializeRecognition()).current;

    // Debounced restart function to prevent rapid restart attempts
    const debouncedStartListening = (delay = 0) => {
        if (restartTimeout.current) {
            clearTimeout(restartTimeout.current);
        }

        restartTimeout.current = setTimeout(() => {
            startListening();
            restartTimeout.current = null;
        }, delay);
    };

    const startListening = () => {
        console.log('startListening called - recognition:', !!recognition, 'isListening:', isListening);

        if (!recognition) {
            console.error('Speech recognition not initialized');
            return;
        }

        // Check if recognition is already running
        if (isListening) {
            console.log('Recognition already running');
            return;
        }

        // Clear any existing timeout
        if (recognitionTimeout.current) {
            clearTimeout(recognitionTimeout.current);
            recognitionTimeout.current = null;
        }

        try {
            console.log('Attempting to start speech recognition...');

            // Additional check for recognition state
            if (recognition.state === 'listening') {
                console.log('Recognition state is already listening');
                setIsListening(true);
                return;
            }

            recognition.start();
            setIsListening(true);
            console.log('Speech recognition started successfully');

            // Set a timeout to stop recognition if no speech is detected (no auto-restart)
            recognitionTimeout.current = setTimeout(() => {
                if (isListening) {
                    console.log('Recognition timeout, stopping...');
                    try {
                        recognition.stop();
                    } catch (e) {
                        console.log('Error stopping recognition on timeout:', e);
                    }
                }
            }, 10000); // 10 second timeout

        } catch (error) {
            console.error('Error starting recognition:', error);
            setIsListening(false);

            // If recognition is already started, just update state
            if (error.name === 'InvalidStateError' && error.message.includes('already started')) {
                console.log('Recognition was already started, updating state');
                setIsListening(true);
            }
        }
    };

    const stopListening = () => {
        try {
            // Clear recognition timeout
            if (recognitionTimeout.current) {
                clearTimeout(recognitionTimeout.current);
                recognitionTimeout.current = null;
            }

            recognition.stop();
            setIsListening(false);
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    };

    // Initialize speech synthesis with user interaction
    const initializeSpeechSynthesis = () => {
        if (speechInitialized.current) {
            console.log('Speech synthesis already initialized');
            return;
        }

        try {
            console.log('Initializing speech synthesis...');
            // Force enable speech synthesis immediately
            speechInitialized.current = true;
            setSpeechEnabled(true);
            console.log('Speech synthesis force-enabled');

            // Create a silent utterance to test and initialize
            const testUtterance = new SpeechSynthesisUtterance(' ');
            testUtterance.volume = 0.01; // Very low volume instead of 0
            testUtterance.rate = 10;

            // Add event listeners to test utterance
            testUtterance.onstart = () => {
                console.log('Test utterance started - speech synthesis is working');
            };

            testUtterance.onend = () => {
                console.log('Test utterance ended - speech synthesis initialized');
            };

            testUtterance.onerror = (event) => {
                console.log('Test utterance error:', event.error);
            };

            // Speak the test utterance
            window.speechSynthesis.speak(testUtterance);

        } catch (error) {
            console.error('Failed to initialize speech synthesis:', error);
            // Still enable it even if there's an error
            speechInitialized.current = true;
            setSpeechEnabled(true);
        }
    };

    // Enable speech synthesis through user interaction
    const enableSpeechSynthesis = () => {
        initializeSpeechSynthesis();
    };

    // Test speech synthesis function
    const testSpeech = () => {
        console.log('Testing speech synthesis...');
        speak("This is a test of the speech synthesis system.");
    };

    // Request microphone permission and auto-start
    const requestPermissionAndStart = async () => {
        try {
            // Initialize speech synthesis first
            initializeSpeechSynthesis();

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
            setPermissionGranted(true);

            // Enable speech synthesis immediately
            setSpeechEnabled(true);
            speechInitialized.current = true;

            // Auto-start with welcome message only (no continuous listening)
            setTimeout(() => {
                setAutoStarted(true);
                // Delay the welcome message to ensure speech synthesis is ready
                setTimeout(() => {
                    console.log('Attempting to speak welcome message...');
                    speak("Hello! I'm your AI voice assistant. I'm ready to help you. Double-tap or click anywhere to start listening.");
                }, 1000); // Increased delay to ensure everything is ready
            }, 1000);
        } catch (error) {
            console.error('Microphone permission denied:', error);
            setPermissionGranted(false);
        }
    };

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

        // Force enable speech when voices are loaded
        if (voicesLoaded && !speechInitialized.current) {
            console.log('Voices loaded, force enabling speech synthesis');
            speechInitialized.current = true;
            setSpeechEnabled(true);
        }

        // Auto-start when voices are loaded and permission not yet requested
        if (voicesLoaded && !permissionGranted && !autoStarted) {
            requestPermissionAndStart();
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [voicesLoaded, permissionGranted, autoStarted]);

    const processSpeechQueue = () => {
        if (speechQueue.current.length === 0 || isSpeechQueued.current) {
            return;
        }

        // Clear any interrupted state
        speechInterrupted.current = false;
        isSpeechQueued.current = true;
        const utterance = speechQueue.current[0];
        currentUtterance.current = utterance;

        const startSpeaking = () => {
            try {
                console.log('Starting speech synthesis for:', utterance.text);

                // Ensure speech synthesis is ready
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                }

                // Force enable speech if not already enabled
                if (!speechInitialized.current) {
                    speechInitialized.current = true;
                    setSpeechEnabled(true);
                }

                // Just speak the utterance directly
                window.speechSynthesis.speak(utterance);
                console.log('Speech synthesis started');
            } catch (error) {
                console.error('Speech synthesis error:', error);
                isSpeechQueued.current = false;
                setIsSpeaking(false);
            }
        };

        utterance.onend = () => {
            // Only process if this utterance wasn't interrupted
            if (!speechInterrupted.current && currentUtterance.current === utterance) {
                speechQueue.current.shift();
                isSpeechQueued.current = false;
                currentUtterance.current = null;

                if (speechQueue.current.length === 0) {
                    setIsSpeaking(false);
                    // No auto-restart listening - user needs to double-tap/click to start listening again
                } else {
                    setTimeout(processSpeechQueue, 250); // Add delay between chunks
                }
            } else {
                console.log('Speech utterance ended but was interrupted, skipping queue processing');
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech error:', event.error, event);
            isSpeechQueued.current = false;
            currentUtterance.current = null;

            if (event.error === 'interrupted') {
                // Speech was interrupted - this is normal behavior
                console.log('Speech interrupted, marking as interrupted and continuing');
                speechInterrupted.current = true;

                // Remove the interrupted utterance from queue
                if (speechQueue.current.length > 0) {
                    speechQueue.current.shift();
                }

                // Continue with next utterance if available
                if (speechQueue.current.length > 0) {
                    setTimeout(() => {
                        processSpeechQueue();
                    }, 100);
                } else {
                    setIsSpeaking(false);
                    // Restart listening after interruption
                    if (continuousListening.current && permissionGranted && !isListening) {
                        debouncedStartListening(200);
                    }
                }
            } else if (event.error === 'not-allowed') {
                // Speech synthesis blocked - force enable and continue
                console.log('Speech blocked, force enabling and continuing');
                speechInitialized.current = true;
                setSpeechEnabled(true);

                // Continue with next utterance if available
                if (speechQueue.current.length > 0) {
                    setTimeout(() => {
                        processSpeechQueue();
                    }, 100);
                } else {
                    setIsSpeaking(false);
                    // Restart listening after speech issue
                    if (continuousListening.current && permissionGranted && !isListening) {
                        debouncedStartListening(200);
                    }
                }
            } else {
                // Other errors - retry after delay
                setTimeout(() => {
                    if (speechQueue.current.length > 0) {
                        processSpeechQueue();
                    } else {
                        setIsSpeaking(false);
                    }
                }, 1000);
            }
        };

        startSpeaking();
    };

    function speak(text) {
        console.log('Speak function called with text:', text);

        if (!window.speechSynthesis) {
            console.log('Speech synthesis not available');
            return;
        }

        // Force enable speech synthesis if not already enabled
        if (!speechInitialized.current) {
            console.log('Force enabling speech synthesis in speak function');
            speechInitialized.current = true;
            setSpeechEnabled(true);
        }

        // Properly cancel any ongoing speech and mark as interrupted
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            console.log('Canceling existing speech');
            speechInterrupted.current = true;
            currentUtterance.current = null;
            window.speechSynthesis.cancel();

            // Wait a moment for cancellation to complete
            setTimeout(() => {
                speechInterrupted.current = false;
            }, 50);
        }

        speechQueue.current = [];
        isSpeechQueued.current = false;

        const chunks = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        console.log('Text chunks:', chunks);

        chunks.forEach((chunk) => {
            const utterance = new SpeechSynthesisUtterance(chunk.trim());

            if (selectedVoice.current) {
                utterance.voice = selectedVoice.current;
                console.log('Using voice:', selectedVoice.current.name);
            } else {
                console.log('No voice selected, using default');
            }

            utterance.volume = 1;
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            utterance.lang = 'en-US';

            speechQueue.current.push(utterance);
        });

        console.log('Setting isSpeaking to true and starting speech queue');
        setIsSpeaking(true);
        processSpeechQueue();
    }

    // Function to stop speaking immediately
    const stopSpeaking = () => {
        // Mark as interrupted before canceling
        speechInterrupted.current = true;
        currentUtterance.current = null;

        window.speechSynthesis.cancel();
        speechQueue.current = [];
        isSpeechQueued.current = false;
        setIsSpeaking(false);

        // Reset interrupted state after a brief delay
        setTimeout(() => {
            speechInterrupted.current = false;
        }, 100);

        // No auto-restart listening - user needs to double-tap/click to start listening again
    };

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

    // Monitor and maintain continuous listening and speech state
    useEffect(() => {
        const interval = setInterval(() => {
            // Check if speech synthesis is stuck or interrupted
            if (isSpeaking && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                console.log('Speech synthesis appears to be stuck, attempting recovery');

                // Check if we have queued speech
                if (speechQueue.current.length > 0) {
                    // Reset speech state and try to continue
                    isSpeechQueued.current = false;
                    processSpeechQueue();
                } else {
                    // No more speech in queue, stop speaking state
                    setIsSpeaking(false);
                    currentUtterance.current = null;
                    speechInterrupted.current = false;
                }
            }

            // Update current time every second
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
        }, 1000); // Update time every second

        return () => {
            clearInterval(interval);
            // Properly cleanup speech synthesis
            speechInterrupted.current = true;
            currentUtterance.current = null;
            speechQueue.current = [];
            isSpeechQueued.current = false;
            window.speechSynthesis.cancel();
        };
    }, []);

    // Move value object outside of return
    const contextValue = {
        recognition,
        speak,
        startListening,
        stopListening,
        stopSpeaking,
        toggleContinuousListening,
        enableSpeechSynthesis,
        testSpeech,
        isListening,
        isSpeaking,
        weather,
        currentTime,
        permissionGranted,
        autoStarted,
        isContinuousListening,
        speechEnabled
    };

    return (
        <datacontext.Provider value={contextValue}>
            {children}
        </datacontext.Provider>
    );
}

export default UserContext;