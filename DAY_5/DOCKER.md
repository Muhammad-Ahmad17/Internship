 docker run -it <image>

    docker run -it ubuntu

    docker images

    docker image -ls 

    docker container ls

                     local:dockerdocker run -it -p 8080:80 -e key=val -e key=val <myimage>
    docker run -d -p 8080:80 nginx


	
# docker build -t <tag> <path>  .   // t = tag
# to come into the container
# docker exec -it eec3c20a bash  (eec3c20a{ignore higer part of the iddocker } is the container id)
# ls (you would find starting point of our app)
# cat index.js (to see the code)

push (not locally) on hub.docker.com
docker push mahmad17/docker_test:tagname

run
docker run -d -p 3000:3000 mahmad17/docker_test
machine port : docker port {which is declear in our app at app.listen}

to check all running containers
docker ps

to stop 
docker stop <name>


to check whats happening
docker logs b0fa23cce7b1 (id)