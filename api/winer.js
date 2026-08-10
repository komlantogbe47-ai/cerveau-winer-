export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const question = (req.body?.message || req.body?.question || "").trim();
  if (!question) return res.status(200).json({ reply: "Pose une question" });

  const CLE = process.env.GEMINI_KEY;
  if (!CLE) return res.status(200).json({ reply: "ERREUR: GEMINI_KEY manquante dans Vercel" });

  const prompt = `Tu es WINER IA. Expert SYSCOHADA OHADA mais tu réponds à tout en français, clair et court. Question: ${question}`;

  try {
    // Nouveau modèle officiel juin 2026 + auth par header
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": CLE
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `ERREUR GOOGLE (${response.status}): ${data.error.message}` });
    }

    const texte = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ reply: texte || "Réponse vide", reponse: texte });

  } catch (e) {
    return res.status(200).json({ reply: "ERREUR SERVEUR: " + e.message });
  }
}
