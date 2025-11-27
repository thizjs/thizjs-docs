---
sidebar_position: 5
---

# Hot Reload

## Overview

THIZ.js includes a development server with intelligent hot reload powered by `@thizjs/dev`. Change any file in your `src` directory, and your server restarts automatically in milliseconds.

No manual restarts. No stale state. No waiting.

## Starting the Development Server

Run the development server:

```bash
npm run dev
```

Expected output:

```
[THIZ] Starting development server...
[THIZ] Watching: src
[THIZ] Server started at http://localhost:5000
[THIZ] Ready for changes...
```

The server is now watching for file changes.

## How It Works

The hot reload system:

1. **Watches** your `src` directory using an efficient file watcher
2. **Detects** changes to `.js`, `.ts`, and `.json` files
3. **Debounces** rapid changes (waits 150ms after last change)
4. **Restarts** the server process gracefully
5. **Logs** each restart with clear timestamps

All of this happens automatically in the background.

## What Triggers Reload

Changes to these files trigger automatic restart:

**Route files:**
```
src/routes/users/GET.js
src/routes/products/[id]/PATCH.js
```

**Middleware files:**
```
src/middlewares/checkAuth.js
src/middlewares/logger._global.js
```

**Application files:**
```
src/app.js
src/server.js
```

**Model files:**
```
src/models/User.js
src/db/connection.js
```

**Any file in src/:**
```
src/utils/helper.js
src/services/email.js
src/config/database.js
```

## What Doesn't Trigger Reload

These files are ignored:

**node_modules:**
```
node_modules/
```

**Git files:**
```
.git/
```


## Watching the Reload Process

When you save a file, you'll see:

```
[THIZ] File changed: src/routes/users/GET.js
[THIZ] Restarting server...
[THIZ] Server stopped
[THIZ] Server started at http://localhost:5000
[THIZ] Ready for changes...
```

The entire process takes milliseconds.

## Debouncing

Hot reload includes intelligent debouncing. If you change multiple files rapidly, the server waits for all changes to complete before restarting.

**Without debouncing:**
```
Change file 1 → Restart
Change file 2 → Restart
Change file 3 → Restart
```
Three restarts for three changes.

**With debouncing:**
```
Change file 1 → Wait 150ms
Change file 2 → Reset timer, wait 150ms
Change file 3 → Reset timer, wait 150ms
No more changes → Restart once
```
One restart for three changes.

