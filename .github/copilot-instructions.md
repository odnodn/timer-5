# Timer-5 Time Tracking Application

Timer-5 is an Angular 20 web application for time tracking and task management. It uses Material Design UI components and stores all data locally in localStorage. The application is deployed as a Progressive Web App (PWA) to GitHub Pages.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Setup

- **REQUIRED**: Node.js 22.14.0 or higher (package.json specifies this requirement)
- Current Node.js 20.x works with warnings but 22.14.0+ is recommended
- Install dependencies: `npm install` -- takes 2-3 minutes. NEVER CANCEL. Set timeout to 5+ minutes.

### Development Workflow

- **Development build**: `npx ng build --configuration development` -- takes 10-15 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- **Development server**: `npm start` -- takes 10-15 seconds to build, then serves on http://localhost:4200/. NEVER CANCEL. Set timeout to 60+ seconds.
- **Production build**: `npm run build` -- takes 10-15 seconds but FAILS in restricted environments due to external font fetching from fonts.googleapis.com. Use development build for testing changes.

### Testing and Validation

- **E2E Tests**: `npm run e2e` -- may fail in restricted environments due to browser connection issues. Use manual validation instead.
- **E2E Tests (Docker)**: `npm run e2e:docker` -- requires Docker and may fail in restricted environments
- **Manual Validation**: ALWAYS test application manually by running `npm start` and validating functionality in browser
- **No Unit Tests**: This project uses only E2E tests with TestCafe. Do not look for unit test files.

### Code Quality

- **Formatting**: `npx prettier --check .` to check formatting, `npx prettier --write .` to fix
- **No Linting**: This project does not have ESLint or other linting tools configured
- Always run `npx prettier --write .` before committing changes

## Validation Scenarios

### CRITICAL: Manual Testing Required

After making any changes, ALWAYS perform these validation steps:

1. **Start Development Server**: `npm start` (wait for "Application bundle generation complete")
2. **Navigate to Application**: http://localhost:4200/
3. **Test Core Workflow**:
   - Click "Create a task" button
   - Enter a task name (e.g., "Test Project")
   - Click "Create" button
   - Verify task appears in the list
   - Click the start/stop button (play icon) next to the task
   - Wait a few seconds to see timer counting
   - Click the stop button to end the timer session
   - Verify the session appears in the task detail table with start/end times

### Expected Behavior

- Tasks are created and stored in localStorage
- Timer starts/stops correctly and tracks time accurately
- Sessions show start time, end time, and duration
- UI updates in real-time during timer operation
- Navigation between different task states (Active/Finished/Dropped) works

## Build and Environment Limitations

### Network Restrictions

- **Production builds FAIL** in environments that cannot access fonts.googleapis.com
- **Solution**: Use `npx ng build --configuration development` for testing builds
- Development builds work in all environments and are sufficient for validation

### Browser Testing Limitations

- **E2E tests may fail** due to browser connection issues in restricted environments
- **Solution**: Use manual testing via development server instead
- TestCafe tests exist in `e2e/fixtures/` but may not run in all environments

### Node.js Version Compatibility

- **Recommended**: Node.js 22.14.0+
- **Minimum**: Node.js 20.x works with npm warnings
- Install will show EBADENGINE warnings with Node.js 20.x but still functions

## Project Structure

### Key Directories

- `src/app/` - Angular application source code
- `e2e/` - End-to-end tests using TestCafe
- `scripts/` - Build and deployment scripts
- `dist/timer-5/` - Built application output (after build)

### Important Files

- `package.json` - Dependencies and build scripts
- `angular.json` - Angular build configuration
- `tsconfig.json` - TypeScript configuration
- `.prettierrc` - Code formatting rules
- `ngsw-config.json` - Service worker configuration for PWA

### Build Outputs

- Development builds go to `dist/timer-5/`
- Production builds include GitHub Pages deployment preparation
- Service worker files are generated for PWA functionality

## Common Tasks

### Adding New Features

1. Start development server: `npm start`
2. Make code changes in `src/app/`
3. Test changes manually in browser at http://localhost:4200/
4. Validate core timer functionality still works
5. Format code: `npx prettier --write .`
6. Test build: `npx ng build --configuration development`

### Debugging Issues

1. Check browser console for JavaScript errors
2. Verify localStorage is not corrupted (clear if needed)
3. Test with fresh task creation and timer operation
4. Use Angular DevTools browser extension if available

### Deployment

- Production deployment happens automatically via GitHub Actions on master branch
- Manual deployment: `npm run deploy` (requires GitHub token)
- Builds are cached in CI for performance

## Timeout Values and Timing

### Build Commands

- `npm install`: 5+ minutes timeout (typically 2-3 minutes)
- `npm start`: 60+ seconds timeout (typically 10-15 seconds)
- `npx ng build`: 60+ seconds timeout (typically 10-15 seconds)

### Testing Commands

- Manual testing: Always validate after changes
- E2E tests may take 5+ minutes if they run successfully
- **NEVER CANCEL** any build or test commands - wait for completion

## Technology Stack

- **Framework**: Angular 20
- **UI**: Angular Material Design
- **Testing**: TestCafe for E2E tests
- **Build**: Angular CLI
- **Deployment**: GitHub Pages
- **PWA**: Angular Service Worker
- **Styling**: SCSS with Material theming
- **Data Storage**: Browser localStorage only
