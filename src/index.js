require('dotenv').config();
const express = require('express');
const WhatsAppService = require('./services/whatsappService');

class WhatsAppBot {
    constructor() {
        this.whatsappService = new WhatsAppService();
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.setupExpress();
        this.setupGracefulShutdown();
    }

    setupExpress() {
        // Middleware para parsing JSON
        this.app.use(express.json());
        
        // Middleware para servir arquivos estáticos
        this.app.use(express.static('public'));
        
        // Middleware para CORS
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        // Rota principal
        this.app.get('/', (req, res) => {
            res.json({
                message: 'WhatsApp Bot API',
                status: 'running',
                endpoints: {
                    qr: '/qr',
                    status: '/status',
                    health: '/health',
                    web: '/web'
                }
            });
        });

        // Rota para a interface web do QR Code
        this.app.get('/web', (req, res) => {
            res.sendFile('index.html', { root: './public' });
        });

        // Rota para obter o QR Code
        this.app.get('/qr', (req, res) => {
            const qrCodeData = this.whatsappService.getQrCodeData();
            if (qrCodeData) {
                res.json({
                    success: true,
                    qrCode: qrCodeData,
                    message: 'QR Code disponível para escaneamento'
                });
            } else {
                res.json({
                    success: false,
                    message: 'QR Code não disponível. Aguarde ou verifique o status da conexão.'
                });
            }
        });

        // Rota para verificar o status da conexão
        this.app.get('/status', (req, res) => {
            const isReady = this.whatsappService.client.isReady;
            const qrCodeAvailable = !!this.whatsappService.getQrCodeData();
            
            res.json({
                success: true,
                whatsapp: {
                    isReady,
                    qrCodeAvailable,
                    status: isReady ? 'connected' : qrCodeAvailable ? 'waiting_qr' : 'connecting'
                },
                timestamp: new Date().toISOString()
            });
        });

        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });

        // Middleware de tratamento de erros
        this.app.use((err, req, res, next) => {
            console.error('Erro no servidor:', err);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
            });
        });

        // Rota 404
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Endpoint não encontrado'
            });
        });
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
            
            // Iniciar o servidor Express
            this.server = this.app.listen(this.port, () => {
                console.log(`🌐 Servidor Express rodando na porta ${this.port}`);
                console.log(`🔗 Endpoints disponíveis:`);
                console.log(`   - http://localhost:${this.port}/`);
                console.log(`   - http://localhost:${this.port}/qr`);
                console.log(`   - http://localhost:${this.port}/status`);
                console.log(`   - http://localhost:${this.port}/health`);
                console.log(`   - http://localhost:${this.port}/web (Interface Web)`);
            });
            
            await this.whatsappService.start();
            
            console.log('✅ Bot iniciado com sucesso!');
            console.log('📋 Filtros de mensagem ativos:', ['text', 'chat']);
            console.log('💾 Banco de dados SQLite configurado');
            console.log('🤖 Integração com Gemini ativa');
            console.log('\n📱 Escaneie o QR Code para conectar ao WhatsApp');
            console.log('🌐 Ou acesse http://localhost:3000/web para a interface web');
            console.log('⏹️  Pressione Ctrl+C para parar o bot\n');
            
        } catch (error) {
            console.error('❌ Erro ao iniciar o bot:', error);
            process.exit(1);
        }
    }

    async stop() {
        try {
            console.log('\n🛑 Parando WhatsApp Bot...');
            
            // Parar o servidor Express
            if (this.server) {
                this.server.close(() => {
                    console.log('✅ Servidor Express parado');
                });
            }
            
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

