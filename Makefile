NAME = rolexak/http-proxy
VERSION = 1.0.0
ALIAS = http-proxy

.PHONY: docker_build docker_push docker_tag_latest docker_push_latest

docker_build:
	docker build -t $(NAME):$(VERSION) --rm .

docker_push:
	docker push $(NAME):$(VERSION)

docker_tag_latest:
	docker tag $(NAME):$(VERSION) $(NAME):latest

docker_push_latest:
	docker push $(NAME):latest