The default debounce is 150ms. You can customize this (see [Configuration](#configuration) below).

## Error Handling

### Syntax Errors

If you save a file with syntax errors:

```javascript
// src/routes/users/GET.js
export default (req res) => {  // Missing comma
  res.json({ users: [] });
};
```

The server shows the error but keeps running:

```
[THIZ] File changed: src/routes/users/GET.js
[THIZ] Restarting server...
[THIZ] Error: Unexpected token
    at src/routes/users/GET.js:1:24
[THIZ] Server failed to start, waiting for fixes...
```

Fix the error and save. The server restarts automatically.

### Runtime Errors

If your code has runtime errors:

```javascript
// src/routes/users/GET.js
export default async (req, res) => {
  const users = await db.users.find();  // db is undefined
  res.json({ users });
};
```

The server starts but crashes on request:

```
[THIZ] Server started at http://localhost:5000
[THIZ] Ready for changes...

# On request:
ReferenceError: db is not defined
    at src/routes/users/GET.js:2:21
```

The watcher detects the crash and restarts automatically.

## Configuration

### Custom Watch Directory

By default, `@thizjs/dev` watches the `src` directory. To watch a different directory, modify `package.json`:

```json
{
  "scripts": {
    "dev": "thiz-dev --watch app"
  }
}
```

Now it watches the `app` directory instead.

### Multiple Watch Directories

Watch multiple directories:

```json
{
  "scripts": {
    "dev": "thiz-dev --watch src,lib,config"
  }
}
```

Comma-separated, no spaces.

### Custom Entry Point

Change the server entry point:

```json
{
  "scripts": {
    "dev": "thiz-dev --entry src/index.js"
  }
}
```

### Programmatic Usage

For advanced control, use the API directly:

```javascript
// dev-server.js
import { createWatcher } from '@thizjs/dev';

const watcher = createWatcher({
  entry: 'src/server.js',
  watch: 'src',
  ignore: ['**/test/**', '**/*.test.js'],
  debounce: 200,
  verbose: true,
  nodeArgs: ['--inspect'],
  env: {
    NODE_ENV: 'development',
    DEBUG: 'app:*'
  }
});

watcher.start();
```

Run it:
```bash
node dev-server.js
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry` | string | `"src/server.js"` | Server entry file |
| `watch` | string or array | `"src"` | Directories to watch |
| `ignore` | array | `["**/node_modules/**", "**/.git/**"]` | Patterns to ignore |
| `debounce` | number | `150` | Milliseconds to wait before restart |
| `verbose` | boolean | `false` | Detailed logging |
| `nodeArgs` | array | `[]` | Arguments for Node.js |
| `env` | object | `{}` | Environment variables |

## Debugging with Hot Reload

Enable Node.js inspector:

```json
{
  "scripts": {
    "dev:debug": "thiz-dev --node-args='--inspect'"
  }
}
```

Run:
```bash
npm run dev:debug
```

Output:
```
Debugger listening on ws://127.0.0.1:9229/...
[THIZ] Server started at http://localhost:5000
```

Open Chrome DevTools to debug. The debugger reconnects after each hot reload.

## Performance

### Fast Restarts

`@thizjs/dev` is optimized for speed:

- Lightweight file watcher (chokidar)
- Minimal dependencies
- Efficient process management
- Smart debouncing

Typical restart time: 50-150ms

### Comparison

**nodemon (traditional):**
- Heavier dependencies
- Slower startup
- Generic file watching

**@thizjs/dev (THIZ.js):**
- Lightweight
- Faster restarts
- Built for THIZ.js workflows

## Hot Reload vs Auto Reload

**Auto Reload** (most tools):
- Restart entire process
- Lose all state
- Full re-initialization

**Hot Reload** (THIZ.js):
- Restart entire process (same as auto reload)
- Clean slate on each restart
- Predictable behavior

THIZ.js uses full process restarts rather than module hot swapping. This ensures:
- No stale modules
- Clean state
- Predictable behavior
- No memory leaks

The restart is so fast you won't notice the difference.

## Best Practices

**1. Save related files together**

Thanks to debouncing, you can save multiple files rapidly without triggering multiple restarts:

```bash
# Edit route
vim src/routes/users/GET.js
# Edit middleware
vim src/middlewares/checkAuth.js
# Save both quickly
```

One restart handles both changes.

**2. Use verbose mode for debugging**

When troubleshooting reload issues:

```javascript
createWatcher({
  verbose: true
});
```

Shows detailed information about file changes and restarts.

**3. Keep server startup fast**

Slow startup = slow hot reload. Avoid:
- Heavy database seeding on startup
- Long-running initialization
- Synchronous operations in server.js

Do initialization lazily or move it elsewhere.

**4. Watch only what you need**

Don't watch directories with frequent changes:

```javascript
createWatcher({
  watch: 'src',
  ignore: ['**/logs/**', '**/uploads/**']
});
```

Reduces unnecessary restarts.

## Troubleshooting

### Hot Reload Not Working

**Check file location:**
Ensure files are in the `src` directory:
```bash
ls src/routes/users/GET.js
```

**Check for syntax errors:**
Look for error messages in the terminal.

**Try manual restart:**
```bash
# Stop server
Ctrl+C

# Start again
npm run dev
```

### Too Many Restarts

**Likely cause:** File watcher detecting unwanted changes

**Solution:** Add to ignore list

```javascript
createWatcher({
  ignore: [
    '**/node_modules/**',
    '**/.git/**',
    '**/logs/**',
    '**/uploads/**'
  ]
});
```

### Slow Restarts

**Likely cause:** Heavy initialization in server.js

**Solution:** Move slow operations out of startup:

```javascript
// Bad - runs on every restart
import heavyModule from './heavy-module.js';
heavyModule.initialize();

// Good - load lazily
let heavyModule;
app.get('/heavy', async (req, res) => {
  if (!heavyModule) {
    heavyModule = await import('./heavy-module.js');
  }
  res.json({ data: heavyModule.getData() });
});
```

## Production Mode

Hot reload is for development only. In production:

```bash
npm start
```

This runs:
```bash
node src/server.js
```

No file watching, no hot reload, just the server running normally.

## Next Steps

- Learn about [Environment Variables](./env.md) (also hot-reloadable)
- Explore [File-Based Routing](./file-based-routing.md)
- Check out the [Route Inspector](./route-inspector.md)