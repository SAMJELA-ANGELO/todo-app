# Use Node.js LTS version
FROM node:18-alpine

# create app directory

WORKDIR  /usr/src/app

# install app dependencies

COPY package*.json ./

RUN npm install

# copy app source

COPY . .


# Generate Prisma client

RUN npx prisma generate



# Build TypeScript

RUN npm run build



# Expose app port

EXPOSE 3000

# start the application server

CMD ["npm", "start"] 