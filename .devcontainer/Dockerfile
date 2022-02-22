FROM debian:buster
USER root
RUN echo 'deb http://deb.debian.org/debian buster-backports main' > /etc/apt/sources.list.d/backports.list
# Prerequisites
RUN apt update && apt install -y curl git wget tree docker docker-compose git-flow vim nano build-essential
# Para acessar o docker por dentro do container
RUN groupmod -g 126 docker
# Setup new user
RUN useradd -ms /bin/bash developer
RUN usermod -aG docker developer
RUN newgrp docker 
USER developer
WORKDIR /home/developer
# install nodejs
RUN mkdir /home/developer/nvm
ENV NVM_DIR /home/developer/nvm
ENV NODE_VERSION 16.14.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH