// Vercel serverless function to handle weather API requests
// This avoids CORS issues by making the API call from the server side

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { lat, lon } = req.query;

    // Validate required parameters
    if (!lat || !lon) {
      res.status(400).json({ 
        error: 'Missing required parameters: lat and lon' 
      });
      return;
    }

    // Validate latitude and longitude ranges
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ 
        error: 'Invalid latitude or longitude values' 
      });
      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({ 
        error: 'Latitude must be between -90 and 90' 
      });
      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({ 
        error: 'Longitude must be between -180 and 180' 
      });
      return;
    }

    // OpenWeather API configuration
    const API_KEY = process.env.OPENWEATHER_API_KEY || '469781dd737b4f00e3bfe9d280ec1ad3';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    console.log('Fetching weather data for coordinates:', { latitude, longitude });

    // Make the API request to OpenWeather
    const weatherResponse = await fetch(weatherUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Voice-Assistant/1.0'
      }
    });

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('OpenWeather API error:', weatherResponse.status, errorText);
      
      if (weatherResponse.status === 401) {
        res.status(500).json({ 
          error: 'Weather service authentication failed' 
        });
        return;
      } else if (weatherResponse.status === 404) {
        res.status(404).json({ 
          error: 'Weather data not found for this location' 
        });
        return;
      } else if (weatherResponse.status === 429) {
        res.status(429).json({ 
          error: 'Weather service rate limit exceeded. Please try again later.' 
        });
        return;
      } else {
        res.status(500).json({ 
          error: `Weather service error: ${weatherResponse.status}` 
        });
        return;
      }
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data retrieved successfully');

    // Validate the response structure
    if (!weatherData.main || !weatherData.weather) {
      res.status(500).json({ 
        error: 'Invalid weather data format received' 
      });
      return;
    }

    // Return the weather data
    res.status(200).json(weatherData);

  } catch (error) {
    console.error('Weather API handler error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      res.status(500).json({ 
        error: 'Failed to connect to weather service' 
      });
    } else {
      res.status(500).json({ 
        error: 'Internal server error while fetching weather data' 
      });
    }
  }
}
