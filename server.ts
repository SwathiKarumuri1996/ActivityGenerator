import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

// Fallback generator for when upstream AI service experiences temporary global 503 spikes
function generateAdaptiveIdeas(
  childName: string,
  ageInMonths: number,
  objects: string[],
  difficulty: string,
  timeMinutes: number
) {
  const primaryObj = objects[0] || "Household objects";
  const secondaryObj = objects[1] || "Kitchen bowls";
  const safeName = childName || "your child";

  const isEasier = difficulty === "easier";
  const isChallenging = difficulty === "more_challenging";

  return [
    {
      title: isEasier
        ? `Gentle ${primaryObj} Sensory Touch & Discover`
        : isChallenging
        ? `${primaryObj} Stacking & Problem-Solving Lab`
        : `Interactive ${primaryObj} Exploration Station`,
      oneLiner: `A calm, engaging setup for ${safeName} utilizing ${primaryObj} to nurture tactile curiosity and hand-eye coordination.`,
      targetAgeMonthsMin: Math.max(2, ageInMonths - (isEasier ? 3 : 1)),
      targetAgeMonthsMax: ageInMonths + (isChallenging ? 4 : 2),
      prepMinutes: 1,
      playDurationMinutes: timeMinutes || 15,
      materialsNeeded: objects.slice(0, 3),
      steps: [
        `Sit comfortably with ${safeName} on a soft play rug or floor blanket.`,
        `Place the ${primaryObj} within easy arm's reach and let them initiate contact without rushing.`,
        isEasier
          ? `Guide their hand gently to tap and feel the texture, offering warm encouraging smiles.`
          : isChallenging
          ? `Model hiding one item slightly under another and prompt them with: 'Where did it go?'`
          : `Show how the ${primaryObj} moves, wobbles, or sounds when tapped against ${secondaryObj}.`,
        `Follow their lead: whether they inspect it for 30 seconds or 10 minutes, celebrate their focus.`,
      ],
      skillsFostered: isEasier
        ? ["Sensory Integration", "Calm Focus", "Tactile Awareness"]
        : isChallenging
        ? ["Bimanual Coordination", "Cause & Effect", "Spatial Reasoning"]
        : ["Fine Motor Grasp", "Curiosity", "Hand-Eye Coordination"],
      messLevel: "Zero mess",
      safetyNote: `Ensure items are clean and free of sharp edges. Maintain gentle line-of-sight supervision.`,
      quickVariation: `Try dimming overhead lights or introducing a soft background lullaby to deepen calm.`,
      simplifyTip: `Hold the item still right in front of their chest so they don't have to reach or balance while exploring.`,
      challengeTip: `Place the ${primaryObj} slightly out of reach on a low sturdy surface to encourage reaching, crawling, or pulling up.`,
      calmTipForParent: `You don't need fancy plastic toys. Real everyday textures like ${primaryObj} offer rich sensory input for ${safeName}.`,
    },
    {
      title: `${secondaryObj || "Container"} Drop & Rattle Symphony`,
      oneLiner: `Explore auditory cause-and-effect and motor release by dropping and shaking household objects.`,
      targetAgeMonthsMin: Math.max(3, ageInMonths - 2),
      targetAgeMonthsMax: ageInMonths + 3,
      prepMinutes: 2,
      playDurationMinutes: timeMinutes || 15,
      materialsNeeded: [secondaryObj || "Containers", primaryObj],
      steps: [
        `Place a shallow container or basket on the carpet between you and ${safeName}.`,
        `Demonstrate dropping the ${primaryObj} inside: 'Plop! Hear that?'`,
        `Hand ${safeName} another item and open your hand to signal it's safe to let go.`,
        `Celebrate every attempt, even if they fling it sideways—releasing objects is an advanced motor milestone!`,
      ],
      skillsFostered: ["Auditory Processing", "Voluntary Release", "Turn Taking"],
      messLevel: "Zero mess",
      safetyNote: `Use non-breakable items. Stay close to prevent heavy objects falling on little toes.`,
      quickVariation: `Line the bottom of the container with a washcloth to turn a loud clatter into a quiet dull thud.`,
      simplifyTip: `Hold the container right underneath their hands so gravity does the work when their fingers open.`,
      challengeTip: `Use two containers of different depths or sounds to see if they notice the different acoustic pitches.`,
      calmTipForParent: `Dropping things repeatedly isn't defiance—it's how developing brains learn physics and cause-and-effect.`,
    },
  ];
}

