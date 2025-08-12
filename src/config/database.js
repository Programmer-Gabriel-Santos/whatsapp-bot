const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.dbPath = process.env.DB_PATH || './database/messages.db';
        this.ensureDatabaseDirectory();
        this.db = null;
    }

    ensureDatabaseDirectory() {
        const dir = path.dirname(this.dbPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Erro ao conectar ao banco:', err.message);
                    reject(err);
                } else {
                    console.log('Conectado ao banco SQLite');
                    this.createTables().then(resolve).catch(reject);
                }
            });
        });
    }

    async createTables() {
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_number TEXT NOT NULL,
                from_name TEXT,
                message_text TEXT NOT NULL,
                message_type TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                gemini_response TEXT,
                response_sent BOOLEAN DEFAULT FALSE
            )
        `;

        return new Promise((resolve, reject) => {
            this.db.run(createTableSQL, (err) => {
                if (err) {
                    console.error('Erro ao criar tabela:', err.message);
                    reject(err);
                } else {
                    console.log('Tabela de mensagens criada/verificada');
                    resolve();
                }
            });
        });
    }

    async saveMessage(messageData) {
        const sql = `
            INSERT INTO messages (from_number, from_name, message_text, message_type)
            VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [
                messageData.fromNumber,
                messageData.fromName,
                messageData.text,
                messageData.type
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    async updateGeminiResponse(messageId, response) {
        const sql = `
            UPDATE messages 
            SET gemini_response = ?, response_sent = TRUE
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [response, messageId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = Database; 