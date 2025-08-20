const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const Database = require('../config/database');
const GeminiService = require('./geminiService');

class WhatsAppService {
    constructor() {
        // Configurações otimizadas para Linux/Debian
        const puppeteerArgs = process.env.PUPPETEER_ARGS
            ? process.env.PUPPETEER_ARGS.split(',')
            : [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ];

        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: puppeteerArgs,
                executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
                timeout: 60000,
                protocolTimeout: 60000
            }
        });

        this.database = new Database();
        this.geminiService = new GeminiService();
        this.messageFilters = new Set(['text', 'chat']); // Filtros padrão
        this.qrCodeData = null;

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.on('qr', async (qr) => {
            console.log('QR Code recebido, escaneie no WhatsApp:');
            try {
                this.qrCodeData = await QRCode.toDataURL(qr, { width: 500 });
                console.log('QR Code gerado com sucesso');
            } catch (error) {
                console.error('Erro ao gerar QR Code:', error);
            }
        });

        this.client.on('ready', () => {
            console.log('Cliente WhatsApp está pronto!');
            this.qrCodeData = null; // Limpar QR code quando conectado
        });

        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        this.client.on('disconnected', (reason) => {
            console.log('Cliente desconectado:', reason);
            this.qrCodeData = null; // Limpar QR code quando desconectado
        });
    }

    getQrCodeData() {
        return this.qrCodeData;
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