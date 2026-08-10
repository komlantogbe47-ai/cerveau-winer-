export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = (req.body?.message || req.body?.question || "").trim();
  if (!q) return res.status(200).json({ reply: "Pose une question" });

  const CLE = process.env.GEMINI_KEY;

  // Modèles 2026 autorisés pour les nouvelles clés AQ...
  const MODELE = "gemini-3.5-flash";

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": CLE },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Tu es WINER IA, expert SYSCOHADA OHADA, réponds en français court et clair: ${q}` }] }] })
    });
    const data = await r.json();
    if (data.error) return res.status(200).json({ reply: `ERREUR GOOGLE (${r.status}): ${data.error.message}` });
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ reply: txt, reponse: txt });
  } catch (e) {
    return res.status(200).json({ reply: "ERREUR: " + e.message });
  }
    }
