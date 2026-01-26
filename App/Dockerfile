FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install yarn globally
RUN npm install -g yarn@latest

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Create dist directory
RUN mkdir -p dist

# Expose ports
EXPOSE 3000 8080

# Default command
CMD ["yarn", "dev"]
