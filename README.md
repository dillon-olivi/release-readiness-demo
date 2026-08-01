# Release Readiness Dashboard

[![Quality Checks](https://github.com/YOUR_GITHUB_USERNAME/release-readiness-demo/actions/workflows/quality-and-pages.yml/badge.svg)](https://github.com/YOUR_GITHUB_USERNAME/release-readiness-demo/actions/workflows/quality-and-pages.yml)
[![Live Demo](https://img.shields.io/badge/live_demo-open-6d8cff)](https://YOUR_GITHUB_USERNAME.github.io/release-readiness-demo/)

**[Open the live demo](https://YOUR_GITHUB_USERNAME.github.io/release-readiness-demo/)** · **[View the automated test report](https://YOUR_GITHUB_USERNAME.github.io/release-readiness-demo/test-report/)**

![Release Readiness Dashboard](assets/dashboard-preview.png)

A recruiter-first SDET portfolio project demonstrating a working product, shared business rules, REST API development, layered automation, negative testing, CI/CD, and published test evidence.

Recruiters do **not** need to download the repository or install Node.js. GitHub Actions runs the complete automation suite and GitHub Pages hosts both the interactive application and the Playwright HTML report.

## What this project proves

| Area | Evidence |
| --- | --- |
| Software engineering | Modular JavaScript, shared business rules, Node.js HTTP server, REST endpoints, validation, and error handling |
| Unit testing | Isolated release-gate logic tested with Node's built-in test runner |
| API automation | Playwright request tests covering contracts, state changes, and malformed input |
| UI automation | Accessible locators and deterministic assertions for the critical release workflow |
| CI/CD | Every push runs all test layers; successful main-branch runs deploy the live demo |
| Debuggability | Published Playwright HTML report plus retained traces, screenshots, and video on failure |
| Product thinking | Clear quality gates determine whether a release can ship |

## Architecture

```text
Recruiter browser
      │
      ▼
GitHub Pages live demo ──► shared release rules
                                ▲
                                │
Node.js REST API ────────────────┘
      ▲
      │
Playwright API + UI tests
      │
      ▼
GitHub Actions ──► test report ──► Pages deployment
```

The static live demo uses the same `calculateReleaseSummary()` module as the tested Node.js API. That keeps the public experience install-free without hiding the backend and automation implementation.

## Test layers

```text
tests/
  unit/   Fast release-rule checks
  api/    REST contract, validation, and state tests
  ui/     Critical browser workflow tests
```

## Local development — optional

Local setup is only for engineers who want to modify or run the code themselves:

```bash
npm install
npx playwright install chromium
npm test
npm start
```

Then open `http://127.0.0.1:3000`.

## CI/CD behavior

The workflow in `.github/workflows/quality-and-pages.yml`:

1. Installs Node.js and project packages on a GitHub-hosted runner.
2. Runs unit, API, and UI automation.
3. Uploads the full Playwright report as a workflow artifact.
4. Publishes the live demo and report to GitHub Pages only after tests pass.

## Interview walkthrough

Be ready to explain:

1. Why the quality rules are separated from the API and UI.
2. Why unit, API, and UI tests cover different risks.
3. Why the API tests include invalid input instead of only happy paths.
4. How test isolation is maintained through API state resets and fresh browser pages.
5. Why deployment depends on a successful quality job.
6. What you would add next: persistence, schema validation, authentication, or parallel test execution.

## Resume bullet

> Built and deployed a release-readiness application with shared JavaScript business rules, a Node.js REST API, and layered Playwright automation across unit, API, and browser workflows; integrated GitHub Actions to gate deployment and publish test evidence through GitHub Pages.

## Repository structure

```text
src/
  public/
    index.html            Recruiter-facing live demo
    app.js                Interactive workflow
    release-logic.js      Shared, testable quality rules
    styles.css            Responsive interface
  server.js               Node.js server and REST API
tests/
  unit/                    Business-rule tests
  api/                     REST API tests
  ui/                      Browser workflow tests
.github/workflows/
  quality-and-pages.yml   Test, report, and deployment pipeline
```

## Before publishing

Follow `GITHUB_SETUP.md`. Replace every `YOUR_GITHUB_USERNAME` value in this README after creating the repository.
