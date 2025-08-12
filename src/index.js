require('dotenv').config();
const WhatsAppService = require('./services/whatsappService');

class WhatsAppBot {
    constructor() {
        this.whatsappService = new WhatsAppService();
        this.setupGracefulShutdown();
    }

    setupGracefulShutdown() {
        process.on('SIGINT', async () => {
            console.log('\nRecebido SIGINT, encerrando...');
            await this.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.log('\nRecebido SIGTERM, encerrando...');
            await this.stop();
            process.exit(0);
        });

        process.on('uncaughtException', async (error) => {
            console.error('Exceção não capturada:', error);
            await this.stop();
            process.exit(1);
        });

        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Promise rejeitada não tratada:', reason);
            await this.stop();
            process.exit(1);
        });
    }

    async start() {
        try {
            console.log('🚀 Iniciando WhatsApp Bot...');
            console.log('📱 Conectando ao WhatsApp...');
            
            await this.whatsappService.start();
            
            console.log('✅ Bot iniciado com sucesso!');
            console.log('📋 Filtros de mensagem ativos:', ['text', 'chat']);
            console.log('💾 Banco de dados SQLite configurado');
            console.log('🤖 Integração com Gemini ativa');
            console.log('\n📱 Escaneie o QR Code para conectar ao WhatsApp');
            console.log('⏹️  Pressione Ctrl+C para parar o bot\n');
            
        } catch (error) {
            console.error('❌ Erro ao iniciar o bot:', error);
            process.exit(1);
        }
    }

    async stop() {
        try {
            console.log('\n🛑 Parando WhatsApp Bot...');
            await this.whatsappService.stop();
            console.log('✅ Bot parado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao parar o bot:', error);
        }
    }
}

// Iniciar o bot
const bot = new WhatsAppBot();
bot.start().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
}); 