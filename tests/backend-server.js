const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'buklaki-backend-'));
const root = path.resolve(__dirname, '..');
const python = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
const manage = path.join(root, 'buklakithebackend/manage.py');
const env = { ...process.env, BUKLAKI_DB_PATH: path.join(directory, 'db.sqlite3') };
const migration = spawnSync(python, [manage, 'migrate', '--noinput'], { env, stdio: 'inherit' });
if (migration.status !== 0) {
  fs.rmSync(directory, { recursive: true, force: true });
  process.exit(migration.status || 1);
}
const backend = spawn(python, [manage, 'runserver', '127.0.0.1:8000', '--noreload'], { env, stdio: 'inherit' });
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => backend.kill(signal));
backend.on('close', code => {
  fs.rmSync(directory, { recursive: true, force: true });
  process.exit(code || 0);
});
