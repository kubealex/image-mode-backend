# Image Mode - Backend

Express.js REST API for the Train Tickets booking application, packaged as a RHEL bootc image-mode container.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/stations` | List all stations |
| `GET` | `/api/trains` | List trains (optional `?source_station_id=X&destination_station_id=Y`) |
| `GET/POST` | `/api/tickets` | List or create tickets |
| `GET/DELETE` | `/api/tickets/:id` | Get or delete a ticket |
| `GET` | `/api/health` | Health check (includes DB connectivity) |
| `GET` | `/api/schema` | Introspect public database schema |

## Configuration

The database hostname is read from the `DB_HOST` environment variable (default: `localhost`). The app uses `dotenv` to load a `.env` file at startup.

### Container / Image Mode

The hostname is baked into the image at build time via a `.env` file. To override at runtime, create `/etc/train-tickets/backend.env`:

```env
DB_HOST=db-hostname
```

### Local Development

```bash
cd backend
npm install
DB_HOST=your-db-host npm start
```

### Defaults

| Variable | Default |
|----------|---------|
| `DB_HOST` | `localhost` |
| `PORT` | `3001` |

## Build

```bash
podman build -t quay.io/kubealex/image-mode-backend:v1.0 .
```

With a custom database hostname baked into the image:

```bash
podman build --build-arg DB_HOST=db.example.com \
  -t quay.io/kubealex/image-mode-backend:v1.0 .
```

| Build ARG | Default | Description |
|-----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL hostname |

Base image: `quay.io/kubealex/image-mode-baseos:latest`
