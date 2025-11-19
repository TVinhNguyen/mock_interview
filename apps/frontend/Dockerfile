FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Copy all workspace files
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Change to frontend directory
WORKDIR /app/apps/frontend

EXPOSE 3000

ENV PORT=3000

# Run Next.js dev server directly
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]
