"use client";
import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_TOKEN;
const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

async function generateResponse(transcription) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Respond to the inputs with an interesting question: "${transcription}"` }],
      max_tokens: 50,
    });
    console.log("OpenAI response:", response.choices[0].message.content.trim());
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI error:", error);
    return null;
  }
}

async function textToSpeech(responseText) {
  if (typeof responseText !== 'string') {
    console.error("Invalid responseText, expected a string:", responseText);
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_TOKEN;
  const ttsUrl = "https://api.openai.com/v1/audio/speech";

  try {
    const response = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "nova",
        input: responseText
      })
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      
      // Create a URL for the audio blob and play it
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      console.log("Audio is playing...");
    } else {
      const errorData = await response.json();
      console.error("Error generating speech:", errorData);
    }
  } catch (error) {
    console.error("Error generating TTS:", error);
  }
}

export { generateResponse, textToSpeech };
