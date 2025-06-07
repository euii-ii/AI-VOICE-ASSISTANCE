// Development server to handle API routes locally
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Weather API route
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat and lon' 
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        error: 'Invalid latitude or longitude values' 
      });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY || '469781dd737b4f00e3bfe9d280ec1ad3';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    console.log('Fetching weather data for coordinates:', { latitude, longitude });

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('OpenWeather API error:', weatherResponse.status, errorText);
      return res.status(500).json({ 
        error: `Weather service error: ${weatherResponse.status}` 
      });
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data retrieved successfully');

    if (!weatherData.main || !weatherData.weather) {
      return res.status(500).json({ 
        error: 'Invalid weather data format received' 
      });
    }

    res.json(weatherData);

  } catch (error) {
    console.error('Weather API handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error while fetching weather data' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
});
