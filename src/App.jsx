import React, { useContext, useState } from 'react'
import "./App.css"
import va from "./assets/ai.png"
import speaking from './assets/speak.gif';
import aigif from "./assets/aiVoice.gif"
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from './context/UserContext';
;

function App() {
  const { startListening, stopListening, isListening, isSpeaking, weather, currentTime } = useContext(datacontext);
  const [error, setError] = useState(null);

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

  return (
    <div className="main">
      <img 
        src={va} 
        alt="AI Voice Assistant" 
        id="AIVoiceAssistant" 
        style={{
          maxWidth: '80%',
          height: 'auto',
          marginBottom: '20px'
        }}
      />
      <span style={{ 
        fontSize: 'clamp(1rem, 4vw, 1.5rem)',
        textAlign: 'center',
        padding: '0 10px'
      }}>I'M YOUR AI VOICE ASSISTANT</span>
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
        {!isListening && !isSpeaking && (
          <button 
            onClick={handleClick}
            style={{ 
              cursor: 'pointer',
              padding: '12px 24px',
              fontSize: 'clamp(0.9rem, 3vw, 1rem)',
              width: '100%',
              maxWidth: '200px',
              marginTop: '10px'
            }}
          >
            Click Here <CiMicrophoneOn />
          </button>
        )}
        {isListening && (
          <div style={{ 
            textAlign: 'center',
            width: '100%'
          }}>
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
            <img 
              src={aigif} 
              alt="Speaking Animation" 
              style={{ 
                width: 'clamp(60px, 20vw, 100px)', 
                height: 'clamp(60px, 20vw, 100px)',
                margin: '20px auto 0'
              }} 
            />
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