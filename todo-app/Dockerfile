FROM node:18 AS build

WORKDIR /app

COPY ./todo-app/package.json ./todo-app/package-lock.json ./

RUN npm install

COPY ./todo-app /app

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]