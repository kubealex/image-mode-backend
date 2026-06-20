const { Router } = require('express');
const { readFile } = require('fs/promises');
const { execFile } = require('child_process');

const router = Router();

function parseOsRelease(content) {
  const vals = {};
  for (const line of content.split('\n')) {
    const m = line.match(/^(\w+)=(.*)$/);
    if (!m) continue;
    vals[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return {
    name: vals.NAME || '',
    version: vals.VERSION_ID || '',
    pretty: vals.PRETTY_NAME || '',
  };
}

function getBootcStatus() {
  return new Promise((resolve) => {
    execFile('bootc', ['status', '--json'], (err, stdout) => {
      if (err) return resolve(null);
      try {
        const data = JSON.parse(stdout);
        const booted = data.status?.booted;
        if (!booted) return resolve(null);
        resolve({
          image: booted.image?.image?.image || '',
          imageDigest: booted.image?.imageDigest || '',
          version: booted.image?.version || '',
          timestamp: booted.image?.timestamp || '',
          updateAvailable: booted.cachedUpdate !== null,
        });
      } catch {
        resolve(null);
      }
    });
  });
}

router.get('/', async (req, res) => {
  let os = { name: '', version: '', pretty: '' };
  try {
    const content = await readFile('/etc/os-release', 'utf8');
    os = parseOsRelease(content);
  } catch {}

  const bootc = await getBootcStatus();

  res.json({ os, bootc });
});

module.exports = router;
