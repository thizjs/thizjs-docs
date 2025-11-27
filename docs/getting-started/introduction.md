---
sidebar_position: 1
---

# Introduction

## What is THIZ.js?

THIZ.js is a modern backend framework that brings file-based routing and convention-over-configuration principles to Express.js. If you've ever felt that building Express APIs involves too much boilerplate and manual route registration, THIZ.js is here to fix that.

Instead of writing endless `app.get()` and `app.post()` statements, you simply create files in a folder structure that matches your API endpoints. THIZ.js handles the rest.

## Why THIZ.js?

### The Problem

Traditional Express development often looks like this:

```javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

// app.js
import userRoutes from './routes/users.js';
app.use('/users', userRoutes);
```

You're constantly juggling imports, router definitions, and manual path registration. As your API grows, so does the tedium.

### The THIZ.js Solution

With THIZ.js, your folder structure *is* your router:

```
src/routes/
└── users/
    ├── GET.js           → GET /users
    ├── POST.js          → POST /users
    └── [id]/
        ├── GET.js       → GET /users/:id
        ├── PATCH.js     → PATCH /users/:id
        └── DELETE.js    → DELETE /users/:id
```

Each file contains just the handler logic. No imports, no router setup, no manual registration. Create a file, export a function, and you have a working endpoint.

## Core Philosophy

THIZ.js is built on four key principles:

**1. Conventions Over Configuration**

Sensible defaults that work out of the box. The framework makes intelligent decisions so you don't have to configure everything manually.

**2. Developer Experience First**

Fast feedback loops, hot reloading, and clear error messages. Development should feel smooth, not frustrating.

**3. Progressive Enhancement**

Start simple and add complexity only when you need it. Basic CRUD APIs require minimal code, while advanced features are available when necessary.

**4. No Magic**

Clear, predictable behavior. File-based routing might look like magic at first, but it follows simple, understandable conventions.

## What You Get

When you use THIZ.js, you get:

- **File-based routing** that eliminates manual route registration
- **Convention-based middleware** that applies automatically based on naming patterns
- **Hot reload** during development for instant feedback
- **TypeScript support** without additional configuration
- **Route inspector** to visualize your API structure
- **Smart environment variable loading** with hot-reload support
- **MongoDB integration** (optional and easily removable)

## Who Is This For?

THIZ.js is ideal for:

- Developers building REST APIs who are tired of Express boilerplate
- Teams wanting consistent project structure across services
- Anyone who values developer experience and rapid iteration
- Projects that need to scale from prototype to production without rewriting

## What's Next?

Ready to build something? Head over to [Installation](./installation.md) to create your first THIZ.js project.

Want to understand the framework better? Check out the [Core Concepts](../core-features/file-based-routing.md) section.

## A Note on Learning

If you're familiar with Express, you'll feel at home with THIZ.js. We're not replacing Express—we're enhancing it. Your Express knowledge transfers directly, and you can even mix traditional Express routes with file-based routing in the same application.

The learning curve is gentle: understand the file naming conventions, learn how middleware works, and you're ready to build.