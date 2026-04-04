import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY!
);

export const matchJobs = async (skills: string) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const prompt = `
Suggest 5 jobs based on these skills.

Return JSON:

[
{
"title": "",
"company": "",
"description": "",
"matchScore": number
}
]

Skills:
${skills}
`;

    const result = await model.generateContent(prompt);

    const response = result.response;

    const content = response.text();

    try {
        return JSON.parse(content);
    } catch {
        return [];
    }
};