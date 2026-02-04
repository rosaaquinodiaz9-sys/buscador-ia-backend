const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { mensaje } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Eres UltraGPT, un asistente inteligente." },
          { role: "user", content: mensaje }
        ]
      })
    });

    const data = await response.json();
    res.json({ respuesta: data.choices[0].message.content });

  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.get("/", (req, res) => {
  res.send("UltraGPT backend activo ✅");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo ✔️");
});
