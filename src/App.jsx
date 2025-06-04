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
    enableSpeechSynthesis,
    testSpeech,
    isListening,
    isSpeaking,
    weather,
    currentTime,
    permissionGranted,
    autoStarted,
    speechEnabled
  } = useContext(datacontext);
  const [error, setError] = useState(null);
  const [speakingGifLoaded, setSpeakingGifLoaded] = useState(false);
  const [aiGifLoaded, setAiGifLoaded] = useState(false);

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
    } else if (!isListening && permissionGranted && autoStarted) {
      // Click to start listening when not speaking and not already listening
      console.log('Starting listening...');
      e.preventDefault();
      e.stopPropagation();
      startListening();
    } else {
      console.log('Click conditions not met for starting listening');
    }
  };

  // Force enable speech synthesis on component mount
  useEffect(() => {
    if (enableSpeechSynthesis) {
      enableSpeechSynthesis();
    }
  }, [enableSpeechSynthesis]);

  return (
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
              onClick={testSpeech}
              style={{
                cursor: 'pointer',
                padding: '8px 16px',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                width: '100%',
                maxWidth: '150px',
                marginTop: '10px',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 0 10px rgba(76, 175, 80, 0.3)'
              }}
            >
              Test Speech
            </button>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
              marginTop: '10px',
              marginBottom: '0'
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
            {!speakingGifLoaded ? (
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
                <span style={{ color: '#ff4444' }}>Loading...</span>
              </div>
            ) : (
              <img 
                src={speaking} 
                alt="Listening Animation" 
                style={{ 
                  width: 'clamp(60px, 20vw, 100px)', 
                  height: 'clamp(60px, 20vw, 100px)',
                  margin: '20px auto 0',
                  filter: 'hue-rotate(180deg)'
                }} 
              />
            )}
            <span style={{ 
              color: '#ff4444', 
              display: 'block',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)'
            }}>Listening...</span>
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
  )
}

export default App