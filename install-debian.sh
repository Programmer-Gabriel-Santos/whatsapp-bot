#!/bin/bash

echo "🚀 Instalando dependências para WhatsApp Bot no Debian..."
echo ""

# Atualizar repositórios
echo "📦 Atualizando repositórios..."
sudo apt update

# Instalar dependências do sistema
echo "🔧 Instalando dependências do sistema..."
sudo apt install -y \
    wget \
    gnupg \
    ca-certificates \
    curl \
    unzip \
    xvfb \
    libxss1 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libxshmfence1

# Instalar Google Chrome (alternativa ao Chromium)
echo "🌐 Instalando Google Chrome..."
if ! command -v google-chrome &> /dev/null; then
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt update
    sudo apt install -y google-chrome-stable
else
    echo "✅ Google Chrome já está instalado"
fi

# Verificar se o Chrome foi instalado
if command -v google-chrome &> /dev/null; then
    echo "✅ Google Chrome instalado com sucesso"
    echo "📍 Caminho: $(which google-chrome)"
else
    echo "❌ Falha ao instalar Google Chrome"
    echo "💡 Tentando instalar Chromium como alternativa..."
    sudo apt install -y chromium
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
echo "🔧 Se ainda houver problemas, tente:"
echo "   - Verificar se o Chrome/Chromium está funcionando"
echo "   - Ajustar as configurações no arquivo .env"
echo "   - Verificar logs de erro" 