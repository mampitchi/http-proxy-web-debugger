# HTTP Proxy Web Debugger

HTTP Proxy Web Debugger is a HTTP Proxy with Web Debugger. With this project you can debug or monitor your HTTP requests and share it with your colleguages on your internal web server. It is an web alternative to desktop apps like [Charles](https://www.charlesproxy.com/) or [Fiddler](https://www.telerik.com/fiddler).

It is built on [Node.js](https://nodejs.org/en/), [http-proxy](https://nodejs.org/en/), [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) and [React](https://reactjs.org/). You can run it locally with [Docker](https://www.docker.com/).

## Example
![Example of HTTP Proxy with Web Debugger](https://raw.githubusercontent.com/radoslavoleksak/http-proxy-web-debugger/master/resources/img/http-proxy-web-debugger.png)

## Usage
[Docker image on DockerHub](https://hub.docker.com/r/rolexak/http-proxy-web-debugger/)
```
$ docker run --name http-proxy-web-debugger -d -p 10800:10800 -p 10801:10801 rolexak/http-proxy-web-debugger
``` 

## Plans
1. HTTPS certs
2. Persist requests (Logstash, Kibana)

## Contribution
Send me your pull requests. You are welcome!

### Run Development
```
$ yarn install
$ yarn run dev
```

### Build Docker
```
$ yarn run docker_build
```

### Push Docker
```
$ yarn run docker_push
```

### Run Docker
```
$ yarn run docker_run
```