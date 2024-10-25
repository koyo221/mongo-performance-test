# Use the official Node.js image as the base image
FROM node:latest

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the application code into the container
COPY . .

# Install the necessary dependencies
RUN npm install

# Set the default command to run the application
CMD ["node", "app.js"]
