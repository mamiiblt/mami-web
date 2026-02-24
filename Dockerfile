FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=development
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
