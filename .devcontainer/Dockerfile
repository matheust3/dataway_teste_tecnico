FROM debian:buster
USER root
RUN echo 'deb http://deb.debian.org/debian buster-backports main' > /etc/apt/sources.list.d/backports.list
# Prerequisites
RUN apt update && apt install -y curl git wget tree docker docker-compose git-flow vim nano build-essential
# Puppeteer dependências
RUN apt update && apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev
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