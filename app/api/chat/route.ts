import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the Google GenAI SDK with the API Key and appropriate telemetry headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      algorithmId,
      algorithmName,
      algorithmType,
      inputArray,
      currentStep,
      totalSteps,
      currentStepDescription,
      pseudocode,
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Build a clean system instruction with the context of the user's workspace
    const systemInstruction = `You are "AlgoTutor", an expert, friendly interactive assistant integrated into a high-fidelity Parallel & Sequential Algorithm Visualizer. 
Your goal is to help users learn and gain absolute clarity on parallel and sequential computational models, algorithms, network topologies, complexities, and visual simulator states.

Context of the User's Current Workspace:
- Current Algorithm: ${algorithmName || "None"} (${algorithmId || "None"})
- Computational Type: ${algorithmType || "N/A"}
- Active Input Array: ${inputArray ? JSON.stringify(inputArray) : "None"}
- Simulation Status: On Step ${currentStep !== undefined ? currentStep + 1 : "N/A"} out of ${totalSteps || "N/A"}
- Current Simulator Action/State: ${currentStepDescription || "None"}
${pseudocode ? `- Current Pseudocode:\\n${pseudocode.map((line: string, idx: number) => `  [Line ${idx + 1}] ${line}`).join("\\n")}` : ""}

Core Directives:
1. Always be supportive, concise, and focused on teaching. Do not output raw code dumps unless requested, and keep explanations visually clean and markdown-formatted.
2. Directly refer to the user's specific input array and current step to explain what the processors/cores or cells are doing *right now* in their visualizer.
3. Help explain complexes (like Parallel Reduction and Prefix Sum on odd/even sizes, Hypercubes, Bitonic Merge networks) with clarity, humble tone, and intuitive mechanical analogies.
4. Keep answers relatively short, scannable, and engaging. Avoid long introductory or concluding fluff.
5. STRICTLY PROHIBITED: LaTeX Math Delimiters and Delimiter Symbols ($ or $$). Do NOT use dollar signs ($ or $$) anywhere in your mathematical expressions, complexities, or text. Do NOT use LaTeX keywords or markup (e.g., \\frac, \\text, \\approx, \\log, \\theta, \\times, etc.). Instead, write all mathematical formulas, fractions, and time complexities in clean, readable plain text or markdown inline code format. For example:
   - Instead of writing "$O(n \\log n)$" or "$$O(n^2)$$" or similar, write "O(n * log(n))" or "O(n^2)".
   - Instead of writing "$\\frac{n(n-1)}{2}$", write "n * (n - 1) / 2".
   - Use plain words like "approximately", "equals", "is less than or equal to", "multiplied by", etc.
   - Use standard code block formatting or bold text for complexes and math, making it highly readable for general audiences.
6. STRICT TOPIC FILTER - ALGORITHMS ONLY: You must ONLY discuss and answer questions related to computer science, algorithms (sorting, searching, parallel models, network topologies, prefix sum, bitonic sort, reduction, etc.), Big O complexity, pseudocode, and the simulator's active states or input data.
   - If the user asks about ANYTHING ELSE (e.g., sports, World Cup, celebrities, history, cooking, weather, politics, general pop culture, music, or unrelated conversational chatter), you must politely and warmly refuse to answer.
   - Use a friendly rejection response such as: "I am designed to be your specialized AlgoTutor AI to help you learn algorithms, so I cannot answer questions about that topic! Ask me something about parallel sorting, prefix sums, or our visualizer instead! 😊"`;

    // Map existing history to the format required by GoogleGenAI SDK contents
    // Structure: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const contents = history.map((chatMsg: any) => ({
      role: chatMsg.role === "assistant" ? "model" : "user",
      parts: [{ text: chatMsg.content }],
    }));

    // Add the latest user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Call the correct model gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText =
      response.text || "I was unable to generate a response. Please try again.";

    return NextResponse.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    let rawMsg =
      error.message || "An error occurred while calling the Gemini API";

    // Parse JSON error string if possible
    if (typeof rawMsg === "string" && rawMsg.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed.error && parsed.error.message) {
          rawMsg = parsed.error.message;
        }
      } catch (e) {
        // Fallback to original string
      }
    }

    return NextResponse.json({ error: rawMsg }, { status: 500 });
  }
}
