## Security Setup

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials in `.env`

3. **IMPORTANT**: Never commit `.env` to GitHub!

### Local Development

For browser-based development without a build step, add to your HTML before `js/config.js`:
```html
<script>
  window.ENV = {
    SUPABASE_URL: 'your_url',
    SUPABASE_ANON_KEY: 'your_key'
  };
</script>
```

### Production Deployment

Set environment variables on your hosting platform (Vercel, Netlify, etc.) and inject them into `window.ENV` before loading `js/config.js`.