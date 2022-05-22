NAME=motojouya/kniw
VERSION=latest

build:
	docker build -t $(NAME):$(VERSION) .

restart: stop start

hostdir=`pwd`

start:
	docker run -itd \
        -v $(hostdir):/srv \
        $(NAME):$(VERSION) bash
#       --name $(NAME) \

contener=`docker ps -q`
image=`docker images | awk '/^<none>/ { print $$3 }'`

clean:
	@if [ "$(image)" != "" ] ; then \
	    docker rmi $(image); \
	fi
	@if [ "$(contener)" != "" ] ; then \
	    docker rm $(contener); \
	fi

stop:
	docker rm -f $(contener)

attach:
	docker exec -it $(contener) bash

logs:
	docker logs $(contener)

# command:
# 	docker exec -it $(contener) bash

