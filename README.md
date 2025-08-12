# WhatsApp Bot com IA Gemini

Bot de WhatsApp que escuta mensagens, salva no banco SQLite local e responde usando a IA Gemini do Google.

## 🚀 Funcionalidades

- ✅ Conexão com WhatsApp via whatsapp-web.js
- ✅ Filtros de mensagem configuráveis
- ✅ Armazenamento local em SQLite
- ✅ Integração com Google Gemini AI
- ✅ Resposta automática para mensagens
- ✅ Tratamento de erros robusto
- ✅ Otimizado para baixo consumo de memória
- ✅ Compatível com sistemas Linux/Debian

## 📋 Pré-requisitos

- Node.js 16+ 
- NPM ou Yarn
- Chave da API do Google Gemini
- **Linux/Debian**: Chrome, Chromium ou navegador compatível

## 🛠️ Instalação

### Windows/macOS
1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd whatsapp-bot
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

### Linux/Debian (Recomendado)
1. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd whatsapp-bot
```

2. **Execute o script de instalação automática:**
```bash
# Opção 1: Google Chrome (mais estável)
chmod +x install-debian.sh
./install-debian.sh

# Opção 2: Chromium (mais leve, nativo do Debian)
chmod +x install-debian-chromium.sh
./install-debian-chromium.sh
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.linux.example .env
```

4. **Instale as dependências Node.js:**
```bash
npm install
```

## 🔧 Configuração das variáveis de ambiente

### Arquivo .env básico:
```env
GEMINI_API_KEY=sua_chave_api_aqui
DB_PATH=./database/messages.db
```

### Arquivo .env para Linux (otimizado):
```env
GEMINI_API_KEY=sua_chave_api_aqui
DB_PATH=./database/messages.db
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
PUPPETEER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage
```

## 🚀 Como usar

### Iniciar o bot:
```bash
npm start
```

### Modo desenvolvimento (com auto-reload):
```bash
npm run dev
```

## 📱 Primeira execução

1. Execute `npm start`
2. Um QR Code aparecerá no terminal
3. Escaneie o QR Code com seu WhatsApp
4. O bot estará ativo e responderá automaticamente

## ⚙️ Configuração

### Filtros de mensagem
Por padrão, o bot processa apenas mensagens de texto. Para modificar os filtros, edite o arquivo `src/services/whatsappService.js`.

### Banco de dados
O banco SQLite é criado automaticamente na pasta `database/`. As mensagens são salvas com:
- Número do remetente
- Nome do remetente
- Texto da mensagem
- Tipo da mensagem
- Timestamp
- Resposta do Gemini
- Status de envio

## 🔧 Estrutura do projeto

```
src/
├── config/
│   └── database.js      # Configuração do SQLite
├── services/
│   ├── whatsappService.js # Serviço principal do WhatsApp
│   └── geminiService.js   # Integração com Gemini
└── index.js              # Arquivo principal
```

## 🐧 Solução de problemas para Linux

### Erro "failed to launch the browser process"
Este erro é comum em sistemas Linux. Use um dos scripts de instalação fornecidos:

```bash
# Para Debian/Ubuntu
./install-debian-chromium.sh
```

### Verificar se o navegador está funcionando:
```bash
# Testar Google Chrome
google-chrome --version

# Testar Chromium
chromium --version

# Verificar caminhos
which google-chrome
which chromium
```

### Configurações alternativas no .env:
```env
# Para Chromium
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Para Google Chrome
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

## 📊 Monitoramento

O bot exibe logs detalhados no console:
- Status de conexão
- Mensagens recebidas
- Respostas enviadas
- Erros e exceções

## 🛑 Parando o bot

Pressione `Ctrl+C` no terminal para parar o bot graciosamente.

## ⚠️ Limitações

- Requer conexão com internet
- Depende da API do Google Gemini
- WhatsApp Web pode desconectar ocasionalmente
- **Linux**: Requer navegador compatível (Chrome/Chromium)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes. 