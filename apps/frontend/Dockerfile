FROM node:20-alpine

WORKDIR /app/apps/frontend

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy package.json
COPY apps/frontend/package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY apps/frontend ./

EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]
