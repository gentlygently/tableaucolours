# Gently, gently

Gently, gently is a Tableau Preferences.tps file and colour palette editor written in Vue.

## Colour palette editor

The colour palette editor allows you to create and edit Tableau colour palettes:

- Start from scratch, or import the XML of an existing palette to edit
- Pick colours from a standard colour picker
- Open an image, then pick colours from the image either automatically or manually
- Add, remove and re-order colours
- Change the palette type or name
- Export the XML of the new/modified template

## Preferences.tps file editor

The file editor allows you to open and edit a Tableau Preferences.tps file:

- Add, clone, edit (in the palette editor), remove and re-order colour palettes
- Select a subset of palettes to export to a new .tps file
- Search/filter palettes (useful when you have many)
- Save your changes

[Try it out](https://gentlygently.github.io/) (see the examples folder for sample .tps files)

## Development

### Building and Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build
```

### CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment:

#### CI Workflow

The CI workflow automatically runs on pull requests and pushes to the master branch:

- **Linting**: Validates code style using ESLint
- **Building**: Creates production build using Vite
- **Release Creation** (master only): On successful master builds, creates a GitHub release with the build archive attached

**Versioning Strategy:**
- Version format: `MAJOR.MINOR.BUILD` (e.g., `1.0.123`)
- `MAJOR.MINOR`: Set via git tags (e.g., `v1.0`, `v1.1`, `v2.0`)
- `BUILD`: Auto-incremented using GitHub Actions run number (global counter)
- Example: With tag `v1.0`, builds become `1.0.1`, `1.0.2`, `1.0.3`, etc.
- **Note:** The BUILD number is a global counter that never resets. When you create a new tag (e.g., `v1.1`), builds continue from the current run number, so you might see `1.1.124`, `1.1.125`, etc.

Each successful master build creates a GitHub release tagged with the version number (e.g., `v1.0.123`) and includes the build archive (`build-1.0.123.zip`).

**Creating a new version:**
```bash
# To bump to version 1.1.x
git tag -a v1.1 -m "Version 1.1"
git push origin v1.1

# Subsequent builds on master will use 1.1.x where x is the global run number
# For example: 1.1.124, 1.1.125, 1.1.126, etc.
```

#### Release Workflow

The release workflow is manually triggered to deploy a specific version to production:

1. Go to **Actions** → **Release** → **Run workflow**
2. Enter the version number to release (e.g., `1.0.123`)
3. The workflow will:
   - Download the build archive from the corresponding GitHub release
   - Deploy to [gentlygently.github.io](https://gentlygently.github.io/) using peaceiris/actions-gh-pages
   - Update the release notes with deployment information

**Note:** The version must correspond to an existing GitHub release created by the CI workflow. You can view available versions in the [Releases](../../releases) page.

**Deployment Behavior:**
- Uses the industry-standard [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) action
- Replaces all content in the deployment repository with the new build
- Automatically preserves GitHub Pages configuration (CNAME for custom domains)
- Automatic .nojekyll handling for proper asset serving

**Setup Requirements:**

To enable the release workflow, configure the following repository secret:

- `DEPLOY_TOKEN`: A Personal Access Token (PAT) with `repo` scope and write access to the `gentlygently/gentlygently.github.io` repository

**Creating a PAT:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Add it as a repository secret named `DEPLOY_TOKEN`

### Manual Deployment

The legacy `deploy.sh` script can still be used for local deployments:

```bash
./deploy.sh "commit message"
```
