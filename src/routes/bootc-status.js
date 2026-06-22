const { Router } = require('express');

const router = Router();

const DB_HOST = process.env.DB_HOST || 'localhost';
const BOOTC_API_PORT = 8005;
const TIMEOUT_MS = 3000;

async function fetchBootcStatus(host) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const [bootedRes, updateRes] = await Promise.all([
      fetch(`http://${host}:${BOOTC_API_PORT}/api/v1/status/booted`, { signal: controller.signal }),
      fetch(`http://${host}:${BOOTC_API_PORT}/api/v1/status/update-available`, { signal: controller.signal }),
    ]);
    if (!bootedRes.ok) return null;
    const booted = await bootedRes.json();
    const update = updateRes.ok ? await updateRes.json() : null;
    return {
      image: booted.image?.image?.image || '',
      imageDigest: booted.image?.imageDigest || '',
      version: booted.image?.version || '',
      architecture: booted.image?.architecture || '',
      timestamp: booted.image?.timestamp || '',
      updateAvailable: update?.update_available || false,
      updateVersion: update?.update_version || null,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

router.get('/', async (req, res) => {
  const [backend, database] = await Promise.all([
    fetchBootcStatus('localhost'),
    fetchBootcStatus(DB_HOST),
  ]);
  res.json({ backend, database });
});

module.exports = router;
