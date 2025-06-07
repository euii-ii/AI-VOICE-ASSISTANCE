# Deployment Guide for AI Voice Assistant

## Overview
This guide explains how to deploy the AI Voice Assistant to Vercel with proper API handling to avoid CORS issues.

## Architecture Changes

### Backend API Routes
- Created `/api/weather.js` - Vercel serverless function to handle weather API calls
- This eliminates CORS issues by making API calls server-side
- Supports both development and production environments

### Environment Variables
Set these environment variables in your Vercel dashboard:

```
OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Deployment Steps

### 1. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### 2. Environment Variables Setup
In Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add `OPENWEATHER_API_KEY` with your OpenWeather API key
- Add `VITE_GEMINI_API_KEY` with your Google Gemini API key

### 3. API Key Setup
Get your API keys from:
- OpenWeather: https://openweathermap.org/api
- Google Gemini: https://makersuite.google.com/app/apikey

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file:
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

This will start:
- Vite development server on port 5173/5174
- API development server on port 3001
- Automatic proxy configuration

## API Endpoints

### Weather API
- **Endpoint**: `/api/weather`
- **Method**: GET
- **Parameters**: 
  - `lat` (required): Latitude
  - `lon` (required): Longitude
- **Response**: OpenWeather API data

## CORS Configuration

### Production (Vercel)
- CORS headers configured in `vercel.json`
- Serverless functions handle API calls
- No client-side CORS issues

### Development
- Vite proxy configuration in `vite.config.js`
- Development API server with CORS enabled
- Seamless local development experience

## Troubleshooting

### Weather API Not Working
1. Check environment variables are set correctly
2. Verify API key is valid
3. Check browser console for error messages
4. Ensure location permissions are granted

### Speech Recognition Issues
1. Use Chrome or Edge browser
2. Ensure HTTPS connection (required for speech API)
3. Grant microphone permissions
4. Check browser console for errors

### Deployment Issues
1. Verify all environment variables are set in Vercel
2. Check Vercel function logs
3. Ensure API keys are valid and have proper permissions

## Security Notes

- API keys are stored as environment variables
- Client-side code uses environment variables for Gemini API
- Weather API calls are made server-side to protect API key
- CORS properly configured for security
