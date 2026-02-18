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

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests (requires browsers to be installed)
npx playwright install --with-deps
npm run e2e

# Run E2E tests for a specific browser
npm run e2e -- --project=chromium

# Build for production
npm run build
```

### CI/CD Workflows

This project uses GitHub Actions for continuous integration and deployment:

#### CI Workflow

The CI workflow automatically runs on pull requests and pushes to the master branch:

- **Linting**: Validates code style using ESLint
- **Testing**: Runs unit tests using Vitest
- **Building**: Creates production build using Vite
- **E2E Testing**: Runs Playwright end-to-end tests (Chromium) against the production build
- **Artifact Upload** (master only): On successful master builds, the `dist/` output is uploaded as a versioned artifact

**Versioning Strategy:**
- Version format: `MAJOR.MINOR.BUILD` (e.g., `1.0.123`)
- `MAJOR.MINOR`: Set via git tags (e.g., `v1.0`, `v1.1`, `v2.0`)
- `BUILD`: Auto-incremented using GitHub Actions run number
- Example: With tag `v1.0`, builds become `1.0.1`, `1.0.2`, `1.0.3`, etc.

**Creating a new version:**
```bash
# To bump to version 1.1.x
git tag -a v1.1 -m "Version 1.1"
git push origin v1.1

# Subsequent builds on master will be 1.1.1, 1.1.2, etc.
```

#### Release Workflow

The release workflow is manually triggered to deploy a specific version:

1. Go to **Actions** → **Release** → **Run workflow**
2. Enter the version number to release (e.g., `1.0.123`)
3. The workflow will:
   - Download the build artifact from the CI workflow
   - Deploy to [gentlygently.github.io](https://gentlygently.github.io/)
   - Create a GitHub Release with the build archive attached

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
