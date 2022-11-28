FROM node as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - the production environment
FROM node
COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
WORKDIR /app
RUN npm install --only=production
EXPOSE 5000
CMD ["npm", "start"]
