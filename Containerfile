FROM quay.io/kubealex/image-mode-baseos:latest

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/backend/
RUN cd /usr/share/train-tickets/backend && npm install --production

COPY src/ /usr/share/train-tickets/backend/src/

COPY usr/ /usr/

RUN systemctl enable train-tickets-backend.service