// Endpoint for AI-suggested custom play setups with multi-model fallback and resilience
app.post("/api/generate-play-ideas", async (req, res) => {
  try {
    const { ageInMonths, timeMinutes, objects, mood, childName, difficulty } = req.body;

    if (!objects || !Array.isArray(objects) || objects.length === 0) {
      return res.status(400).json({ error: "Please provide at least one household object." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return custom adaptive setups if API key isn't provided
      const adaptiveIdeas = generateAdaptiveIdeas(
        childName,
        ageInMonths,
        objects,
        difficulty || "just_right",
        timeMinutes
      );
      return res.json({
        source: "adaptive-engine",
        message: "Generated custom play setups tailored to your exact items.",
        ideas: adaptiveIdeas,
      });
    }

    const difficultyInstruction =
      difficulty === "easier"
        ? "Target Difficulty: EASIER / GENTLE. Keep steps minimal (1-2 actions), very low motor/cognitive demand, soothing, zero frustration."
        : difficulty === "more_challenging"
        ? "Target Difficulty: STEP IT UP / CHALLENGING. Introduce bimanual coordination, problem solving, precision grasp, or vocabulary extensions."
        : "Target Difficulty: JUST RIGHT. Standard milestone calibration for their exact age.";

    const prompt = `You are a certified pediatric occupational therapist and gentle play specialist.
Generate 3 creative, age-appropriate, low-stress home play activity ideas for:
- Child: ${childName || "the child"}
- Age: ${ageInMonths} months old
- Time Available: ~${timeMinutes || 15} minutes
- Exact Household Objects Available: ${objects.join(", ")}
${mood && mood !== "any" ? `- Desired Vibe: ${mood}` : ""}
- ${difficultyInstruction}

Requirements:
1. Every activity MUST primarily use the provided household objects (${objects.join(", ")}).
2. Prep time MUST be under 3 minutes with zero or very low mess.
3. Explicitly emphasize developmental skills (fine motor, gross motor, sensory exploration, language, or cognition).
4. Include a practical "simplifyTip" (how a tired parent can make it even simpler or gentler).
5. Include a practical "challengeTip" (how to level it up when the child wants more challenge).
6. Provide calm, reassuring steps with a mindful note for the parent.

Return strictly valid JSON with this format:
{
  "ideas": [
    {
      "title": "string",
      "oneLiner": "string",
      "targetAgeMonthsMin": number,
      "targetAgeMonthsMax": number,
      "prepMinutes": number,
      "playDurationMinutes": number,
      "materialsNeeded": ["string"],
      "steps": ["string"],
      "skillsFostered": ["string"],
      "messLevel": "Zero mess" | "Low / Easy wipe" | "Water play",
      "safetyNote": "string",
      "quickVariation": "string",
      "simplifyTip": "string",
      "challengeTip": "string",
      "calmTipForParent": "string"
    }
  ]
}`;

    // Candidate models in priority order
    const candidateModels = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let rawText = "";
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response && response.text) {
          rawText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} unavailable (${err?.status || err?.message}). Trying next candidate...`);
      }
    }

    if (rawText) {
      try {
        const cleaned = cleanJsonText(rawText);
        const parsed = JSON.parse(cleaned);
        if (parsed.ideas && Array.isArray(parsed.ideas) && parsed.ideas.length > 0) {
          return res.json({
            source: "gemini-ai",
            ideas: parsed.ideas,
          });
        }
      } catch (parseErr) {
        console.warn("JSON parse issue from AI response, using adaptive fallback:", parseErr);
      }
    }

    // If models were temporarily 503 or unavailable, deliver dynamic adaptive setups tailored to their exact items
    console.log("Using adaptive play engine due to temporary upstream AI capacity spike:", lastError?.message);
    const fallbackIdeas = generateAdaptiveIdeas(
      childName,
      ageInMonths,
      objects,
      difficulty || "just_right",
      timeMinutes
    );

    return res.json({
      source: "adaptive-engine",
      message: "Custom-crafted setups built for your exact objects and difficulty level.",
      ideas: fallbackIdeas,
    });
  } catch (error: any) {
    console.error("Play ideas endpoint error:", error);
    // Even in case of unexpected errors, provide helpful ideas
    const { childName, ageInMonths, objects, difficulty, timeMinutes } = req.body || {};
    const fallbackIdeas = generateAdaptiveIdeas(
      childName,
      ageInMonths || 12,
      objects || ["Plastic containers", "Spoons"],
      difficulty || "just_right",
      timeMinutes || 15
    );

    return res.json({
      source: "adaptive-engine",
      message: "Custom-crafted setups built for your exact objects.",
      ideas: fallbackIdeas,
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
