import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const resend = new Resend(process.env.RESEND_API_KEY);
const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { phone, imageBase64, mimeType } = await request.json();

    const aiResponse = await anthropic.messages.create({
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
              text: "Du är en expert på antikviteter och auktioner i Sverige. Analysera detta föremål noggrant och ge en professionell värdering på svenska med: 1. Vad är föremålet? 2. Period/ålder 3. Skick (baserat på bilden) 4. Uppskattat marknadsvärde i SEK 5. Motivering till värderingen",
            },
          ],
        },
      ],
    });

    const valuation = aiResponse.content[0].type === "text" ? aiResponse.content[0].text : "";

    await resend.emails.send({
      from: "Westkustauktioner App <onboarding@resend.dev>",
      to: "info@westkustauktioner.se",
      subject: "Ny inlämningsintressent via appen",
      html: `
        <h2>Ny kund vill sälja via Westkustauktioner</h2>
        <p><strong>Telefonnummer:</strong> ${phone}</p>
        <hr/>
        <h3>AI-värdering:</h3>
        <p>${valuation.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p><em>Bilden finns bifogad nedan.</em></p>
        <img src="data:${mimeType};base64,${imageBase64}" style="max-width:500px;border-radius:8px;" />
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
