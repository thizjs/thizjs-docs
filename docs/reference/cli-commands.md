---
sidebar_position: 1
---

# CLI Commands

Complete reference for all command-line tools in the THIZ.js ecosystem.

## create-thiz-app

Scaffold new Express APIs with file-based routing.

### Installation

**NPX (Recommended)**
```bash
npx create-thiz-app my-project-name
```

**Global Install**
```bash
npm install -g create-thiz-app
create-thiz-app my-project-name
```

### What It Does

1. Creates project directory
2. Copies the THIZ.js Express template
3. Updates `package.json` with your project name
4. Generates `.env` from `.env.example`
5. Installs all dependencies automatically
6. Shows you exactly what to do next

### Usage

```bash
npx create-thiz-app <project-name>
cd <project-name>
npm run dev
```

No flags, no options, no configuration. Just a project name and you're done.

---

## Project Commands

Once your project is generated, these commands are available:

### Development Server

```bash
npm run dev
```

Starts the development server with hot reload enabled. Changes to your code automatically restart the server.

**Default behavior:**
- Watches the `src` directory
- Runs `src/server.js` as the entry point
- Restarts on file changes
- Applies 150ms debounce to avoid restart spam

### Production Server

```bash
npm start
```

Runs the server in production mode. No hot reload, no file watching. Just your server running as-is.

### Route Inspector

```bash
npm run routes
```

Launches the built-in route inspector at `http://localhost:3456`.

**What it shows:**
- Total routes count
- HTTP methods breakdown
- Middleware overview (global and named)
- Complete route table with endpoints, methods, middlewares, and source files

Perfect for debugging routing issues, documenting your API, or onboarding new team members.

---

## @thizjs/dev

The development runtime powering the `npm run dev` command.

### Command Line Usage

**Direct usage:**
```bash
npx thiz-dev
```

**Default behavior:**
- Entry point: `src/server.js`
- Watch directory: `src`
- Ignore patterns: `**/node_modules/**`, `**/.git/**`
- Debounce: 150ms

### Programmatic API

For advanced use cases, import and configure the watcher directly:

```javascript
import { createWatcher } from '@thizjs/dev';

const watcher = createWatcher({
  entry: 'src/server.js',
  watch: 'src',
  ignore: ['**/node_modules/**'],
  nodeArgs: ['--enable-source-maps'],
  env: { PORT: 3000 },
  debounce: 150,
  verbose: false,
});

watcher.start();

// Manual control
watcher.restart();
await watcher.stop();
```

### Examples

**Watch multiple directories:**
```javascript
createWatcher({
  watch: ['src', 'config', 'lib'],
}).start();
```

**Enable debugging:**
```javascript
createWatcher({
  nodeArgs: ['--inspect'],
  verbose: true,
}).start();
```

**Custom environment:**
```javascript
createWatcher({
  env: {
    NODE_ENV: 'development',
    DEBUG: 'app:*',
  },
}).start();
```

---

## Common Workflows

### Starting Fresh

```bash
npx create-thiz-app my-api
cd my-api
npm run dev
```

### Inspecting Routes

```bash
npm run routes
```

Visit `http://localhost:3456` to see your API structure.

### Deploying to Production

```bash
npm install
npm start
```

Set environment variables through your hosting platform's dashboard.

---

## Next Steps

- Learn about [Configuration options](./config-options.md)
- Explore [File Based Routing](./../core-features/file-based-routing.md)
- Set up [Middlewares](./../core-features/middlewares.md) 