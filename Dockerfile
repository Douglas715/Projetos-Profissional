FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci && npx prisma generate
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
EXPOSE 3000
CMD ["npm", "start"]
