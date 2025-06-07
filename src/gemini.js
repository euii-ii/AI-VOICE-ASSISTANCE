import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for API key, fallback to hardcoded for development
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB45ZfMWilzqbUWg8rPM-ml64x2hUPzGXI";


const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain"
};

async function run(prompt) {
  try {
    if (!prompt || prompt.trim().length === 0) {
      return "I didn't receive any input. Could you please try again?";
    }

    // Add retry logic
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        console.log(`Attempt ${attempts + 1} to call Gemini API`);

        const chatSession = model.startChat({
          generationConfig
        });

        const result = await chatSession.sendMessage(prompt);
        const responseText = result.response.text();

        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from AI');
        }

        console.log('Gemini API response received successfully');
        return responseText;

      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error.message);

        if (error.message.includes('429') && attempts < maxAttempts) {
          // Rate limit - wait with exponential backoff
          const delay = Math.pow(2, attempts) * 1000;
          console.log(`Rate limited, waiting ${delay}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          return "I've reached my usage limit for now. Please try again later.";
        } else if (attempts >= maxAttempts) {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error("Error in Gemini API:", error);

    if (error.message.includes('network') || error.message.includes('fetch')) {
      return "I'm having trouble connecting to my AI service. Please check your internet connection and try again.";
    } else if (error.message.includes('API key')) {
      return "There's an issue with my configuration. Please contact support.";
    } else {
      return "I'm currently experiencing technical difficulties. Please try again in a few moments.";
    }
  }
}

export default run;