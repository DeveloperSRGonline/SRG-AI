const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const SRGAI = pc.Index("srg-ai-long-term-memory");

async function createVector({ vectors, metadata, messageId }) {
    try {
        console.log("Creating vector for message:", messageId);
        await SRGAI.upsert([{
            id: messageId,
            values: vectors,
            metadata
        }]);
        console.log("Vector created successfully");
    } catch (error) {
        console.error("Error creating vector:", error);
        throw error;
    }
}

// function to search the memory for required context
async function queryMemory({ queryVector, limit = 5, metadata }) {
    try {
        const data = await SRGAI.query({
            vector: queryVector,
            topK: limit,
            filter: metadata ? { metadata } : undefined,
            includeMetadata: true
        })
        return data
    } catch (error) {
        console.error("Error querying memory:", error);
        throw error;
    }
}

// export functions
module.exports = {
    createVector,
    queryMemory
}