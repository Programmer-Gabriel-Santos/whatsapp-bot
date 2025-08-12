const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY não configurada no arquivo .env');
        }
        
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generateResponse(message) {
        try {
            const prompt = `Você é um assistente útil e amigável. Responda de forma clara e concisa à seguinte mensagem: "${message}"`;
            
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Erro ao gerar resposta do Gemini:', error);
            return 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente mais tarde.';
        }
    }
}

module.exports = GeminiService; 