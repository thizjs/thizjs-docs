---
sidebar_position: 2
---

# Configuration Options

THIZ.js follows a zero-config philosophy, but when you need customization, these options are available.

## @thizjs/express

The core routing engine. Configure it in your `app.js` or `server.js`.

### registerRoutes()

Registers file-based routes to an Express app.

```javascript
import { registerRoutes } from '@thizjs/express';

await registerRoutes(app, routesDir, options);
```

#### Parameters

**app** (required)
- Type: `Express`
- Your Express application instance

**routesDir** (optional)
- Type: `string`
- Default: `"routes"`
- Folder name inside `src/` containing route files
- Example: `"routes"`, `"api"`, `"v2"`

**options** (optional)
- Type: `object`
- Configuration object with the following properties:

##### options.prefix

- Type: `string`
- Default: `""`
- URL prefix for all routes in this directory

**Example:**
```javascript
await registerRoutes(app, 'routes', { prefix: '/api' });
// Routes from src/routes/ will be prefixed with /api
```

##### options.strict

- Type: `boolean`
- Default: `false`
- Throw errors on dynamic route conflicts instead of warnings

**Example conflict:**
```
routes/
└── product/
    ├── [id]/GET.js      → GET /product/:id
    └── [slug]/GET.js    → GET /product/:slug
```

Both resolve to `GET /product/:param`, causing a conflict.

- **strict: false** — Logs warning, uses first route found
- **strict: true** — Throws error, stops server startup

**Example:**
```javascript
await registerRoutes(app, 'routes', { strict: true });
```

### Multiple Route Directories

Organize routes by feature, version, or domain:

```javascript
import express from 'express';
import { registerRoutes } from '@thizjs/express';

const app = express();

// Public API routes
await registerRoutes(app, 'routes', { prefix: '' });

// Admin routes with /api prefix
await registerRoutes(app, 'api', { prefix: '/api' });

// V2 API routes
await registerRoutes(app, 'v2', { prefix: '/v2' });

app.listen(3000);
```

**Folder structure:**
```
src/
├── routes/    → /product, /user
├── api/       → /api/admin, /api/settings
└── v2/        → /v2/product, /v2/user
```

---

## @thizjs/dev

The development server. Configure it programmatically or use defaults.

### createWatcher()

Creates a file watcher for hot-reloading your server.

```javascript
import { createWatcher } from '@thizjs/dev';

const watcher = createWatcher(options);
watcher.start();
```

#### Options

##### entry

- Type: `string`
- Default: `"src/server.js"`
- Path to your server entry file

**Example:**
```javascript
createWatcher({
  entry: 'src/index.js',
}).start();
```

##### watch

- Type: `string | string[]`
- Default: `"src"`
- Paths or glob patterns to watch for changes

**Example:**
```javascript
createWatcher({
  watch: ['src', 'config', 'lib'],
}).start();
```

##### ignore

- Type: `string[]`
- Default: `["**/node_modules/**", "**/.git/**"]`
- Patterns to ignore when watching

**Example:**
```javascript
createWatcher({
  ignore: ['**/node_modules/**', '**/.git/**', '**/test/**'],
}).start();
```

##### nodeArgs

- Type: `string[]`
- Default: `[]`
- Arguments to pass to the Node.js process

**Example:**
```javascript
createWatcher({
  nodeArgs: ['--inspect', '--enable-source-maps'],
}).start();
```

##### env

- Type: `object`
- Default: `{}`
- Environment variables for the child process

**Example:**
```javascript
createWatcher({
  env: {
    NODE_ENV: 'development',
    PORT: 3000,
    DEBUG: 'app:*',
  },
}).start();
```

##### debounce

- Type: `number`
- Default: `150`
- Milliseconds to wait before restarting after file changes
- Prevents restart spam during rapid file saves

**Example:**
```javascript
createWatcher({
  debounce: 300, // Wait 300ms instead of 150ms
}).start();
```

##### verbose

- Type: `boolean`
- Default: `false`
- Enable detailed logging for debugging

**Example:**
```javascript
createWatcher({
  verbose: true,
}).start();
```

### Methods

**watcher.start()**
- Starts the file watcher and server

**watcher.stop()**
- Returns: `Promise<void>`
- Stops the watcher and kills the server process

