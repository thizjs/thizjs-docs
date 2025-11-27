---
sidebar_position: 4
---

# Route Inspector

## Overview

The Route Inspector is a visual web interface that shows your entire API structure at a glance. See all endpoints, HTTP methods, middleware chains, and source files in a clean, organized dashboard.

Perfect for understanding your API, debugging routing issues, and onboarding new team members.

## Launching the Inspector

Start the inspector:

```bash
npm run routes
```

This opens a web interface at `http://localhost:3456`.

Expected output:
```
Route Inspector running at http://localhost:3456
Press Ctrl+C to stop
```

Your browser opens automatically to the inspector dashboard.

## Dashboard Overview

The inspector shows three main sections:

**1. Statistics**
- Total number of routes
- HTTP methods breakdown (GET, POST, PUT, PATCH, DELETE)
- Middleware count (global and named)

**2. Middleware Overview**
- Global middleware (applied to all routes)
- Named middleware (available for specific routes)
- Execution order

**3. Route Table**
- All registered endpoints
- HTTP methods
- Applied middleware
- Source file paths

## Statistics Section

At the top of the dashboard:

```
Total Routes: 12
├── GET: 6
├── POST: 3
├── PATCH: 2
└── DELETE: 1

Middleware:
├── Global: 3
└── Named: 5
```

Quick overview of your API size and composition.

## Middleware Overview

Shows all available middleware:

**Global Middleware:**
```
cors._global.js
logger._global.js
rateLimit._global.js
```

These run on every request in alphabetical order.

**Named Middleware:**
```
checkAuth.js
checkRole.js
validateInput.js
validateProduct.js
validateUser.js
```

These are applied selectively to specific routes.

## Route Table

The main feature. Shows every endpoint:

```
Method | Path                        | Middleware              | Source File
-------|----------------------------|-------------------------|---------------------------
GET    | /                          | cors, logger, rateLimit | src/routes/GET.js
GET    | /health                    | cors, logger, rateLimit | src/routes/health/GET.js
GET    | /users                     | cors, logger, rateLimit | src/routes/users/GET.js
POST   | /users                     | cors, logger, rateLimit | src/routes/users/POST.js
                                    | checkAuth, validateUser |
GET    | /users/:id                 | cors, logger, rateLimit | src/routes/users/[id]/GET.js
PATCH  | /users/:id                 | cors, logger, rateLimit | src/routes/users/[id]/PATCH.js
                                    | checkAuth               |
DELETE | /users/:id                 | cors, logger, rateLimit | src/routes/users/[id]/DELETE.js
                                    | checkAuth, checkRole    |
GET    | /products                  | cors, logger, rateLimit | src/routes/products/GET.js
POST   | /products                  | cors, logger, rateLimit | src/routes/products/POST.js
                                    | checkAuth, validateProduct |
GET    | /products/:id              | cors, logger, rateLimit | src/routes/products/[id]/GET.js
PATCH  | /products/:id              | cors, logger, rateLimit | src/routes/products/[id]/PATCH.js
                                    | checkAuth, validateProduct |
DELETE | /products/:id              | cors, logger, rateLimit | src/routes/products/[id]/DELETE.js
                                    | checkAuth, checkRole    |
```

### Understanding the Table

**Method**: HTTP verb (GET, POST, PUT, PATCH, DELETE)

**Path**: The URL endpoint. Dynamic segments shown as `:param`

**Middleware**: Complete middleware chain for this route:
- First line: Global middleware (runs on all routes)
- Second line: Route-specific middleware (if any)

**Source File**: Exact file location containing the handler

## Common Use Cases

### 1. Understanding Middleware Flow

See which middleware runs on each endpoint:

```
POST /users
├── cors (global)
├── logger (global)
├── rateLimit (global)
├── checkAuth (route-specific)
└── validateUser (route-specific)
```

### 2. Debugging Route Conflicts

Identify overlapping dynamic routes:

```
GET /products/:id
GET /products/:slug

Warning: Both routes resolve to GET /products/:param
```

The inspector highlights conflicts visually.

### 3. Documenting Your API

Share the inspector URL with team members to show API structure. Helps maintaining API documentation.

### 4. Verifying Route Registration

Confirm routes are registered correctly:

```
Expected: GET /users/:id
Actual:   GET /users/:id ✓

Expected: POST /orders
Missing!  ✗
```

Quickly spot missing or incorrectly named routes.

### 5. Onboarding New Team Members

New developers can explore the entire API structure without reading code:

- See all available endpoints
- Understand authentication requirements
- Learn middleware patterns
- Find relevant source files


## Performance

The inspector is lightweight:

- Scans routes in milliseconds
- No performance impact on your API
- Works with APIs of any size
- Minimal memory footprint

## Troubleshooting

### Inspector Won't Start

**Check port availability:**
```bash
lsof -i :3456
```

If occupied, use a different port:
```bash
npm run routes -- --port 4000
```

### Routes Not Showing

**Verify route directory:**
```bash
ls src/routes/
```

Shows detailed scanning information.

### Missing Routes

**Check file naming:**
Routes must be named `GET.js`, `POST.js`, etc.

**Check file exports:**
Each route must export a default function.

**Restart inspector:**
```bash
Ctrl+C
npm run routes
```

## Best Practices

**1. Check inspector regularly**

Run it after adding routes to verify registration:
```bash
npm run routes
```

**2. Use it for documentation**

Share inspector URL with frontend team:
```
"See available endpoints at http://localhost:3456"
```

**3. Review middleware chains**

Verify middleware applies correctly:
```
Expected: GET /users has checkAuth
Actual:   GET /users has no auth middleware ✗
```

**4. Check for conflicts**

Watch for dynamic route warnings:
```
Warning: Conflicting routes detected
  GET /products/:id
  GET /products/:slug
```

## Next Steps

- Learn about [File-Based Routing](./file-based-routing.md)
- Explore [Middleware System](./middlewares.md)
- Check out [Hot Reload](./hot-reload.md)