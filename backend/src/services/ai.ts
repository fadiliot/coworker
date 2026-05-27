import { OpenAI } from 'openai';
import { GoogleGenAI } from '@google/genai';

const aiClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Assuming API Key is set in environment for Google Gen AI
const gemini = new GoogleGenAI({});

export interface ParsedLead {
  name: string | null;
  company: string | null;
  intent: string | null;
  suggestedAction: 'DRAFT_RESPONSE' | 'SCHEDULE_FOLLOW_UP' | 'UPDATE_CRM' | 'IGNORE';
}

export const analyzeEmailWithAI = async (subject: string, body: string): Promise<ParsedLead> => {
  const prompt = `
    Analyze the following email from a potential lead.
    Subject: ${subject}
    Body: ${body}

    Extract the lead's name, company, and their intent. Also suggest an action: DRAFT_RESPONSE, SCHEDULE_FOLLOW_UP, UPDATE_CRM, or IGNORE.
    Format your response as strict JSON:
    {
      "name": "extracted name or null",
      "company": "extracted company or null",
      "intent": "brief description of what they want or null",
      "suggestedAction": "ONE_OF_THE_ALLOWED_ACTIONS"
    }
  `;

  try {
    // Try Gemini First (as requested to integrate both)
    const response = await gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    const text = response.text || '{}';
    // Clean up markdown json blocks if present
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText) as ParsedLead;
  } catch (error) {
    console.warn("Gemini parsing failed, falling back to Groq/Qwen", error);
    try {
      const response = await aiClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content || '{}') as ParsedLead;
    } catch (groqError) {
      console.error("Groq fallback failed", groqError);
      throw new Error("Failed to parse lead with AI");
    }
  }
};

export const generateDraftResponse = async (leadInfo: ParsedLead, emailBody: string): Promise<string> => {
  const prompt = `
    Write a professional and concise response to this email from ${leadInfo.name || 'a lead'} at ${leadInfo.company || 'their company'}.
    Their intent: ${leadInfo.intent}.
    Original Email: ${emailBody}
  `;
  try {
     const response = await aiClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content || 'Failed to generate response.';
  } catch(error) {
    console.error("Failed to generate draft", error);
    return 'Draft generation failed due to AI service error.';
  }
}
