FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
ENV DOCKER_BUILD_ENV=debug_mode
RUN npm run build
ENV DOCKER_BUILD_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
