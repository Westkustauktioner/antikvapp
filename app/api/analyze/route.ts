import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mimeType } = await request.json();

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 256,
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
              text: "Du är en expert på antikviteter och auktioner i Sverige. Uppskatta marknadsvärdet på detta föremål i SEK. Om värdet överstiger 400 kr, svara endast med ordet JA. Om värdet understiger 400 kr, svara endast med ordet NEJ. Svara bara med JA eller NEJ, ingenting annat.",
            },
          ],
        },
      ],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    const text = raw.toUpperCase().includes("JA") ? "JA" : "NEJ";
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
