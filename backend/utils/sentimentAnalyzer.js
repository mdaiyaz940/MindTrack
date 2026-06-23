//backend/utils/sentimentAnalyzer.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeSentiment = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following text and return ONLY a JSON object with sentiment scores (positive, negative, neutral) between 0 and 1:
    {
      "positive": number,
      "negative": number,
      "neutral": number
    }
    Text: """${text}"""
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();
    
    // Extract JSON from response
    const jsonMatch = analysisText.match(/{[\s\S]*}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { positive: 0, negative: 0, neutral: 0 };
    
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return { positive: 0, negative: 0, neutral: 0 };
  }
};