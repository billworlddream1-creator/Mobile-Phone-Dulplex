
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceInfo } from "../types";

export const getDeviceDiagnostic = async (device: DeviceInfo): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a professional diagnostic analysis for the following mobile device:
        Brand: ${device.brand}
        Model: ${device.model}
        OS: ${device.os} ${device.osVersion}
        Build: ${device.osBuild}
        Battery Health: ${device.batteryHealth}%
        Storage: ${device.storageUsed}GB / ${device.storageTotal}GB
        CPU: ${device.cpu}
        RAM: ${device.ram}
        Primary Account: ${device.associatedEmail}
        
        Provide a concise health summary, potential issues for this specific model and firmware build, and maintenance recommendations. Include security considerations related to account management. Use professional technical language.`,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    return response.text || "Diagnostic analysis unavailable.";
  } catch (error) {
    console.error("Gemini Diagnostic Error:", error);
    return "Error connecting to AI diagnostic engine.";
  }
};

export const generateDeviceBlueprint = async (device: DeviceInfo): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a high-tech, futuristic technical x-ray blueprint of the internal hardware components for a ${device.brand} ${device.model} smartphone. 
            The style should be a professional industrial design diagram, blue and white color scheme on a dark slate background. 
            Label the CPU, Battery, and Camera modules. High detail, 4k resolution aesthetic.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Blueprint Generation Error:", error);
    return null;
  }
};