**watcher.restart()**
- Manually triggers a server restart

**Example:**
```javascript
const watcher = createWatcher();

watcher.start();

// Later...
watcher.restart(); // Manual restart

// When done...
await watcher.stop();
```

---

## Environment Variables

THIZ.js automatically loads environment variables from multiple `.env` files with smart priority.

### Supported Files

Files are loaded in priority order (highest to lowest):

1. `.env.local` — Local overrides, gitignored
2. `.env.development` — Development-specific variables
3. `.env` — Base environment variables

### Hot-Reload

Edit `.env` files while developing and your server automatically restarts with the new values. No manual restart needed.

### Example Setup

**`.env`** (committed to git):
```bash
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
```

**`.env.local`** (gitignored):
```bash
# Override port for local development
PORT=3000

# Local database
MONGO_URI=mongodb://localhost:27017/myapp_local

# Personal API keys
OPENAI_API_KEY=sk-...
```

---

## TypeScript Configuration

THIZ.js supports TypeScript out of the box with zero configuration.

### Requirements

Install type definitions:
```bash
npm install -D @types/express @types/node
```

For native `.ts` route files:
```bash
npm install -D tsx
```

### Usage

Write routes in TypeScript:
```typescript
// src/routes/product/GET.ts
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.json({ products: [] });
};
```

Hot reload works with `.ts` files automatically.

### Important Notes

- Cannot mix extensions: Choose either `.js` OR `.ts` for each route (not both)
- TypeScript is optional: JavaScript-only projects work without any extra dependencies
- Graceful fallback: Clear error messages if `.ts` files are used without `tsx` installed

---

## MongoDB Configuration

MongoDB is included in generated projects but completely optional.

### Using MongoDB

1. Add your `MONGO_URI` to `.env`:
```bash
MONGO_URI=mongodb://localhost:27017/myapp
```

2. Connection happens automatically in `src/db/connection.js`

3. Use the example models in `src/models/`

### Skipping MongoDB

Remove the database-related folders:
```bash
rm -rf src/db src/models
```

Everything else works perfectly without it.

---

## Deployment Configuration

The generated app works on any Node.js hosting platform.

### Supported Platforms

- Vercel
- Railway
- Render
- Heroku
- Fly.io
- DigitalOcean App Platform

### Deployment Steps

1. Set environment variables through your platform's dashboard
2. Run:
```bash
npm install
npm start
```

That's it. No special build steps needed.

---

## Convention Rules

These aren't options you configure, but conventions the framework expects:

### Route Files

1. Location: `src/<routesDir>/` (e.g., `src/routes/`)
2. Method files: `GET.js`, `POST.js`, `PUT.js`, `PATCH.js`, `DELETE.js` (case-insensitive)
3. Dynamic segments: `[param]` folders create `:param` URL parameters
4. Handler export: Must use `export default` with a function
5. File extensions: Use `.js` or `.ts` (requires `tsx` for TypeScript)
6. Cannot have both `.js` and `.ts` for the same route

### Middleware Files

1. Location: `src/middlewares/`
2. Global middlewares: Add `._global.js` suffix (e.g., `cors._global.js`)
3. Named middlewares: Standard filenames (e.g., `checkAuth.js`)
4. Export: Must use `export default` with middleware function

---

## Advanced Patterns

### Multiple API Versions

```javascript
await registerRoutes(app, 'v1', { prefix: '/v1' });
await registerRoutes(app, 'v2', { prefix: '/v2' });
```

### Incremental Migration

Keep legacy routes while adding new file-based ones:

```javascript
import legacyRoutes from './legacy-routes.js';

app.use('/legacy', legacyRoutes);
await registerRoutes(app, 'new-routes', { prefix: '/v2' });
```

### Custom Dev Server

```javascript
import { createWatcher } from '@thizjs/dev';

createWatcher({
  entry: 'src/app.js',
  watch: ['src', 'lib'],
  nodeArgs: ['--inspect'],
  env: { DEBUG: '*' },
  debounce: 200,
}).start();
```

---

## Next Steps

- Learn about [CLI commands](./cli-commands.md)
- Explore [File Based Routing](./../core-features/file-based-routing.md)
- Set up [Middlewares](./../core-features/middlewares.md)