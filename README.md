# PortfolioFerchuz

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## CI/CD base

This repository includes a simple GitHub Actions workflow in `.github/workflows/ci.yml`.

What it does:

- Runs on `push` to `main`
- Runs on `pull_request` targeting `main`
- Installs dependencies with `npm ci`
- Builds the Angular app in production mode with `npm run build:ci`
- Fails the workflow if the build fails
- Uploads the generated `dist/portfolio-ferchuz/browser` folder as an artifact named `portfolio-build`

This leaves the repository ready for a future automatic deploy step. To add that later, the usual next step is a second job that depends on `build`, downloads the `portfolio-build` artifact, and publishes it to the selected platform such as GitHub Pages, Netlify, Vercel, Firebase Hosting, or a custom server.

How to verify it locally:

```bash
npm ci
npm run build:ci
```

How to verify it on GitHub:

1. Push a branch to GitHub
2. Open a pull request against `main`, or push directly to `main`
3. Check the `CI` workflow in the repository Actions tab
4. Confirm the `Build Angular App` job finishes successfully

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

For CI usage, this repository also includes:

```bash
npm run build:ci
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
