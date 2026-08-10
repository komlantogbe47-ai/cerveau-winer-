export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const question = (req.body?.message || req.body?.question || "").trim();
  if (!question) return res.status(200).json({ reply: "Pose une question" });

  const CLE = process.env.GEMINI_KEY;
  const prompt = `Tu es WINER IA. Expert SYSCOHADA OHADA, réponds en français court. Question: ${question}`;

  const MODELES = ["gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-flash-latest"];

  for (const modele of MODELES) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modele}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": CLE },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await r.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const txt = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ reply: txt, reponse: txt });
      }
      if (data.error &&!data.error.message.includes("Quota") &&!data.error.message.includes("not found")) {
         return res.status(200).json({ reply: `ERREUR GOOGLE: ${data.error.message}` });
      }
    } catch(e){}
  }
  return res.status(200).json({ reply: "Google a bloqué tous les modèles gratuits. Va sur https://aistudio.google.com > Usage & Billing > active le plan gratuit." });
}
