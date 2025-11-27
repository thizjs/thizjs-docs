# Project Structure

## Overview

When you create a THIZ.js project, you get a carefully organized directory structure designed for clarity and scalability. Every file and folder has a specific purpose.

## Generated Structure

```
my-api/
├── src/
│   ├── routes/
│   ├── middlewares/
│   ├── models/
│   ├── db/
│   ├── app.js
│   └── server.js
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## Root Directory Files

### `package.json`

Your project's manifest file containing dependencies and scripts.

**Key scripts:**
```json
{
  "scripts": {
    "dev": "thiz-dev",
    "start": "node src/server.js",
    "routes": "thiz-routes"
  }
}
```

- `npm run dev` - Development server with hot reload
- `npm start` - Production server
- `npm run routes` - Route inspector interface

### `.env.local`

Environment-specific configuration. This file is gitignored and contains sensitive data.

**Default contents:**
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=
```

Modify this file to change ports, database connections, or add API keys.

### `.gitignore`

Specifies files Git should ignore. Includes:
- `node_modules/`
- `.env`
- `*.log`

### `README.md`

Project documentation with setup instructions and API overview.

## Source Directory (`src/`)

All application code lives here.

### `src/routes/`

**Purpose:** File-based API endpoints

**Structure maps to URLs:**
```
src/routes/
├── GET.js                    # GET /
├── health/
│   └── GET.js                # GET /health
└── users/
    ├── GET.js                # GET /users
    ├── POST.js               # POST /users
    └── [id]/
        ├── GET.js            # GET /users/:id
        ├── PATCH.js          # PATCH /users/:id
        └── DELETE.js         # DELETE /users/:id
```

**File naming:**
- HTTP method determines the verb: `GET.js`, `POST.js`, `PUT.js`, `PATCH.js`, `DELETE.js`
- Folder names become URL segments
- `[param]` folders create dynamic routes (`:param`)

**Example route file:**
```javascript
// src/routes/users/GET.js
export default async (req, res) => {
  res.json({ users: [] });
};
```

### `src/middlewares/`

**Purpose:** Reusable middleware functions

**Structure:**
```
src/middlewares/
├── cors._global.js           # Applied to all routes
├── logger._global.js         # Applied to all routes
├── checkAuth.js              # Used selectively
└── validateInput.js          # Used selectively
```

**Naming conventions:**
- `._global.js` suffix: Runs automatically on every request
- Regular names: Applied explicitly in routes

**Global middleware example:**
```javascript
// src/middlewares/logger._global.js
export default (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};
```

**Named middleware example:**
```javascript
// src/middlewares/checkAuth.js
export default (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
```

### `src/models/`

**Purpose:** Database models and schemas

**Structure:**
```
src/models/
├── User.js
└── Product.js
```

The template includes a sample User model using Mongoose.

**Example model:**
```javascript
// src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
```

**Not using MongoDB?** Delete this folder.

### `src/db/`

**Purpose:** Database connection logic

### `src/app.js`

**Purpose:** Express application configuration

This file sets up middleware, registers routes, and configures Express.

**Common modifications:**
- Add global middleware (rate limiting, compression)
- Configure CORS options
- Register multiple route directories
- Add error handling middleware

### `src/server.js`

**Purpose:** HTTP server entry point

Separated from `app.js` for better testability.

**Common modifications:**
- Change default port
- Add graceful shutdown logic
- Configure HTTPS
- Add clustering for production

## Route File Structure

Each route file follows this pattern:

**Basic handler:**
```javascript
export default async (req, res) => {
  // Handler logic
};
```

**With middleware:**
```javascript
export const middlewares = ['checkAuth', 'validateInput'];

export default async (req, res) => {
  // Handler logic
};
```

**Skipping global middleware:**
```javascript
export const middlewares = ['!_global'];

export default async (req, res) => {
  // Handler logic
};
```

## Organizing for Scale

As your project grows, you can extend the structure:

### Feature-Based Organization

```
src/routes/
├── auth/
│   ├── login/POST.js
│   ├── register/POST.js
│   └── logout/POST.js
├── users/
│   └── [id]/
│       ├── GET.js
│       └── profile/GET.js
└── products/
    ├── GET.js
    └── [id]/GET.js
```

### Version-Based Organization

```
src/
├── v1/
│   ├── users/...
│   └── products/...
└── v2/
    ├── users/...
    └── products/...
```

Register each version:
```javascript
await registerRoutes(app, 'v1', { prefix: '/v1' });
await registerRoutes(app, 'v2', { prefix: '/v2' });
```

### Additional Directories

Add these as your project needs them:

**`src/utils/`** - Helper functions
```
src/utils/
├── validation.js
├── formatting.js
└── errors.js
```

**`src/services/`** - Business logic
```
src/services/
├── email.js
├── payment.js
└── storage.js
```

**`src/config/`** - Configuration objects
```
src/config/
├── database.js
├── auth.js
└── constants.js
```

## File Extensions

THIZ.js supports both JavaScript and TypeScript:

**JavaScript routes:**
```
src/routes/users/GET.js
```

**TypeScript routes:**
```
src/routes/users/GET.ts
```

**Important:** Cannot mix extensions for the same route. Choose `.js` OR `.ts` per endpoint.

## What's Optional

You can safely delete:

**MongoDB components:**
```bash
rm -rf src/db src/models
```

**Example middleware:**
```bash
rm src/middlewares/*
```

**Sample routes:**
```bash
rm src/routes/*
```

The framework continues working. Delete what you don't need.

## Best Practices

**1. Keep routes thin**

Move business logic to services or models. Routes should handle HTTP concerns only.

**2. Use consistent naming**

Follow the conventions: method files, middleware suffixes.

**3. Group related functionality**

Place related routes and middleware together.

**4. Document custom patterns**

Update README.md with project-specific conventions.

**5. Refactor early**

Don't let structure become messy. Reorganize as you grow.

## Structure Summary

**Essential files:**
- `src/app.js` - Express setup
- `src/server.js` - Server startup
- `src/routes/` - API endpoints
- `.env.local` - Configuration

**Optional files:**
- `src/middlewares/` - Reusable middleware
- `src/models/` - Database models
- `src/db/` - Database connection

**Configuration:**
- `package.json` - Dependencies and scripts
- `.env.local` - Environment variables

## Next Steps

Now that you understand the structure:

- File-Based Routing (see Core Concepts) - Learn routing conventions
- Middleware System (see Core Concepts) - Understand middleware flow
- Building Your First API (see Guides) - Create a complete CRUD API