---
sidebar_position: 2
---

# Middleware System

## Overview

THIZ.js includes a convention-based middleware system that eliminates manual middleware registration. Drop middleware files in a folder, and they apply automatically based on naming conventions.

## Middleware Types

THIZ.js supports two types of middleware:

**Global Middleware** - Applied to all routes automatically.

**Named Middleware** - Applied to specific routes on demand

## Global Middleware

### Creating Global Middleware

Add `._global.js` or `._global.ts` suffix to make middleware apply to all routes:

```
src/middlewares/
├── cors._global.js
├── logger._global.js
└── rateLimit._global.js
```

These run automatically on every request. No configuration needed.

### Example Global Middleware

**Request logger:**
```javascript
// src/middlewares/logger._global.js
export default (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
};
```

**IP logging:**
```javascript
// src/middlewares/logIP._global.js
export default (req, res, next) => {
  console.log(`Request from ${req.ip}`);
  next();
};
```

### Execution Order

Global middleware executes in alphabetical order by filename:

```
src/middlewares/
├── a_first._global.js      # Runs first
├── cors._global.js         # Runs second
└── z_last._global.js       # Runs last
```

Name your files strategically if order matters.

## Named Middleware

### Creating Named Middleware

Create middleware without the `._global.js` suffix:

```
src/middlewares/
├── checkAuth.js
├── checkRole.js
└── validateInput.js
```

These only run when explicitly specified in routes.

### Example Named Middleware

