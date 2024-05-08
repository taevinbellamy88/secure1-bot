# Use the official Node.js 16 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/bot

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your bot's source code into the container
COPY . .

# Command to run your bot
CMD ["node", "src/index.js"]
