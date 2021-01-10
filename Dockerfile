FROM node:14.15.4

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["package*.json", "./"]
RUN npm install --production --silent && npm cache clean --force

# TODO Refactor and copy into one Layer
# Not using chown here as the user 'node' does not need to modify files
COPY ["dist", "./dist"]
COPY ["lib", "./lib"] 
COPY ["server.js", "./"]
COPY ["src", "./src"]

USER node
EXPOSE 8080
CMD ["node", "server.js"]
