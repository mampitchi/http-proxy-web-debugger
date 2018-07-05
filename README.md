# HTTP Proxy Web Debugger

## Usage
```
$ docker run --name http-proxy-web-debugger -d -p 10800:10800 -p 10801:10801 rolexak/http-proxy-web-debugger
``` 

## Development

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