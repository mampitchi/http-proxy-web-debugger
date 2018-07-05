# HTTP Proxy Web Debugger

HTTP Proxy Web Debugger is HTTP Proxy with Web Monitor. With this project you can debug or monitor your HTTP requests and share it with your colleguages on your internal web server. It is an web alternative to desktop apps like Charles or Fiddler.

It is built on Node.js, http-proxy npm module, WebSockets and React. You can run it locally with Docker.

## Example
![Example of HTTP Proxy with Web Monitor](https://raw.githubusercontent.com/radoslavoleksak/http-proxy-web-debugger/master/resources/img/http-proxy-web-debugger.png)

## Usage
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