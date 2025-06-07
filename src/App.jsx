import React, { useContext, useState, useEffect } from 'react'
import "./App.css"
import va from "./assets/sphere.gif"
import speaking from './assets/speak.gif';
import aigif from "./assets/aiVoice.gif"
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from './context/UserContext';

function App() {
  const {
    startListening,
    stopListening,
    stopSpeaking,
    directSpeak,
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
  } = useContext(datacontext);
  const [error, setError] = useState(null);
  const [speakingGifLoaded, setSpeakingGifLoaded] = useState(false);
  const [aiGifLoaded, setAiGifLoaded] = useState(false);

  // Clear any cached speech on component mount
  useEffect(() => {
    console.log('🧹 Clearing any cached speech and resetting state');
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Preload GIFs
  useEffect(() => {
    const preloadImage = (src, callback) => {
      const img = new Image();
      img.onload = () => callback(true);
      img.onerror = () => {
        console.error(`Failed to load GIF: ${src}`);
        callback(false);
      };
      img.src = src;
    };

    preloadImage(speaking, setSpeakingGifLoaded);
    preloadImage(aigif, setAiGifLoaded);
  }, []);

  const handleClick = () => {
    try {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } catch (err) {
      setError('Speech recognition not supported in this browser');
      console.error(err);
    }
  };

  // Handle clicking anywhere to stop speaking or start listening
  const handleScreenClick = (e) => {
    console.log('Screen clicked - isSpeaking:', isSpeaking, 'isListening:', isListening, 'permissionGranted:', permissionGranted, 'autoStarted:', autoStarted);

    if (isSpeaking) {
      console.log('Stopping speech...');
      e.preventDefault();
      e.stopPropagation();
      stopSpeaking();
    } else if (isListening) {
      // Click to stop listening when already listening
      console.log('🛑 Stopping listening...');
      e.preventDefault();
      e.stopPropagation();
      stopListening();
    } else if (!isListening && permissionGranted && autoStarted) {
      // Click to start listening when not speaking and not already listening
      console.log('✅ Starting listening...');
      e.preventDefault();
      e.stopPropagation();
      startListening();
    }
  };



  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
          }
        `}
      </style>
      <div className="main" onClick={handleScreenClick} style={{
        cursor: isSpeaking ? 'pointer' : (!isListening && permissionGranted && autoStarted ? 'pointer' : 'default')
      }}>
      <div className="content-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '20px',
        padding: '20px',
        maxWidth: '100vw'
      }}>
        {/* Permission status indicator */}
        {!permissionGranted && !autoStarted && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(255, 165, 0, 0.9)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            zIndex: 1000
          }}>
            Requesting microphone permission...
          </div>
        )}





        <img
          src={va}
          alt="AI Voice Assistant"
          id="AIVoiceAssistant"
          style={{
            width: 'min(350px, 80vw)',
            height: 'min(350px, 80vw)',
            objectFit: 'contain',
            margin: '0 auto'
          }}
        />

        {/* Show manual button only if auto-start hasn't happened or permission denied */}
        {(!autoStarted || !permissionGranted) && (
          <button
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              padding: '15px 30px',
              fontSize: 'min(1.3rem, 5vw)',
              width: 'min(250px, 75vw)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {permissionGranted ? 'Start Listening' : 'Allow Microphone'} <CiMicrophoneOn size={20} />
          </button>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '10px',
        width: '90%',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {weather && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            marginTop: '10px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <p style={{ 
              color: '#fff', 
              margin: 0,
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>
              Temperature: {Math.round(weather.main.temp)}°C
              <br />
              Weather: {weather.weather[0].description}
            </p>
          </div>
        )}
        {currentTime && (
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <p style={{ 
              color: '#fff', 
              margin: 0,
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>
              Current Time: {currentTime}
            </p>
          </div>
        )}
        {!isListening && !isSpeaking && autoStarted && permissionGranted && (
          <div style={{ textAlign: 'center', width: '100%' }}>
            {/* Welcome message */}
            <div style={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              padding: '15px',
              borderRadius: '15px',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '350px',
              margin: '0 auto 20px auto'
            }}>
              <p style={{
                color: '#4CAF50',
                margin: 0,
                fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                fontWeight: '500'
              }}>
                👋 Hello! I'm your AI voice assistant.<br/>
                I'm ready to help you. Double-tap or click anywhere to start listening.
              </p>
            </div>
            <button
              onClick={handleClick}
              style={{
                cursor: 'pointer',
                padding: '12px 24px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                width: '100%',
                maxWidth: '200px',
                marginTop: '10px',
                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '25px',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
              }}
            >
              Start Listening <CiMicrophoneOn />
            </button>
            <button
              onClick={() => {
                console.log('💬 Testing speech');
                directSpeak("Hello! I am your AI assistant. Can you hear me?");
              }}
              style={{
                cursor: 'pointer',
                padding: '8px 16px',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                width: '100%',
                maxWidth: '150px',
                marginTop: '10px',
                background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 0 10px rgba(156, 39, 176, 0.3)'
              }}
            >
              💬 Test Speech
            </button>
            <button
              onClick={toggleWelcomeMessage}
              style={{
                cursor: 'pointer',
                padding: '8px 16px',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                width: '100%',
                maxWidth: '150px',
                marginTop: '10px',
                background: enableWelcomeMessage
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #757575 0%, #424242 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: enableWelcomeMessage
                  ? '0 0 10px rgba(76, 175, 80, 0.3)'
                  : '0 0 10px rgba(117, 117, 117, 0.3)'
              }}
            >
              {enableWelcomeMessage ? '🔊' : '🔇'} Welcome Message
            </button>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              justifyContent: 'center',
              marginTop: '15px',
              maxWidth: '300px'
            }}>
              <button
                onClick={openYouTube}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                  background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  boxShadow: '0 0 8px rgba(255, 0, 0, 0.3)'
                }}
              >
                📺 YouTube
              </button>
              <button
                onClick={openGoogle}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                  background: 'linear-gradient(135deg, #4285F4 0%, #1976D2 100%)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  boxShadow: '0 0 8px rgba(66, 133, 244, 0.3)'
                }}
              >
                🔍 Google
              </button>
              <button
                onClick={() => openWebsite('https://www.netflix.com', 'Netflix')}
                style={{
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                  background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  boxShadow: '0 0 8px rgba(229, 9, 20, 0.3)'
                }}
              >
                🎬 Netflix
              </button>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
              marginTop: '15px',
              marginBottom: '5px',
              textAlign: 'center'
            }}>
              Say: "Open YouTube", "Open Google", "Open Netflix", etc.
            </p>
            <p style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
              marginTop: '5px',
              marginBottom: '0',
              textAlign: 'center'
            }}>
              Or double-tap/click anywhere to start listening
            </p>
          </div>
        )}
        {isListening && (
          <div style={{
            textAlign: 'center',
            width: '100%'
          }}>
            {/* Prominent listening indicator */}
            <div style={{
              backgroundColor: 'rgba(255, 68, 68, 0.1)',
              border: '2px solid rgba(255, 68, 68, 0.5)',
              padding: '20px',
              borderRadius: '20px',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '350px',
              margin: '0 auto 20px auto',
              animation: 'pulse 2s infinite'
            }}>
              <p style={{
                color: '#ff4444',
                margin: 0,
                fontSize: 'clamp(1rem, 4vw, 1.3rem)',
                fontWeight: 'bold'
              }}>
                🎤 I'm Listening...
              </p>
              <p style={{
                color: 'rgba(255, 68, 68, 0.8)',
                margin: '5px 0 0 0',
                fontSize: 'clamp(0.8rem, 3vw, 1rem)'
              }}>
                Speak now! Ask me anything.
              </p>
            </div>
            {!speakingGifLoaded ? (
              <div style={{
                width: 'clamp(60px, 20vw, 100px)',
                height: 'clamp(60px, 20vw, 100px)',
                margin: '20px auto 0',
                background: 'rgba(255, 68, 68, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 68, 68, 0.5)'
              }}>
                <span style={{ color: '#ff4444', fontWeight: 'bold' }}>🎤</span>
              </div>
            ) : (
              <img
                src={speaking}
                alt="Listening Animation"
                style={{
                  width: 'clamp(60px, 20vw, 100px)',
                  height: 'clamp(60px, 20vw, 100px)',
                  margin: '20px auto 0',
                  filter: 'hue-rotate(180deg)',
                  border: '2px solid rgba(255, 68, 68, 0.5)',
                  borderRadius: '50%'
                }}
              />
            )}
            <button
              onClick={() => {
                console.log('🛑 Stop listening button clicked');
                stopListening();
              }}
              style={{
                cursor: 'pointer',
                padding: '10px 20px',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                marginTop: '15px',
                background: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 0 15px rgba(255, 68, 68, 0.3)'
              }}
            >
              🛑 Stop Listening
            </button>
          </div>
        )}
        {isSpeaking && (
          <div style={{ 
            textAlign: 'center',
            width: '100%'
          }}>
            {!aiGifLoaded ? (
              <div style={{
                width: 'clamp(60px, 20vw, 100px)',
                height: 'clamp(60px, 20vw, 100px)',
                margin: '20px auto 0',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#4CAF50' }}>Loading...</span>
              </div>
            ) : (
              <img 
                src={aigif} 
                alt="Speaking Animation" 
                style={{ 
                  width: 'clamp(60px, 20vw, 100px)', 
                  height: 'clamp(60px, 20vw, 100px)',
                  margin: '20px auto 0'
                }} 
              />
            )}
            <span style={{ 
              color: '#4CAF50', 
              display: 'block',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>Speaking...</span>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default App