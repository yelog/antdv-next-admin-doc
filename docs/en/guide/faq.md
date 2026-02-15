# FAQ

Frequently asked questions and solutions for the Antdv Next Admin project.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Environment Issues](#development-environment-issues)
- [Routing Issues](#routing-issues)
- [Permission Issues](#permission-issues)
- [Mock Data Issues](#mock-data-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [TypeScript Issues](#typescript-issues)
- [Performance Tips](#performance-tips)

---

## Installation Issues

### Q: Installation stuck or timeout

**Solution:**

```bash
# Use domestic mirror
npm config set registry https://registry.npmmirror.com

# Or use pnpm
pnpm install
```

---

## Development Environment Issues

### Q: White screen after starting dev server

**Possible causes and solutions:**

1. **Port occupied**
```bash
# Change port
npm run dev -- --port 3001
```

2. **Environment variables not applied**
```bash
# Restart dev server after modifying .env
```

3. **Browser cache**
```bash
# Force refresh: Cmd/Ctrl + Shift + R
```

### Q: Hot reload (HMR) not working

**Solution:**

```bash
# Restart dev server
# Check browser console for WebSocket connection errors
```

---

## Routing Issues

### Q: 404 after page refresh

**Reason:** Frontend uses history mode, requires server configuration

**Solution:**

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Q: Menu not showing after adding new page

**Checklist:**

1. Route added to `routes.ts`
2. Route meta has `title` set
3. Have permission to access
4. Re-login (permission routes need regeneration)

### Q: KeepAlive caching not working

**Possible causes:**

```typescript
// Check route config
{
  meta: {
    keepAlive: true,
    title: 'Page Title'
  }
}

// Check component name matches route name
export default {
  name: 'Dashboard',
}
```

---

## Permission Issues

### Q: Permission directive not working

**Troubleshooting:**

```typescript
// Check permission code
<a-button v-permission="'user.create'">Add</a-button>

// Check user permissions
const authStore = useAuthStore()
console.log(authStore.userPermissions)

// Ensure user is logged in
console.log(authStore.isLoggedIn)
```

---

## Mock Data Issues

### Q: Mock API not working

**Troubleshooting:**

1. **Check environment variable**
```bash
VITE_USE_MOCK=true
```

2. **Check API URL**
```typescript
// Must start with /api
request.get('/api/users')  // Correct
request.get('/users')       // Wrong
```

3. **Restart dev server**

---

## Build and Deployment Issues

### Q: Build failed

**Common errors:**

1. **TypeScript errors**
```bash
npm run type-check
```

2. **Out of memory**
```bash
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

### Q: 404 for resources after deployment

**Possible causes:**

1. **Wrong base path**
```typescript
export default {
  base: '/admin/',  // For subdirectory deployment
}
```

2. **Server configuration**

### Q: White screen after deployment

**Troubleshooting:**

1. Check browser console errors
2. Check network requests
3. Verify environment variables
```bash
VITE_API_BASE_URL=https://api.example.com
```

---

## TypeScript Issues

### Q: Cannot find module

**Solution:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Restart VS Code or TypeScript service.

---

## Performance Tips

### 1. First Screen Loading

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          antdv: ['antdv-next'],
        },
      },
    },
  },
}
```

### 2. Component Lazy Loading

```typescript
const Dashboard = () => import('@/views/dashboard/index.vue')
```

### 3. Prevent Memory Leaks

```typescript
// Clean up timers
onUnmounted(() => {
  clearInterval(timer)
})

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

---

## Getting Help

1. **Read Documentation** - Carefully read the relevant module documentation
2. **Check Examples** - Reference examples in `src/views/examples/`
3. **Search Issues** - Look for similar issues on GitHub
4. **Submit Issue** - If unresolved, submit an issue with:
   - Problem description
   - Reproduction steps
   - Error screenshots or logs
   - Environment info

---

## Next Steps

- View [Development Workflow](/en/guide/development-workflow)
- Learn [API Integration](/en/guide/api-integration)
- Read [Examples](/en/guide/examples)
