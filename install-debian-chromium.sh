#!/bin/bash

echo "🚀 Instalando dependências para WhatsApp Bot no Debian (Chromium)..."
echo ""

# Atualizar repositórios
echo "📦 Atualizando repositórios..."
sudo apt update

# Instalar dependências do sistema
echo "🔧 Instalando dependências do sistema..."
sudo apt install -y \
    chromium \
    xvfb \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libxshmfence1

# Verificar se o Chromium foi instalado
if command -v chromium &> /dev/null; then
    echo "✅ Chromium instalado com sucesso"
    echo "📍 Caminho: $(which chromium)"
    
    # Criar link simbólico para google-chrome (compatibilidade)
    if [ ! -f /usr/bin/google-chrome ]; then
        echo "🔗 Criando link simbólico para compatibilidade..."
        sudo ln -sf $(which chromium) /usr/bin/google-chrome
        echo "✅ Link simbólico criado: /usr/bin/google-chrome -> $(which chromium)"
    fi
else
    echo "❌ Falha ao instalar Chromium"
    exit 1
fi

# Instalar Node.js se não estiver instalado
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "✅ Node.js já está instalado: $(node --version)"
fi

# Verificar versão do Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js instalado: $(node --version)"
    echo "✅ NPM instalado: $(npm --version)"
else
    echo "❌ Falha ao instalar Node.js"
    exit 1
fi

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o arquivo .env com sua chave da API Gemini"
echo "2. Execute: npm install"
echo "3. Execute: npm start"
echo ""
echo "🔧 Configuração automática do .env:"
echo "   PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome"
echo "   (será configurado automaticamente)"
echo ""
echo "💡 Este script usa Chromium que é mais leve e nativo do Debian" 