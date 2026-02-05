// api/chat.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuario, mensaje } = req.body;
  if (!usuario || !mensaje) return res.status(400).json({ error: "Faltan datos" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // o gpt-5 si tu clave lo permite
        messages: [{ role: "user", content: mensaje }]
      })
    });

    const data = await r.json();

    if (!data.choices) return res.status(500).json({ error: "Respuesta de IA inválida" });

    return res.json({ respuesta: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno de IA" });
  }
}
