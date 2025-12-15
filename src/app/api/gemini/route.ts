import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = req.headers.get('x-gemini-api-key');

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing' }, { status: 401 });
    }

    // ⚠️ 修正重點：
    // 1. 改用 'gemini-1.5-flash-latest' (指向最新穩定版，解決 not found 問題)
    // 2. 如果還是不行，可以試著改回 'gemini-pro' (1.0 版本，最通用)
    const model = 'gemini-1.5-flash-latest';
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // 降低安全設定以避免因為歌詞內容被過度阻擋
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
        ],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();

    // 如果 Google 回傳錯誤，印出詳細訊息以便除錯
    if (data.error) {
      console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
      return NextResponse.json({ error: data.error.message || "Model not supported" }, { status: 400 });
    }
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Server Internal Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}