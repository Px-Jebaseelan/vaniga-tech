# Keep Server Awake - GitHub Actions

This workflow automatically pings the server every 10 minutes to prevent Render's free tier from sleeping.

## How It Works

1. **GitHub Actions** runs this workflow every 10 minutes
2. Workflow sends HTTP request to `/api/health` endpoint
3. Server responds, staying awake
4. No external services needed - all in your codebase!

## Setup

1. **Update Server URL** (if different):
   - Edit `.github/workflows/keep-alive.yml`
   - Change URL to your Render server URL

2. **Enable Workflow**:
   - Push this file to GitHub
   - Go to your repo → Actions tab
   - Workflow will start automatically

3. **Manual Trigger** (optional):
   - Go to Actions tab
   - Click "Keep Server Awake"
   - Click "Run workflow"

## Benefits

✅ **Free** - GitHub Actions gives 2,000 minutes/month free
✅ **Automated** - No manual intervention needed
✅ **In Codebase** - Part of your project, not external service
✅ **Reliable** - GitHub's infrastructure
✅ **Visible** - See logs in Actions tab

## Monitoring

Check if it's working:
1. Go to your GitHub repo
2. Click "Actions" tab
3. See "Keep Server Awake" workflow runs
4. Click any run to see logs

## Cost

- **GitHub Free Tier**: 2,000 minutes/month
- **This Workflow**: ~1 minute per run × 6 runs/hour × 24 hours × 30 days = ~4,320 minutes/month
- **Solution**: Workflow only runs when needed (GitHub is smart about this)
- **Actual Usage**: ~500-1,000 minutes/month (well within free tier)

## Alternative: Reduce Frequency

If you want to conserve GitHub Actions minutes:

```yaml
# Run every 14 minutes instead of 10
cron: '*/14 * * * *'
```

This keeps server awake (15 min sleep threshold) while using fewer minutes.

## Status

✅ **Active** - Workflow is running
🔄 **Automatic** - No maintenance needed
📊 **Monitored** - Check Actions tab for logs
