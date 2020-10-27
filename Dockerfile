FROM node:latest
WORKDIR /app/
COPY package*.json /app/
COPY src /app/src/
COPY .env /app/
RUN cd /app && npm install
EXPOSE 5000
CMD ["npm", "run", "start"]
