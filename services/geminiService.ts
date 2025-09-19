
import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, Conflict } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      issueTitle: {
        type: Type.STRING,
        description: 'A brief, descriptive title for the contradiction found, e.g., "Conflicting Deadlines".',
      },
      conflicts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            documentName: {
              type: Type.STRING,
              description: 'The name of the source document for this piece of text.'
            },
            conflictingText: {
              type: Type.STRING,
              description: 'The exact quote from the document that is part of the conflict.'
            }
          },
          required: ["documentName", "conflictingText"],
        },
        description: 'An array containing the specific text snippets from each document that are in conflict.'
      },
      explanation: {
        type: Type.STRING,
        description: 'A detailed but clear explanation of why these parts are contradictory or inconsistent.'
      },
      suggestion: {
        type: Type.STRING,
        description: 'A concise, actionable suggestion on how to resolve the conflict and align the documents.'
      }
    },
    required: ["issueTitle", "conflicts", "explanation", "suggestion"],
  },
};

export const analyzeDocuments = async (files: UploadedFile[]): Promise<Conflict[]> => {
  const fileContents = files.map(file => {
    return `--- DOCUMENT: ${file.name} ---\n${file.content}\n--- END DOCUMENT: ${file.name} ---`;
  }).join('\n\n');

  const prompt = `
    You are an expert document analysis agent. Your task is to carefully review the content of the following documents and identify any contradictions, inconsistencies, or significant overlaps.

    For each issue you find, provide:
    1. A brief, descriptive title for the contradiction found.
    2. A list of the specific conflicting text snippets and their source document names.
    3. A clear explanation of why these snippets are contradictory or problematic.
    4. A concise suggestion for how to resolve the conflict and clarify the documents.

    Here are the documents:

    ${fileContents}

    Analyze the documents and return your findings in the specified JSON format. If no conflicts are found, return an empty array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Conflict[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
