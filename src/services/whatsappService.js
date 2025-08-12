const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Database = require('../config/database');
const GeminiService = require('./geminiService');

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
            }
        });
        
        this.database = new Database();
        this.geminiService = new GeminiService();
        this.messageFilters = new Set(['text', 'chat']); // Filtros padrão
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', (qr) => {
            console.log('QR Code recebido, escaneie no WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('Cliente WhatsApp está pronto!');
        });

        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Cliente desconectado:', reason);
        });
    }

    async handleMessage(message) {
        try {
            // Verificar se a mensagem é do tipo filtrado
            if (!this.shouldProcessMessage(message)) {
                return;
            }

            console.log(`Mensagem recebida de ${message.from}: ${message.body}`);

            // Salvar mensagem no banco
            const messageData = {
                fromNumber: message.from,
                fromName: message._data.notifyName || 'Desconhecido',
                text: message.body,
                type: message.type
            };

            const messageId = await this.database.saveMessage(messageData);

            // Gerar resposta com Gemini
            const geminiResponse = await this.geminiService.generateResponse(message.body);

            // Atualizar banco com a resposta
            await this.database.updateGeminiResponse(messageId, geminiResponse);

            // Enviar resposta
            await message.reply(geminiResponse);
            console.log(`Resposta enviada para ${message.from}`);

        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            try {
                await message.reply('Desculpe, ocorreu um erro ao processar sua mensagem.');
            } catch (replyError) {
                console.error('Erro ao enviar mensagem de erro:', replyError);
            }
        }
    }

    shouldProcessMessage(message) {
        // Verificar se é uma mensagem de texto e não é do próprio bot
        return this.messageFilters.has(message.type) && 
               !message.fromMe && 
               message.body && 
               message.body.trim().length > 0;
    }

    setMessageFilters(filters) {
        this.messageFilters = new Set(filters);
        console.log('Filtros de mensagem atualizados:', Array.from(this.messageFilters));
    }

    async start() {
        try {
            await this.database.connect();
            await this.client.initialize();
        } catch (error) {
            console.error('Erro ao iniciar serviço WhatsApp:', error);
            throw error;
        }
    }

    async stop() {
        try {
            await this.client.destroy();
            this.database.close();
            console.log('Serviço WhatsApp parado');
        } catch (error) {
            console.error('Erro ao parar serviço WhatsApp:', error);
        }
    }
}

module.exports = WhatsAppService; 