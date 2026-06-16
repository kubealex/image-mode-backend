FROM quay.io/kubealex/image-mode-baseos:latest

ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/train_tickets
ARG BACKEND_PORT=3001

RUN dnf install -y nodejs npm && dnf clean all

COPY package.json package-lock.json* /usr/share/train-tickets/backend/
RUN cd /usr/share/train-tickets/backend && npm install --production

COPY src/ /usr/share/train-tickets/backend/src/

COPY usr/ /usr/

RUN sed -i "s|Environment=DATABASE_URL=.*|Environment=DATABASE_URL=${DATABASE_URL}|" \
    /usr/lib/systemd/system/train-tickets-backend.service && \
    sed -i "s|Environment=PORT=.*|Environment=PORT=${BACKEND_PORT}|" \
    /usr/lib/systemd/system/train-tickets-backend.service

RUN systemctl enable train-tickets-backend.service
