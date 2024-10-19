FROM node:lts-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port 
EXPOSE 3000

# Run the integration tests
CMD ["npm", "run", "test:integration"]