# Publish this project without installing Node.js

Use the exact repository name **`release-readiness-demo`** so the included links work predictably.

## 1. Create the repository

1. Sign in to GitHub.
2. Click the **+** menu in the upper-right corner.
3. Choose **New repository**.
4. Repository name: `release-readiness-demo`
5. Set it to **Public**.
6. Do not add a README, `.gitignore`, or license because they already exist here.
7. Click **Create repository**.

## 2. Upload the project

1. On the empty repository page, click **uploading an existing file**.
2. Open this extracted project folder on your computer.
3. Select everything inside the folder, including `.github`, `src`, `tests`, and the other files.
4. Drag those items into GitHub's upload area.
5. Enter the commit message: `Add release readiness portfolio project`
6. Click **Commit changes**.

If Windows does not show the `.github` folder, enable **View → Show → Hidden items** in File Explorer.

## 3. Enable GitHub Pages

1. Open the repository's **Settings** tab.
2. Select **Pages** in the left sidebar.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Return to the repository and open the **Actions** tab.
5. Open **Quality Checks & Live Demo** and allow the first run to complete.

The workflow installs Node.js and Playwright on GitHub's computer. You do not need them installed locally.

## 4. Open the live site

Your URL will be:

```text
https://YOUR_GITHUB_USERNAME.github.io/release-readiness-demo/
```

The automated report will be:

```text
https://YOUR_GITHUB_USERNAME.github.io/release-readiness-demo/test-report/
```

## 5. Fix the README links

1. Open `README.md` on GitHub.
2. Click the pencil icon.
3. Replace every `YOUR_GITHUB_USERNAME` with your actual GitHub username.
4. Commit the edit.

That edit triggers the tests and deployment again. When the run finishes, the README will show a live passing badge and working demo links.

## 6. Put it on applications

Use the live demo URL as the **Project URL** and the GitHub repository as the **Source Code** link.

Resume bullet:

> Built and deployed a release-readiness application with shared JavaScript business rules, a Node.js REST API, and layered Playwright automation across unit, API, and browser workflows; integrated GitHub Actions to gate deployment and publish test evidence through GitHub Pages.
