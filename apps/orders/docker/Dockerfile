# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts

################################################################################
# Base image
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app/orders .

################################################################################
FROM base AS production

COPY ./package.json .
COPY ./package-lock.json .

COPY . .

# Expose port 3000
EXPOSE 3000

CMD ["npm", "start"]

################################################################################
# Development stage
FROM base AS development

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

COPY . .

# Use development node environment by default.
ENV NODE_ENV=development

# Expose port for development server
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]

################################################################################
# Test target
FROM base as test
ENV NODE_ENV=test
CMD ["npm", "test"]