const LANG_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  te: "Telugu",
  mr: "Marathi",
  ta: "Tamil",
  kn: "Kannada",
  gu: "Gujarati",
  pa: "Punjabi (Gurmukhi script)",
  ml: "Malayalam",
};

export async function translateStrings(texts: string[], target: string): Promise<string[]> {
  const name = LANG_NAMES[target];
  if (!name || target === "en") return texts;

  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Translation service is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            `You are a UI localisation engine for an Indian hyperlocal jobs platform called SkillBridge. ` +
            `Translate every string in the given JSON array from English into ${name}. ` +
            `Rules: keep the array order and length identical; keep numbers, currency symbols (₹), dates, ` +
            `units (km, hrs), emojis, punctuation and brand names like "SkillBridge", "GPS", "PMKVY" as-is; ` +
            `translate short UI labels naturally and concisely; never add commentary. ` +
            `Respond with ONLY a JSON object of the form {"items": ["...", "..."]}.`,
        },
        { role: "user", content: JSON.stringify(texts) },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Translation failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content ?? "{}";
  let items: unknown;
  try {
    items = (JSON.parse(content) as { items?: unknown }).items;
  } catch {
    items = undefined;
  }
  if (!Array.isArray(items) || items.length !== texts.length) return texts;
  return items.map((v, i) => (typeof v === "string" && v.trim() ? v : texts[i]));
}
