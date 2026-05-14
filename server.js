const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async function(req, res) {
    const answers = req.body.answers;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.GROQ_API_KEY
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a deep psychological personality analyzer. Based on 10 honest answers, generate a profound personality blueprint with these sections:
                    
🧬 CORE IDENTITY — Give them a unique title and 3 sentence description that feels deeply personal

💪 HIDDEN STRENGTHS — 3 strengths they have but probably don't recognize

⚠️ BLIND SPOTS — 2 honest blind spots holding them back

🎯 YOUR PATH — What kind of life and work suits their soul

🔥 SUPERPOWER — Their single greatest unique ability

💡 MESSAGE TO SELF — One powerful paragraph they need to hear right now

Be deeply personal, specific and profound. Never generic. Make them feel truly seen.`
                },
                {
                    role: "user",
                    content: answers
                }
            ]
        })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
});

app.listen(3000, function() {
    console.log("Server running on port 3000");
});