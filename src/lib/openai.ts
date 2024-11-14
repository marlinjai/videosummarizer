import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is set
});

export async function generateSummary(transcript: string): Promise<string> {
  const prompt = `Provide a concise summary of the following video transcript:\n\n${transcript}`;

  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 150,
    temperature: 0.5,
  });

  return response.choices[0].text?.trim() || "";
}
