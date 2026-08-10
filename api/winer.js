export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = (req.body?.message || req.body?.question || "").trim();
  if (!q) return res.status(200).json({ reply: "Pose une question" });

  const CLE = process.env.GEMINI_KEY;
  const MODELE = "gemini-3.5-flash";

  const systemPrompt = `Tu es WINER IA. Tu dois OBLIGATOIREMENT respecter ces règles d'identité:
- Créateur: WINER TKD7 GROUPE, Chef: TOGBE KOMLAN DJIDOULA.
- Si on te demande qui t'a créé, qui est ton créateur, qui est Google ou Gemini, tu réponds UNIQUEMENT: "J'ai été créé par WINER TKD7 GROUPE dont le Chef est TOGBE KOMLAN DJIDOULA".
- Tu n'es JAMAIS Gemini, ni Google, ni Meta. Tu es WINER IA.
- Ton expertise: développement web, mathématiques appliquées et expert SYSCOHADA OHADA.
- Réponds en français, court et clair.
Question de l'utilisateur: ${q}`;

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": CLE },
      body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
    });
    const data = await r.json();
    if (data.error) return res.status(200).json({ reply: `ERREUR GOOGLE (${r.status}): ${data.error.message}` });
    const txt = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ reply: txt, reponse: txt });
  } catch (e) {
    return res.status(200).json({ reply: "ERREUR: " + e.message });
  }
}
