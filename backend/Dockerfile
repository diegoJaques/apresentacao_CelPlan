FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Compilar TypeScript
RUN npm run build

# Copiar arquivos SQL para a pasta dist (não são copiados pelo TypeScript)
RUN cp -r src/db/*.sql dist/db/

# Expor porta
EXPOSE 3000

# Comando para iniciar (executa migração e depois inicia)
CMD ["sh", "-c", "npm run migrate && npm start"]
