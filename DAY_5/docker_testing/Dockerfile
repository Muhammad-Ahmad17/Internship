
from ubuntu

run apt-get update
run apt-get install -y curl     
run curl -sL https://deb.nodesource.com/setup_18.x | bash -
run apt-get upgrade -y
run apt-get install -y nodejs

copy package.json package.json
copy package-lock.json package-lock.json
copy index.js index.js 
# sourse : destination

run npm install

entrypoint [ "node", "index.js" ]


# Test with:
# docker run -d -p 3000:3000 mahmad17/docker_test