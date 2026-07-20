---
name: deploy
description: Deploy the storyboard to GitHub Pages and/or Azure Blob Storage. Handles build, credential checks, and sequencing for both targets.
disable-model-invocation: true
---

The user wants to deploy this storyboard. Use $ARGUMENTS to determine the target: "gh" or "github" for GitHub Pages, "azure" or "prod" for Azure, or deploy both if no argument is given.

## Steps

1. **Build**: Run `npm run build`. If it fails, stop and report the error.

2. **For GitHub Pages** (target: gh / github / both):
   - Confirm the `unctad` git remote is configured (`git remote -v`). If missing, warn the user to add it before proceeding.
   - Run `npm run sync-gh-pages` to push the `dist/` folder via git subtree.
   - Report the URL pattern: `https://<org>.github.io/<repo-name>/`.

3. **For Azure Blob Storage** (target: azure / prod / both):
   - Check that `azcopy` is installed (`which azcopy`). If missing, tell the user to install it.
   - Check that `AZURE_STORAGE_NAME` is set. If not, tell the user to set it.
   - If Azure credentials are not already cached, run `npm run login` (needs `AZURE_USER`, `AZURE_PW`, `AZURE_TENANT` env vars).
   - Run `npm run sync-prod`.

4. Confirm success and summarise which targets were updated.
