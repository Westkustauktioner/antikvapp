import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: "Du är en expert på antikviteter och auktioner i Sverige. Analysera detta föremål och svara på svenska med: 1. Vad är det? 2. Ungefärligt år eller period 3. Uppskattat värde i SEK 4. Sälj hos Westkustauktioner? (Ja om värdet överstiger 1000 kr)",
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Något gick fel vid analysen." },
      { status: 500 }
    );
  }
}
