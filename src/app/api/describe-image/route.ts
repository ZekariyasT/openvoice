import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        // Prepare content for Anthropic (removing the data:image/xxx;base64, prefix)
        const base64Data = image.split(",")[1];
        const mediaType = image.split(";")[0].split(":")[1];

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: mediaType,
                                    data: base64Data,
                                },
                            },
                            {
                                type: "text",
                                text: "Describe this image in detail for a visually impaired person — include colors, objects, people, text, and overall scene. Provide a coherent narrative that helps them visualize the image.",
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Anthropic API Error:", data);
            return NextResponse.json({ error: data.error?.message || "Failed to process image" }, { status: response.status });
        }

        const description = data.content[0].text;
        return NextResponse.json({ description });
    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
