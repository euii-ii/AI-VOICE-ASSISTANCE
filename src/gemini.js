import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = "AIzaSyB45ZfMWilzqbUWg8rPM-ml64x2hUPzGXI"; // To run this code you need to install the following dependencies:


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
    // Add retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const chatSession = model.startChat({
          generationConfig
        });
        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
      } catch (error) {
        attempts++;
        if (error.message.includes('429') && attempts < maxAttempts) {
          // Wait for exponential backoff (2^attempts seconds)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in Gemini API:", error);
    return "I'm currently experiencing high traffic. Please try again in a few moments.";
  }
}

export default run;