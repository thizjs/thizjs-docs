---
sidebar_position: 1
---

# File-Based Routing

## Overview

File-based routing is the core feature of THIZ.js. Instead of manually registering routes with `app.get()` or `router.post()`, you create files in a folder structure that mirrors your API endpoints. The framework automatically discovers these files and registers them with Express.

## Basic Concept

Your folder structure defines your API:

```
src/routes/
└── users/
    ├── GET.js           → GET /users
    ├── POST.js          → POST /users
    └── [id]/
        ├── GET.js       → GET /users/:id
        └── DELETE.js    → DELETE /users/:id
```

Each file exports a standard Express handler. THIZ.js scans the directory, maps paths to routes, and registers everything automatically.

## Route Files

### Naming Convention

Route files must be named after HTTP methods:

- `GET.js` or `GET.ts`
- `POST.js` or `POST.ts`
- `PUT.js` or `PUT.ts`
- `PATCH.js` or `PATCH.ts`
- `DELETE.js` or `DELETE.ts`

File names are case-insensitive, but uppercase is recommended for clarity.

### Handler Format

Each route file must export a default function:

```javascript
// src/routes/users/GET.js
export default async (req, res) => {
  const users = await db.users.find();
  res.json({ users });
};
```

This is a standard Express route handler. You have full access to `req`, `res`, and all Express features.

### Multiple Styles

THIZ.js supports different function styles:

**Arrow function:**
```javascript
export default (req, res) => {
  res.json({ message: 'Hello' });
};
```

**Named function:**
```javascript
export default function getUsers(req, res) {
  res.json({ users: [] });
}
```

**Async handler:**
```javascript
export default async (req, res) => {
  const data = await fetchData();
  res.json(data);
};
```

All styles work identically. Choose what you prefer.

## URL Mapping

### Static Segments

Folder names become URL segments:

```
src/routes/
├── products/
│   └── GET.js           → GET /products
└── orders/
    └── GET.js           → GET /orders
```

### Nested Routes

Nest folders to create nested paths:

```
src/routes/
└── users/
    └── profile/
        └── settings/
            └── GET.js   → GET /users/profile/settings
```

### Root Route

Files directly in the routes directory map to the root:

```
src/routes/
└── GET.js               → GET /
```

## Dynamic Routes

### Basic Dynamic Segments

Use square brackets `[param]` to create dynamic URL parameters:

```
src/routes/
└── users/
    └── [id]/
        └── GET.js       → GET /users/:id
```

Access the parameter in your handler:

```javascript
// src/routes/users/[id]/GET.js
export default async (req, res) => {
  const { id } = req.params;
  const user = await db.users.findById(id);
  res.json({ user });
};
```

### Multiple Dynamic Segments

You can have multiple dynamic segments in one path:

```
src/routes/
└── users/
    └── [userId]/
        └── posts/
            └── [postId]/
                └── GET.js   → GET /users/:userId/posts/:postId
```

```javascript
// src/routes/users/[userId]/posts/[postId]/GET.js
export default async (req, res) => {
  const { userId, postId } = req.params;
  const post = await db.posts.findOne({ userId, id: postId });
  res.json({ post });
};
```

### Naming Dynamic Segments

The folder name inside brackets becomes the parameter name:

```
[id]        → req.params.id
[userId]    → req.params.userId
[slug]      → req.params.slug
[productId] → req.params.productId
```

Choose descriptive names that match your domain model.

## Complete Example

A full CRUD API for products:

```
src/routes/
└── products/
    ├── GET.js              → GET /products (list all)
    ├── POST.js             → POST /products (create)
    └── [id]/
        ├── GET.js          → GET /products/:id (get one)
        ├── PATCH.js        → PATCH /products/:id (update)
        └── DELETE.js       → DELETE /products/:id (delete)
```

**List all products:**
```javascript
// src/routes/products/GET.js
export default async (req, res) => {
  const products = await db.products.find();
  res.json({ products });
};
```

**Create product:**
```javascript
// src/routes/products/POST.js
export default async (req, res) => {
  const product = await db.products.create(req.body);
  res.status(201).json({ product });
};
```

**Get single product:**
```javascript
// src/routes/products/[id]/GET.js
export default async (req, res) => {
  const product = await db.products.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
};
```

**Update product:**
```javascript
// src/routes/products/[id]/PATCH.js
export default async (req, res) => {
  const product = await db.products.update(req.params.id, req.body);
  res.json({ product });
};
```

**Delete product:**
```javascript
// src/routes/products/[id]/DELETE.js
export default async (req, res) => {
  await db.products.delete(req.params.id);
  res.json({ message: 'Product deleted' });
};
```

## TypeScript Support

THIZ.js fully supports TypeScript routes:

