const { GoogleGenAI } = require("@google/genai");

const GenAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// function to generate response from the ai
async function generateResponse(prompt) {
    const response = await GenAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text
}

// function to generate vector of the message
async function generateVector(content) {
    const response = await GenAi.models.embedContent({
        model: "text-embedding-004",
        contents: content,
        config: { outputDimensionality: 768 }
    })
    return response.embeddings[0].values;
}

// export functions
module.exports = {
    generateResponse,
    generateVector
};