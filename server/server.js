const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ai-advice', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "user",
        content: `As a financial advisor, respond to: ${req.body.message}`,
      }],
      model: "gpt-3.5-turbo",
    });
    res.json({ advice: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));