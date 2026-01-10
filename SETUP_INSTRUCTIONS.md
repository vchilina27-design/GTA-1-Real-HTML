# GitHub Pages Setup Instructions

This repository is configured to automatically deploy to GitHub Pages.

## 🌐 Live URL

The game is available at:
**https://vchilina27-design.github.io/GTA-1-Real-HTML/**

## ⚙️ Automatic Deployment

This repository uses GitHub Actions to automatically deploy to GitHub Pages whenever changes are pushed to the `main` branch.

### How It Works

1. **GitHub Actions Workflow**: The `.github/workflows/deploy-pages.yml` file contains the deployment configuration
2. **Automatic Triggers**: Deployment runs automatically on:
   - Every push to the `main` branch
   - Manual trigger via "Actions" tab on GitHub
3. **Build Process**: The workflow uploads all files and deploys them to GitHub Pages

### Deployment Status

You can check the deployment status:
1. Go to the repository on GitHub
2. Click on the "Actions" tab
3. Look for "Deploy to GitHub Pages" workflows

## 🔧 Manual Setup (if needed)

If GitHub Pages is not enabled, follow these steps:

1. Go to repository **Settings**
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select:
   - **Source**: GitHub Actions (recommended)
   - OR **Branch**: `main` with path `/` (root)
4. Click **Save**
5. Wait a few minutes for the site to build

## 📁 Repository Structure

All required files are in the root directory:
- `index.html` - Main game page
- `game.js` - Game logic
- `style.css` - Styling
- `.github/workflows/deploy-pages.yml` - Deployment workflow

## ✅ Verification

To verify the deployment:
1. Visit: https://vchilina27-design.github.io/GTA-1-Real-HTML/
2. The game should load and be playable
3. Check browser console for any errors (F12)

## 🔄 Updating the Game

To update the game:
1. Make changes to the files
2. Commit and push to the `main` branch
3. GitHub Actions will automatically redeploy
4. Changes will be live in 1-2 minutes

## 🛠️ Troubleshooting

### Site not loading
- Check Actions tab for failed workflows
- Ensure GitHub Pages is enabled in Settings > Pages
- Verify the repository is public

### Files not found (404 errors)
- Check that all files are in the root directory
- Ensure file names match exactly (case-sensitive)
- Clear browser cache and try again

### Changes not appearing
- Wait 1-2 minutes for deployment to complete
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Check Actions tab to see if deployment succeeded

## 📝 Notes

- Deployment typically takes 30-120 seconds
- The site uses HTTPS automatically
- Custom domains can be configured in Settings > Pages
- The `gh-pages` branch is also available as a backup deployment option
