// chat.cjs
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { usuario, mensaje } = req.body;

  if (!usuario || !mensaje) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // Límite de 5 mensajes por usuario
  if (!global.mensajesPorUsuario) global.mensajesPorUsuario = {};
  if (!global.mensajesPorUsuario[usuario]) global.mensajesPorUsuario[usuario] = 0;

  if (global.mensajesPorUsuario[usuario] >= 5) {
    return res.json({
      respuesta: "Límite de 5 mensajes diarios. Suscríbete para ilimitado."
    });
  }

  global.mensajesPorUsuario[usuario]++;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5", // tu modelo GPT-5
        messages: [{ role: "user", content: mensaje }]
      })
    });

    const data = await r.json();

    return res.json({ respuesta: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno de IA" });
  }
};
