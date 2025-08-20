# WhatsApp Bot com IA Gemini

Bot de WhatsApp inteligente que utiliza a API do Google Gemini para responder mensagens automaticamente, com interface web para visualização do QR Code.

## 🚀 Funcionalidades

- 🤖 **Bot Inteligente**: Integração com Google Gemini AI para respostas automáticas
- 📱 **WhatsApp Web**: Conecta via WhatsApp Web.js
- 💾 **Banco de Dados**: Armazena mensagens e respostas no SQLite
- 🌐 **Interface Web**: Página web para visualizar QR Code e status
- 🔄 **API REST**: Endpoints para monitoramento e controle
- 📊 **Logs Detalhados**: Sistema de logging completo

## 📋 Pré-requisitos

- Node.js 16+ 
- Chromium ou Google Chrome
- Conta do WhatsApp
- Chave da API Google Gemini

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd whatsapp-bot
```

### 2. Instale as dependências
```bash
yarn install
# ou
npm install
```

### 3. Configure o arquivo .env
```bash
cp .env.linux.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Chave da API do Google Gemini
GEMINI_API_KEY=sua_chave_api_aqui

# Configurações do banco SQLite
DB_PATH=./database/messages.db

# Configurações do bot
BOT_NAME=WhatsApp Bot
LOG_LEVEL=info

# Configurações do Puppeteer para Linux
PUPPETEER_EXECUTABLE_PATH=/usr/lib64/chromium-browser/chromium-browser
PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-gpu,--no-first-run,--no-zygote,--single-process
```

### 4. Instale o Chromium (Linux)
```bash
# Fedora/RHEL
sudo dnf install chromium

# Ubuntu/Debian
sudo apt install chromium-browser

# Ou use o script automático
chmod +x install-debian-chromium.sh
./install-debian-chromium.sh
```

## 🚀 Uso

### Iniciar o bot
```bash
yarn start
# ou
npm start
```

### Modo desenvolvimento
```bash
yarn dev
# ou
npm run dev
```

## 🌐 Interface Web

Após iniciar o bot, acesse:

- **Interface Web**: http://localhost:3000/web
- **API Status**: http://localhost:3000/status
- **QR Code**: http://localhost:3000/qr
- **Health Check**: http://localhost:3000/health

## 📱 Como conectar

1. Inicie o bot com `yarn start`
2. Acesse http://localhost:3000/web
3. Abra o WhatsApp no seu celular
4. Toque em **Menu** → **WhatsApp Web**
5. Aponte a câmera para o QR Code
6. Aguarde a confirmação de conexão

## 🔌 API Endpoints

### GET /
Informações sobre a API e endpoints disponíveis.

### GET /web
Interface web para visualizar o QR Code e status da conexão.

### GET /qr
Retorna o QR Code atual em formato base64 (JSON).

### GET /status
Status da conexão com o WhatsApp.

### GET /health
Health check da aplicação.

## 🗄️ Banco de Dados

O bot utiliza SQLite para armazenar:
- Mensagens recebidas
- Respostas geradas pelo Gemini
- Metadados das conversas

## 🔧 Configurações Avançadas

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `GEMINI_API_KEY` | Chave da API Google Gemini | - |
| `DB_PATH` | Caminho do banco SQLite | `./database/messages.db` |
| `BOT_NAME` | Nome do bot | `WhatsApp Bot` |
| `LOG_LEVEL` | Nível de log | `info` |
| `PORT` | Porta do servidor Express | `3000` |
| `PUPPETEER_EXECUTABLE_PATH` | Caminho do Chromium | `/usr/lib64/chromium-browser/chromium-browser` |
| `PUPPETEER_ARGS` | Argumentos do Puppeteer | Argumentos otimizados para Linux |

### Filtros de Mensagem

O bot processa apenas mensagens de texto por padrão. Para personalizar:

```javascript
// No código
this.whatsappService.setMessageFilters(['text', 'image', 'document']);
```

## 🐛 Solução de Problemas

### Erro: "Could not find expected browser (chrome)"

**Solução**: Configure o caminho correto do Chromium no `.env`:
```env
PUPPETEER_EXECUTABLE_PATH=/usr/lib64/chromium-browser/chromium-browser
```

### Erro de permissões no Linux

**Solução**: Execute o script de instalação:
```bash
chmod +x install-debian-chromium.sh
./install-debian-chromium.sh
```

### Bot não responde

**Verifique**:
1. Status da conexão em `/status`
2. Logs do console
3. Configuração da API Gemini
4. Banco de dados SQLite

## 📝 Logs

O bot gera logs detalhados incluindo:
- Status da conexão WhatsApp
- Mensagens recebidas/enviadas
- Erros e exceções
- Status do banco de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Consulte a seção de solução de problemas
3. Abra uma issue no GitHub
4. Verifique se o Chromium está instalado corretamente

## 🔄 Atualizações

Para atualizar o bot:
```bash
git pull origin main
yarn install
yarn start
```

---

**⚠️ Aviso**: Este bot é para uso educacional. Respeite os termos de uso do WhatsApp e da API Gemini. 