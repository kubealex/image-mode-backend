FROM quay.io/kubealex/image-mode-baseos:latest

ARG DB_HOST=localhost

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/backend/
RUN cd /usr/share/train-tickets/backend && npm install --production

COPY src/ /usr/share/train-tickets/backend/src/

COPY usr/ /usr/

RUN mkdir -p /etc/train-tickets && echo "DB_HOST=${DB_HOST}" > /etc/train-tickets/backend.env

RUN systemctl enable train-tickets-backend.service

RUN firewall-offline-cmd --zone=public --add-port=3001/tcp
