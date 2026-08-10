export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "message manquant" });
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_KEY;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Tu es WINER, assistant shopping au Togo. Reponds court et utile. Question: " + message }] }] })
  });
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Erreur IA";
  return res.status(200).json({ reply: text });
}
