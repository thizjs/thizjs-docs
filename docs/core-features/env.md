---
sidebar_position: 3
---

# Environment Variables

## Overview

THIZ.js includes smart environment variable management with automatic hot-reload support. Change your `.env` files while developing, and your server restarts with the new values instantly.

No manual restarts. No `dotenv` package needed. Just edit and save.

## Environment File Priority

THIZ.js automatically loads environment variables from multiple files in this priority order:

**1. `.env.local`** (highest priority)
- Local overrides for your machine
- Gitignored by default
- Perfect for personal settings and secrets

**2. `.env.development`**
- Development environment settings
- Can be committed to share dev configs
- Team-wide development defaults

**3. `.env`** (lowest priority)
- Base environment variables
- Shared across all environments
- Usually committed to version control

Variables in higher-priority files override those in lower-priority files.

## Initial Setup

When you create a THIZ.js project, you get:

**`.env.local`** - Generated from `.env.example`
```bash
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

The `.env.local` file is automatically created and gitignored. Edit it with your actual values:

```bash
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/myapp
```

## Using Environment Variables

Access environment variables through `process.env`:

```javascript
// src/server.js
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
```


## Hot Reload for Environment Variables

Edit any `.env` file while the dev server is running:

**1. Start the server:**
```bash
npm run dev
```

**2. Edit `.env.local`:**
```bash
# Change port
PORT=3000
```

**3. Save the file**

The server automatically detects the change and restarts:

```
[THIZ] Environment file changed: .env.local
[THIZ] Restarting server...
[THIZ] Server started at http://localhost:3000
[THIZ] Ready for changes...
```

Your new environment variables are loaded immediately.

## File Priority Example

Given these files:

**`.env`**
```bash
PORT=5000
NODE_ENV=development
API_KEY=default_key
```

**`.env.development`**
```bash
PORT=5001
DEBUG=true
```

**`.env.local`**
```bash
PORT=3000
API_KEY=my_secret_key
```

**Resulting environment:**
```bash
PORT=3000              # From .env.local (highest priority)
NODE_ENV=development   # From .env
API_KEY=my_secret_key  # From .env.local (overrides .env)
DEBUG=true             # From .env.development
```

## Common Patterns

### Database Configuration

**`.env.local`** (personal dev database):
```bash
MONGO_URI=mongodb://localhost:27017/myapp_dev
```

**`.env.development`** (shared dev database):
```bash
MONGO_URI=mongodb://dev-server:27017/myapp_shared
```

Developers use local by default (from `.env.local`), but can delete `.env.local` to use the shared database.

### API Keys

**`.env.local`** (personal keys, gitignored):
```bash
OPENAI_API_KEY=sk-proj-abc123...
STRIPE_SECRET_KEY=sk_test_xyz789...
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_KEY=wJa...
```
Team members copy `.env.example` to `.env.local` and fill in their own keys.

### Port Management

**`.env`** (default port for everyone):
```bash
PORT=5000
```

**`.env.local`** (your personal port):
```bash
PORT=3000
```

If port 5000 is occupied on your machine, override it locally without affecting others.

### Feature Flags

**`.env.development`** (team-wide dev settings):
```bash
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
DEBUG_MODE=true
```

**`.env.local`** (test specific features):
```bash
FEATURE_BETA_API=true  # Override to test beta API locally
```

### Environment-Specific Settings

**`.env`** (base settings):
```bash
NODE_ENV=development
LOG_LEVEL=info
RATE_LIMIT=100
```

**`.env.development`**:
```bash
LOG_LEVEL=debug
RATE_LIMIT=1000  # Higher limit for dev
```

**`.env.local`**:
```bash
LOG_LEVEL=silly  # Most verbose for debugging
```

## Best Practices

### 1. Never Commit Secrets

Always gitignore files with secrets:

**`.gitignore`**:
```
.env.local
```

Committed files:
```
.env
.env.development
```

### 2. Use .env.example as Documentation

Keep `.env.example` updated with all required variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# External APIs
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### 3. Provide Sensible Defaults

Use fallback values in code:

```javascript
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT) || 100;
```

### 4. Validate Critical Variables

Check for required variables at startup:

```javascript
// src/server.js
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined in environment variables`);
    process.exit(1);
  }
}
```

### 5. Type Conversion

Environment variables are always strings. Convert when needed:

```javascript
// Numbers
const PORT = parseInt(process.env.PORT) || 5000;
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT) || 100;

// Booleans
const DEBUG = process.env.DEBUG === 'true';
const FEATURE_ENABLED = process.env.FEATURE_ENABLED === 'true';

// Arrays
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];
```

## Production Configuration

For production, use environment-specific files or platform configuration:

**Platform environment variables** (recommended):
- Vercel: Use the dashboard to set env vars
- Railway: Use the Variables tab
- Heroku: Use `heroku config:set`
- Docker: Pass via `docker run -e`

**`.env.production`** (alternative):
```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://prod-cluster...
LOG_LEVEL=error
```

Set `NODE_ENV=production` to use production settings.

## Common Variables

Here are commonly used environment variables in THIZ.js projects:

### Server Configuration
```bash
PORT=5000                    # Server port
NODE_ENV=development         # Environment (development/production)
HOST=localhost               # Server host
```

### Database
```bash
MONGO_URI=mongodb://localhost:27017/myapp
DB_NAME=myapp
DB_POOL_SIZE=10
```

### Authentication
```bash
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
SESSION_SECRET=your_session_secret
BCRYPT_ROUNDS=10
```

### CORS
```bash
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
```

### Rate Limiting
```bash
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### Logging
```bash
LOG_LEVEL=info              # silly/debug/info/warn/error
LOG_FORMAT=json             # json/simple
```

## Troubleshooting

### Variables Not Loading

**Check file location:**
Files must be in project root:
```
my-api/
├── .env.local          ✓
├── .env.development    ✓
├── .env                ✓
└── src/
```

Not:
```
my-api/
└── src/
    ├── .env.local      ✗
    └── .env            ✗
```

### Wrong Values Loading

**Check priority order:**
```bash
# If PORT=5000 is being used but you set PORT=3000
# Check all three files:

.env.local        # PORT=3000 (should override)
.env.development  # PORT=5001 (might override .env.local if named wrong)
.env              # PORT=5000 (lowest priority)
```

Remember: `.env.local` > `.env.development` > `.env`

### Hot Reload Not Working

**Restart the dev server:**
```bash
Ctrl+C
npm run dev
```

Environment variables are loaded on server start.

### Variables Undefined

**Check for typos:**
```javascript
// Wrong
process.env.MONGI_URI

// Correct
process.env.MONGO_URI
```

**Check file syntax:**
```bash
# Wrong (spaces around =)
PORT = 5000

# Correct (no spaces)
PORT=5000
```

### Production Issues

**Verify platform environment:**

Vercel:
```bash
vercel env pull .env.local
```

Railway:
```bash
railway variables
```

Heroku:
```bash
heroku config
```

## No dotenv Package Needed

THIZ.js includes environment variable loading out of the box. You don't need to:

- Install `dotenv`
- Import `dotenv/config`
- Call `dotenv.config()`

Everything is handled automatically.

## Next Steps

- Learn about [Hot Reload](./hot-reload.md) for file changes
- Explore [File-Based Routing](./file-based-routing.md)
- Check out [Middleware System](./middlewares.md)