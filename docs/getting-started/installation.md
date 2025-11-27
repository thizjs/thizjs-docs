---
sidebar_position: 2
---

# Installation

## Prerequisites

Before installing THIZ.js, ensure you have:

- Node.js version 16 or higher
- npm version 7 or higher (or equivalent package manager)

Verify your installation:

```bash
node --version
npm --version
```

## Quick Start

Create a new THIZ.js project with one command:

```bash
npx create-thiz-app my-api
cd my-api
npm run dev
```

Your API is now running at `http://localhost:5000`.

## Installation Methods

### Using NPX (Recommended)

The simplest way to create a new project:

```bash
npx create-thiz-app my-project-name
```

**What happens:**
1. Creates directory `my-project-name`
2. Copies the THIZ.js template
3. Updates `package.json` with your project name
4. Generates `.env.local` from `.env.example`
5. Installs all dependencies automatically
6. Shows next steps

**Advantages:**
- No global packages to manage
- Always uses the latest version
- Works immediately

### Global Installation

Install the CLI globally for repeated use:

```bash
npm install -g create-thiz-app
create-thiz-app my-project-name
```

Useful if you create THIZ.js projects frequently.

### Adding to Existing Projects

Already have an Express app? Add file-based routing without starting over:

```bash
npm install @thizjs/express
```

Update your Express setup:

```javascript
import express from 'express';
import { registerRoutes } from '@thizjs/express';

const app = express();
app.use(express.json());

// Your existing routes
app.get('/legacy', (req, res) => {
  res.json({ message: 'Old route' });
});

// Add file-based routing
await registerRoutes(app, 'routes', { prefix: '' });

app.listen(3000);
```

Create a `src/routes/` directory and start adding file-based routes. Both routing styles coexist peacefully.

## What Gets Installed

A new THIZ.js project includes:

**Core Dependencies:**
- `express` - Web framework
- `@thizjs/express` - File-based routing engine
- `cors` - CORS middleware
- `morgan` - HTTP request logger

**Development Dependencies:**
- `@thizjs/dev` - Hot-reload server
- `tsx` - TypeScript execution support

**Optional Dependencies:**
- `mongoose` - MongoDB ODM (removable if not needed)

## Installation Output

When you create a project, you'll see:

```bash
$ npx create-thiz-app my-api

Creating a new THIZ.js app in /Users/you/my-api

✓ Created project directory
✓ Copied template files
✓ Updated package.json
✓ Generated .env.local from .env.example
✓ Installing dependencies...

Success! Created my-api at /Users/you/my-api

Commands:
  npm run dev      Start development server
  npm start        Run in production mode
  npm run routes   Open route inspector

Get started:
  cd my-api
  npm run dev
```

## Starting the Development Server

Navigate to your project and start developing:

```bash
cd my-api
npm run dev
```

Expected output:

```
[THIZ] Starting development server...
[THIZ] Watching: src
[THIZ] Server started at http://localhost:5000
[THIZ] Ready for changes...
```

## Verifying the Installation

Test that everything works:

**1. Check the server:**
```bash
curl http://localhost:5000
```

You should receive a JSON response.

**2. Test hot reload:**
- Open `src/routes/GET.js`
- Change the response message
- Save the file
- Watch the terminal for automatic restart

**3. View routes:**
```bash
npm run routes
```

Opens the route inspector at `http://localhost:3456`.

## TypeScript Support

THIZ.js supports TypeScript out of the box. No additional configuration required.

**Using TypeScript:**

Write route files with `.ts` extension:

```typescript
// src/routes/users/GET.ts
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  res.json({ users: [] });
};
```

**Install type definitions (recommended):**

```bash
npm install -D @types/express @types/node
```

**Important:** You cannot mix `.js` and `.ts` for the same route. Choose one extension per route.

## MongoDB Setup

MongoDB support is included but optional.

**To use MongoDB:**

1. Add connection string to `.env`:
```bash
MONGO_URI=mongodb://localhost:27017/myapp
```

2. The connection happens automatically on server start

3. Use the example models in `src/models/`

**To skip MongoDB:**

```bash
rm -rf src/db src/models
```

Remove the database import from `src/app.js`:

```javascript
// Delete this line:
import './db/connection.js';
```

Everything else works without modification.

## Environment Configuration

The generated project uses environment variables for configuration.

**Default `.env` contents:**

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/myapp
```

**Changing the port:**

Edit `.env`:
```bash
PORT=3000
```

Or override temporarily:
```bash
PORT=3000 npm run dev
```

## Package Manager Alternatives

THIZ.js works with npm, yarn, and pnpm.

**Using Yarn:**
```bash
npx create-thiz-app my-api
cd my-api
yarn dev
```

**Using pnpm:**
```bash
npx create-thiz-app my-api
cd my-api
pnpm dev
```

The CLI detects your package manager automatically.

## Troubleshooting

### Port Already in Use

Error: `EADDRINUSE: address already in use`

**Solution:** Change the port in `.env`

```bash
PORT=3000
```

### Permission Errors

Error during NPX execution

**Solution:** Clear NPX cache

```bash
npx clear-npx-cache
npx create-thiz-app my-api
```

### Module Not Found

Error: `Cannot find module`

**Solution:** Reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working

Changes don't trigger restart

**Solution:** Check these:
1. Files are in the `src` directory
2. No syntax errors in code
3. Try manual restart: `Ctrl+C` then `npm run dev`

### TypeScript Files Not Loading

Error loading `.ts` routes

**Solution:** Ensure `tsx` is installed

```bash
npm install -D tsx
```

### Mongoose Connection Errors

Cannot connect to MongoDB

**Solution:** Verify MongoDB is running

```bash
# Check if MongoDB is running
mongosh

# Or start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

## Development vs Production

**Development mode:**
```bash
npm run dev
```
- Hot reload enabled
- Detailed logging
- Source maps active

**Production mode:**
```bash
npm start
```
- No hot reload
- Minimal logging
- Optimized for performance

## Updating THIZ.js

To update to the latest version:

**For new projects:**
```bash
npx create-thiz-app@latest my-new-api
```

**For existing projects:**
```bash
npm update @thizjs/express @thizjs/dev
```

## Next Steps

Installation complete. What's next?

- [Project Structure](./project-structure.md) - Understand the generated files
- [File-Based Routing](./../core-features/file-based-routing) - Create your first routes
- [Middleware System](./../core-features/middlewares.md) - Add authentication

## Getting Help

Stuck? Resources available:

- GitHub Issues: Report bugs or request features
- GitHub Discussions: Ask questions
- Documentation: Comprehensive guides in the docs folder