import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Log if API key exists (but not the actual key)
console.log("API Key exists:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    console.log("Attempting to generate prompt with OpenAI...");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a thoughtful prompt generator. Generate a single, reflective question that starts with 'What's one thing...'. The question should be personal, introspective, and encourage daily reflection. Keep it concise and impactful.",
          },
          {
            role: "user",
            content: "Generate a new prompt question.",
          },
        ],
        temperature: 0.8,
        max_tokens: 50,
      });

      const prompt =
        completion.choices[0]?.message?.content ||
        "What's one thing you want to do today?";

      console.log("Successfully generated prompt:", prompt);
      return NextResponse.json({ prompt });
    } catch (openaiError) {
      console.error("OpenAI API Error:", openaiError);
      return NextResponse.json(
        {
          error: `OpenAI API Error: ${
            openaiError instanceof Error ? openaiError.message : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Detailed error in generate-prompt:", error);
    return NextResponse.json(
      {
        error: "Failed to generate prompt",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
