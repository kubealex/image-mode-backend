# Image Mode - Backend

Express.js REST API for the Train Tickets booking application, packaged as a RHEL bootc image-mode container.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stations` | List all stations |
| `GET` | `/api/trains` | List trains (optional `?source_station_id=X&destination_station_id=Y`) |
| `GET` | `/api/timetable` | Full timetable with routes and station details |
| `GET/POST` | `/api/tickets` | List or create tickets |
| `GET/DELETE` | `/api/tickets/:id` | Get or delete a ticket |
| `GET` | `/api/health` | Health check (includes DB connectivity) |
| `GET` | `/api/schema` | Introspect public database schema |

## Configuration

### Container / Image Mode

Create `/etc/train-tickets/backend.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@db-hostname:5432/train_tickets
PORT=3001
```

The systemd service reads this file on startup. Values in this file override the defaults.

### Local Development

```bash
cd backend
npm install
DATABASE_URL=postgresql://postgres:postgres@your-db-host:5432/train_tickets npm start
```

### Defaults

| Variable | Default |
|----------|---------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/train_tickets` |
| `PORT` | `3001` |

## Build

```bash
podman build -t quay.io/kubealex/image-mode-backend:v1.1 .
```

With custom connection strings baked into the image:

```bash
podman build \
  --build-arg DATABASE_URL=postgresql://postgres:postgres@db.example.com:5432/train_tickets \
  --build-arg BACKEND_PORT=3001 \
  -t quay.io/kubealex/image-mode-backend:v1.1 .
```

| Build ARG | Default | Description |
|-----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/train_tickets` | PostgreSQL connection string |
| `BACKEND_PORT` | `3001` | API listen port |

Base image: `quay.io/kubealex/image-mode-baseos:latest`
