FROM node:18

WORKDIR /use/src/app

# install dependencies
COPY package*.json ./
RUN npm install

# bundle app source
COPY . .

# run app
CMD ["node", "index.js"]