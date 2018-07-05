FROM node:6.10-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git

COPY . /app-build
COPY . /app

WORKDIR /app-build/client
RUN yarn install
RUN yarn run build

WORKDIR /app
RUN rm -rf client && mkdir -p client/build
RUN cp -r /app-build/client/build/* client/build
RUN rm -rf /app-build
RUN yarn install --production

EXPOSE 10800
EXPOSE 10801
ENV REACT_APP_PROXY_WEBSOCKET_URL ws://localhost:10801
CMD [ "npm", "start" ]

ENV http_proxy ""
ENV https_proxy ""