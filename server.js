// server.js — Backend seguro para OpenAI
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { mensaje } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: mensaje }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No hay respuesta";
    res.json({ respuesta: reply });
  } catch (error) {
    console.error(error);
    res.json({ respuesta: "Error con OpenAI ❌" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Servidor corriendo ✅"));
