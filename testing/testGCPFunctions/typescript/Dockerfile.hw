# syntax = edrevo/dockerfile-plus
INCLUDE+ Dockerfile.base

FROM node:10
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/build ./build
COPY package.json package*.json ./
RUN npm install --only=production
EXPOSE 8080
CMD [ "npm", "start" ]
