NAME = rolexak/http-proxy-web-debugger
VERSION = 0.1.0
ALIAS = http-proxy-web-debugger

.PHONY: docker_build docker_push docker_tag_latest docker_push_latest docker_run

docker_build:
	docker build -t $(NAME):$(VERSION) --rm .

docker_push:
	docker push $(NAME):$(VERSION)

docker_tag_latest:
	docker tag $(NAME):$(VERSION) $(NAME):latest

docker_push_latest:
	docker push $(NAME):latest

docker_run:
	docker run --name $(ALIAS) -d -p 10800:10800 -p 10801:10801 $(NAME):$(VERSION)