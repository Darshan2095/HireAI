const API_VERSIONS = ["v1", "v1beta"] as const;

const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
].filter((model): model is string => Boolean(model && model.trim()));

const normalizeModelName = (model: string) => model.replace(/^models\//, "").trim();

const tryGenerateWithFallback = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  let lastError: unknown;

  for (const rawModelName of MODEL_CANDIDATES) {
    const modelName = normalizeModelName(rawModelName);

    for (const version of API_VERSIONS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const errMsg =
            payload?.error?.message ??
            `${response.status} ${response.statusText}`;
          throw new Error(errMsg);
        }

        const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (typeof text !== "string" || !text.trim()) {
          throw new Error("Gemini response did not contain text output");
        }

        return text;
      } catch (error) {
        lastError = error;
        console.warn(`Gemini request failed for ${version}/${modelName}`);
      }
    }
  }

  throw lastError ?? new Error("No Gemini model candidates configured");
};

export const generateQuestions = async (skills: string) => {
  const prompt = `
Generate 5 technical interview questions based on skills:

${skills}

Return JSON:

[
{
"question": ""
}
]
`;

  const content = await tryGenerateWithFallback(prompt);
  const normalized = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(normalized);
  } catch {
    return [];
  }
};