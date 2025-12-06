const axios = require('axios');

// Using Groq API as the provider for "DeepSeek" (via deepseek-r1-distill-llama-70b)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

exports.analyzeCode = async (code, language) => {
    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: "llama-3.1-8b-instant", // Using Groq's DeepSeek model
                messages: [
                    {
                        role: "system",
                        content: `You are an expert code reviewer. Analyze the following ${language} code. Provide feedback on:
            1. Bugs and potential issues
            2. Performance improvements
            3. Code style and best practices
            4. Security vulnerabilities
            Provide the response in Markdown format.`
                    },
                    {
                        role: "user",
                        content: code
                    }
                ],
                temperature: 0.2
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error.response ? error.response.data : error.message);

        return `### API Error
        
Failed to analyze code. Please check your API key.
Error details: ${error.response ? JSON.stringify(error.response.data) : error.message}`;
    }
};