```typescript
// src/routes/users/[id]/GET.ts
import { Request, Response } from 'express';

interface User {
  id: string;
  name: string;
  email: string;
}

export default async (req: Request, res: Response) => {
  const { id } = req.params;
  const user: User = await db.users.findById(id);
  res.json({ user });
};
```

**Important:** You cannot have both `GET.js` and `GET.ts` for the same route. Choose one extension per endpoint.

## Registration Options

### Basic Registration

In `src/app.js`:

```javascript
import { registerRoutes } from '@thizjs/express';

await registerRoutes(app, 'routes', { prefix: '' });
```

This scans `src/routes/` and mounts all routes at the root path.

### With Prefix

Add a URL prefix to all routes:

```javascript
await registerRoutes(app, 'routes', { prefix: '/api' });
```

Now all routes are prefixed:
- `src/routes/users/GET.js` → `GET /api/users`
- `src/routes/products/GET.js` → `GET /api/products`

### Multiple Directories

Register different route directories with different prefixes:

```javascript
// Public routes
await registerRoutes(app, 'routes', { prefix: '' });

// Admin routes
await registerRoutes(app, 'admin-routes', { prefix: '/admin' });

// API v2 routes
await registerRoutes(app, 'v2', { prefix: '/v2' });
```

Directory structure:
```
src/
├── routes/         → /users, /products
├── admin-routes/   → /admin/dashboard, /admin/users
└── v2/             → /v2/users, /v2/products
```

## Route Conflicts

### Static vs Dynamic

If you have both static and dynamic routes at the same level, static routes take priority:

```
src/routes/
└── users/
    ├── profile/GET.js    → GET /users/profile
    └── [id]/GET.js       → GET /users/:id
```

Request to `GET /users/profile` matches the static route, not the dynamic one.

### Multiple Dynamic Routes

Having multiple dynamic routes at the same level causes conflicts:

```
src/routes/
└── products/
    ├── [id]/GET.js       → GET /products/:id
    └── [slug]/GET.js     → GET /products/:slug
```

Both resolve to `GET /products/:param`. THIZ.js will warn about this.

**Solution:** Use different path structures:
```
src/routes/
└── products/
    ├── by-id/
    │   └── [id]/GET.js       → GET /products/by-id/:id
    └── by-slug/
        └── [slug]/GET.js     → GET /products/by-slug/:slug
```

### Strict Mode

Enable strict mode to throw errors on conflicts:

```javascript
await registerRoutes(app, 'routes', { 
  prefix: '/api',
  strict: true 
});
```

Without strict mode, THIZ.js logs warnings but continues.

## Best Practices

**1. Keep handlers thin**

Move business logic to services:
```javascript
// Good
export default async (req, res) => {
  const users = await UserService.getAll();
  res.json({ users });
};

// Avoid
export default async (req, res) => {
  // 50 lines of business logic here
};
```

**2. Use meaningful parameter names**

```javascript
// Good
[userId]
[orderId]
[productSlug]

// Avoid
[id]  // when you have multiple IDs
[x]
[param]
```

**3. Group related routes**

```
products/
├── GET.js
├── POST.js
└── [id]/
    ├── GET.js
    ├── PATCH.js
    └── DELETE.js
```

**4. Consistent HTTP methods**

Follow REST conventions:
- `GET` - Read data
- `POST` - Create data
- `PUT` - Replace data
- `PATCH` - Update data
- `DELETE` - Delete data

**5. Return appropriate status codes**

```javascript
// 200 for successful GET
res.json({ data });

// 201 for successful POST
res.status(201).json({ created });

// 204 for successful DELETE
res.status(204).send();

// 404 for not found
res.status(404).json({ error: 'Not found' });

// 400 for bad request
res.status(400).json({ error: 'Invalid input' });
```

## Error Handling

Handle errors within route handlers:

```javascript
export default async (req, res) => {
  try {
    const data = await riskyOperation();
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

Or use Express error handling middleware:

```javascript
export default async (req, res, next) => {
  try {
    const data = await riskyOperation();
    res.json({ data });
  } catch (error) {
    next(error);  // Pass to error handler
  }
};
```

## Debugging Routes

Use the route inspector to see all registered routes:

```bash
npm run routes
```

This opens a web interface showing:
- All registered endpoints
- HTTP methods
- Applied middleware
- Source file paths

Perfect for debugging routing issues and understanding your API structure.

## Migration from Traditional Express

**Before (traditional Express):**
```javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;

// app.js
import userRoutes from './routes/users.js';
app.use('/users', userRoutes);
```

**After (THIZ.js):**
```
src/routes/users/
├── GET.js
├── POST.js
└── [id]/
    └── GET.js
```

No router file, no registration code. Just handler