**Authentication check:**
```javascript
// src/middlewares/checkAuth.js
export default (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

**Role verification:**
```javascript
// src/middlewares/checkRole.js
export default (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

**Input validation:**
```javascript
// src/middlewares/validateProduct.js
export default (req, res, next) => {
  const { name, price } = req.body;
  
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid product name' });
  }
  
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Invalid product price' });
  }
  
  next();
};
```

## Using Middleware in Routes

### Basic Usage

Export a `middlewares` array from your route file:

```javascript
// src/routes/admin/users/DELETE.js
export const middlewares = ['checkAuth', 'checkRole'];

export default async (req, res) => {
  // Only runs if checkAuth and checkRole pass
  await db.users.delete(req.params.id);
  res.json({ message: 'User deleted' });
};
```

### With Global Middleware

By default, global middleware runs before named middleware:

```javascript
// src/routes/products/POST.js
export const middlewares = ['checkAuth', 'validateProduct'];

export default async (req, res) => {
  // Execution order:
  // 1. All global middlewares (cors, logger, etc.)
  // 2. checkAuth
  // 3. validateProduct
  // 4. This handler
  
  const product = await db.products.create(req.body);
  res.status(201).json({ product });
};
```

### Skipping Global Middleware

Use `'!_global'` to skip all global middleware:

```javascript
// src/routes/webhook/POST.js
export const middlewares = ['!_global', 'validateWebhook'];

export default async (req, res) => {
  // Execution order:
  // 1. validateWebhook
  // 2. This handler
  // (No global middlewares run)
  
  await processWebhook(req.body);
  res.json({ received: true });
};
```

This is useful for:
- Webhook endpoints that need raw body
- Health check endpoints
- Public endpoints that should bypass auth

### No Middleware at All

Skip everything, including globals:

```javascript
// src/routes/public/data/GET.js
export const middlewares = ['!_global'];

export default (req, res) => {
  // Only this handler runs
  res.json({ data: 'public' });
};
```

## Middleware Execution Flow

Understanding the complete request flow:

```
Request
  ↓
Express Built-in Middleware (express.json(), etc.)
  ↓
Global Middlewares (alphabetical order)
  ↓
Route-Specific Middlewares (array order)
  ↓
Route Handler
  ↓
Response
```

### Example Flow

Given this setup:

```javascript
// Globals (in src/middlewares/)
cors._global.js
logger._global.js

// Route
export const middlewares = ['checkAuth', 'checkRole'];
export default handler;
```

Execution order:
1. `express.json()` (built-in)
2. `cors` (global)
3. `logger` (global)
4. `checkAuth` (route-specific)
5. `checkRole` (route-specific)
6. Route handler

## TypeScript Middleware

Middleware works with TypeScript:

```typescript
// src/middlewares/checkAuth._global.ts
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};
```

## Advanced Patterns

### Middleware Factories

Create configurable middleware:

```javascript
// src/middlewares/rateLimit.js
const requests = new Map();

export default (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;
  
  if (!requests.has(ip)) {
    requests.set(ip, []);
  }
  
  const userRequests = requests.get(ip)
    .filter(time => now - time < windowMs);
  
  if (userRequests.length >= maxRequests) {
    return res.status(429).json({ 
      error: 'Too many requests' 
    });
  }
  
  userRequests.push(now);
  requests.set(ip, userRequests);
  next();
};
```

### Async Middleware

Middleware can be asynchronous:

```javascript
// src/middlewares/checkAuth.js
export default async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Async token verification
    const user = await verifyTokenAsync(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Modifying Request/Response

Middleware can add properties to `req` or `res`:

```javascript
// src/middlewares/addRequestId._global.js
import { randomUUID } from 'crypto';

export default (req, res, next) => {
  req.id = randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};
```

Access in routes:
```javascript
export default (req, res) => {
  console.log(`Request ID: ${req.id}`);
  res.json({ requestId: req.id });
};
```

### Error Handling Middleware

Handle errors in middleware:

```javascript
// src/middlewares/errorHandler._global.js
export default (err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    requestId: req.id
  });
};
```

Note: Error handling middleware has four parameters `(err, req, res, next)`.

## Common Use Cases

### Authentication

```javascript
// src/middlewares/checkAuth.js
export default async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const user = await verifyJWT(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Authorization

```javascript
// src/middlewares/requireAdmin.js
export default (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};
```

### Request Validation

```javascript
// src/middlewares/validateUser.js
export default (req, res, next) => {
  const { email, password, name } = req.body;
  
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be 8+ characters' });
  }
  
  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name too short' });
  }
  
  next();
};
```

### Request Logging

```javascript
// src/middlewares/detailedLogger._global.js
export default (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  
  next();
};
```

## Debugging Middleware

View middleware flow in the route inspector:

```bash
npm run routes
```

The inspector shows:
- Global middleware (applied to all routes)
- Named middleware (used by specific routes)
- Execution order for each endpoint

## Best Practices

**1. Keep middleware focused**

Each middleware should do one thing:
```javascript
// Good
checkAuth.js      // Only authentication
checkRole.js      // Only authorization
validateInput.js  // Only validation

// Avoid
checkAuthAndRole.js  // Does too much
```

**2. Name files clearly**

```javascript
// Good
checkAuth.js
validateProduct.js
rateLimit.js

// Avoid
auth.js  // Ambiguous
utils.js // Too generic
```

**3. Use globals sparingly**

Only make middleware global if it truly applies to all routes:
```javascript
// Good global candidates
cors._global.js
logger._global.js
requestId._global.js

// Bad global candidates
checkAuth._global.js  // Most routes don't need auth
validateInput._global.js  // Validation is route-specific
```

**4. Handle errors properly**

Always handle async errors:
```javascript
export default async (req, res, next) => {
  try {
    await riskyOperation();
    next();
  } catch (error) {
    next(error);  // Pass to error handler
  }
};
```

**5. Don't forget to call next()**

Middleware must either:
- Send a response
- Call `next()` to continue
- Call `next(error)` to trigger error handling

```javascript
// Good
export default (req, res, next) => {
  if (condition) {
    return res.status(400).json({ error: 'Bad request' });
  }
  next();
};

// Bad - request hangs
export default (req, res, next) => {
  if (condition) {
    res.status(400).json({ error: 'Bad request' });
    // Forgot return, next() still runs
  }
  next();
};
```

## Middleware Not Found Errors

If a route references non-existent middleware:

```javascript
// Route references 'nonExistent'
export const middlewares = ['nonExistent'];
```

THIZ.js throws:
```
Error: Middleware 'nonExistent' not found in src/middlewares/
Available middlewares: checkAuth, checkRole, cors, logIP
```

Check:
1. File exists in `src/middlewares/`
2. Name matches exactly (case-sensitive)
3. File exports default function