FROM node:20-alpine

WORKDIR ./

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

RUN ["npm", "run", "build"]

CMD ["npm", "run", "start"]