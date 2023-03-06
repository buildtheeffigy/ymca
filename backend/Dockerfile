FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8802
CMD ["npm", "start"]