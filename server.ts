import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!apiKey,
  });
});

// Dynamic Lead Generator based on Onboarding ICP Config using Gemini
app.post("/api/generate-leads", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured inside the server environment.",
    });
  }

  const { config } = req.body;
  if (!config) {
    return res.status(400).json({ error: "Onboarding ICP config is required." });
  }

  const industry = config.targetIndustry || "Technology/SaaS";
  const size = config.companySizeRange || "50-200 employees";
  const geo = config.targetGeography || "North America";
  const website = config.companyWebsite || "https://example.com";
  const description = config.companyDescription || "B2B Outreach Platform";
  const painPoints = config.companyDescription || "Manual outbound and lead enrichment";
  const personas = config.targetPersonas?.length ? config.targetPersonas.join(", ") : "CRO, Head of Growth";
  const stages = config.fundingStages?.length ? config.fundingStages.join(", ") : "Seed, Series A";

  const prompt = `You are an expert sales intelligence tool. Based on the following user company and target ICP (Ideal Customer Profile) information:
- User Company: "${website}" (Description: ${description})
- Target Industry: "${industry}"
- Target Geography: "${geo}"
- Target Company Size: "${size}"
- Target Job Personas: "${personas}"
- Preferred Funding Stages: "${stages}"
- Prospects Key Pain Points: "${painPoints}"

Generate exactly 6 realistic high-intent prospect leads that match this ICP. Return a varied list of target companies (with domains, domains should look real) and appropriate buyers in those companies.
For each lead, detect one of the following high-intent buying signals: "Hiring SDRs", "Recent Funding", "AI Adoption", "Product Launch", "Leadership Hiring", "Expansion Hiring", "Tech Stack Changes", "Competitor Usage".
Each company must have an appropriate realistic intent score (from 78 to 99), realistic employee count (fitting target size or slightly scaled), realistic funding stage (Pre-seed, Seed, Series A, Series B, Series C, Bootstrapped, Public), and a custom hyper-focused 'aiSummary' of why they were flagged with that buying signal.

Return ONLY a JSON array matching the specified schema. Keep summaries punchy and sales-intelligence focused.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING, description: "Name of the target company" },
              domain: { type: Type.STRING, description: "Website domain of the target company, e.g. vercel.com" },
              contactName: { type: Type.STRING, description: "First and last name of the buyer persona contact" },
              contactEmail: { type: Type.STRING, description: "Professional work email address" },
              contactTitle: { type: Type.STRING, description: "Matching B2B Title listed in targets, e.g. VP Sales" },
              signalDetected: { type: Type.STRING, description: "The specific buying signal category selected from the list" },
              signalDate: { type: Type.STRING, description: "Date of signal occurrence, e.g. '2 hours ago', 'Yesterday'" },
              intentScore: { type: Type.INTEGER, description: "Calculated intent score between 75 and 99" },
              fundingStage: { type: Type.STRING, description: "Funding stage from options list" },
              location: { type: Type.STRING, description: "Location, e.g. 'San Francisco, CA'" },
              employeeCount: { type: Type.INTEGER, description: "Employee headcount size, e.g. 120" },
              aiSummary: { type: Type.STRING, description: "A highly personalized 1-2 sentence B2B intelligence finding of why this signal was caught (e.g. 'Vercel recently posted 4 listings for enterprise SDRs, focusing heavily on expanding their outbound market share')." },
            },
            required: [
              "company",
              "domain",
              "contactName",
              "contactEmail",
              "contactTitle",
              "signalDetected",
              "signalDate",
              "intentScore",
              "fundingStage",
              "location",
              "employeeCount",
              "aiSummary",
            ],
          },
        },
      },
    });

    const parsedLeads = JSON.parse(response.text?.trim() || "[]");
    return res.json({ leads: parsedLeads });
  } catch (err: any) {
    console.error("Error generating leads via Gemini:", err);
    return res.status(500).json({
      error: "Failed to generate dynamic B2B leads via Gemini API.",
      details: err.message,
    });
  }
});

// Personalized AI Outreach Generator using Gemini
app.post("/api/personalize", async (req, res) => {
  if (!ai) {
    return res.status(503).json({
      error: "Gemini API key is not configured inside the server environment.",
    });
  }

  const { lead, config, tone = "professional" } = req.body;
  if (!lead || !config) {
    return res.status(400).json({ error: "Lead and workspace configuration data are required." });
  }

  const prompt = `You are a world-class sales personalization engine for RevEngineer Signal OS.
Our context:
- User Company: "${config.companyWebsite}"
- User Company Pitch: "${config.companyDescription}"
- Target Persona: ${lead.contactName} (${lead.contactTitle} at ${lead.company})
- Detected Buying Signal: "${lead.signalDetected}" (Details: ${lead.aiSummary})
- Lead Context Level: Intent Score of ${lead.intentScore}%, Funding Stage: ${lead.fundingStage}, Location: ${lead.location}
- Preferred Tone: ${tone}

Generate a hyper-personalized multi-channel sales outbound sequence in a clean JSON format. Design an incredibly compelling email subject line and cold email body (never sound overly generic, do not write 'I hope this email finds you well' or similar AI clichés - keep it direct, authentic, and signal-led). Generate a standard short, high-conversion LinkedIn connection message (under 300 characters), a follow-up cold email bump, and a punchy bulleted prospect dossier (research summary of why they are a high fit).

Your response MUST match this exact JSON structure:
{
  "emailSubject": "Compelling, short email subject line",
  "emailBody": "Direct, personalized, high-value email body addressing their signal and pain point. Max 3 short paragraphs.",
  "linkedinOpener": "Short, natural-sounding LinkedIn connection pitch. Max 290 characters.",
  "followUp": "Short bump email that follows up 3 days later, adding context.",
  "prospectSummary": "A brief analysis of the target prospect, emphasizing their current high-intent triggers."
}

Ensure the output is valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emailSubject: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            linkedinOpener: { type: Type.STRING },
            followUp: { type: Type.STRING },
            prospectSummary: { type: Type.STRING },
          },
          required: ["emailSubject", "emailBody", "linkedinOpener", "followUp", "prospectSummary"],
        },
      },
    });

    const parsedOutreach = JSON.parse(response.text?.trim() || "{}");
    return res.json(parsedOutreach);
  } catch (err: any) {
    console.error("Error generating outreach via Gemini:", err);
    return res.status(500).json({
      error: "Failed to generate AI personalization via Gemini API.",
      details: err.message,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RevEngineer Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
