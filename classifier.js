export async function classifyActivity(imageUri, domContext, apiKey) {
  if (!apiKey) {
    return { category: "Uncategorized", summary: "No valid API Key provided." };
  }

  const activeKey = apiKey;

  // ...rest of your function stays the same, just remove the hardcoded string

  if (!activeKey || activeKey === "YOUR_GROQ_API_KEY_HERE") {
    return { category: "Uncategorized", summary: "No valid API Key provided." };
  }

  const prompt = `Analyze this browser screenshot and metadata. Return ONLY a valid JSON object with no extra text or markdown:
{
  "category": "One of [Coding, Research, Social Media, Shopping, Entertainment, Productivity, Communication]",
  "summary": "Start with the website name, then a concise 1-sentence description. (e.g., 'YouTube: Watching a video')"
}

Page Title: ${domContext.title || "Unknown"}
Page URL: ${domContext.url || "Unknown"}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${activeKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUri } }
            ]
          }
        ],
        temperature: 0.1
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("[Visual AI Agent] Groq API Error:", data.error.message);
      return { category: "Error", summary: data.error.message };
    }

    const rawText = data.choices?.[0]?.message?.content || "";
    console.log("RAW AI RESPONSE:", rawText);
    
    let category = "Productivity";
    let summary = rawText.slice(0, 100);

    try {
      const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonText);
      if (parsed.category) category = parsed.category;
      if (parsed.summary) summary = parsed.summary;
    } catch (e) {
      const categoryMatch = rawText.match(/category["\s:]+([^,\n"]+)/i);
      const summaryMatch = rawText.match(/summary["\s:]+([^,\n"]+)/i);
      if (categoryMatch) category = categoryMatch[1].replace(/["']/g, '').trim();
      if (summaryMatch) summary = summaryMatch[1].replace(/["']/g, '').trim();
    }

    return {
      category: category,
      summary: summary,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("AI Classification Error:", err);
    return { category: "Error", summary: "Failed to classify visual context." };
  }
}