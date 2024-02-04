FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "node", "index.js" ]
