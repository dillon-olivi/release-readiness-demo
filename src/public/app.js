import { calculateReleaseSummary } from './release-logic.js';

const initialRelease = Object.freeze({
  version: '2.4.0',
  tests: { passed: 8, failed: 1, skipped: 1 },
  criticalBugs: 1,
  lastRun: 'Not run in this session'
});

let release = structuredClone(initialRelease);
let busy = false;

const elements = {
  status: document.querySelector('#status'),
  statusPill: document.querySelector('#status-pill'),
  passRate: document.querySelector('#pass-rate'),
  failedTests: document.querySelector('#failed-tests'),
  criticalBugs: document.querySelector('#critical-bugs'),
  message: document.querySelector('#message'),
  gateCount: document.querySelector('#gate-count'),
  decisionDetail: document.querySelector('#decision-detail'),
  runSmoke: document.querySelector('#run-smoke'),
  resolveBug: document.querySelector('#resolve-bug'),
  reset: document.querySelector('#reset')
};

const gates = {
  passRate: document.querySelector('#gate-pass-rate'),
  failedTests: document.querySelector('#gate-failed-tests'),
  criticalBugs: document.querySelector('#gate-critical-bugs')
};

function setGate(element, passing, detail) {
  element.classList.toggle('passing', passing);
  element.querySelector('.gate-icon').textContent = passing ? '✓' : '×';
  element.querySelector('small').textContent = detail;
}

function render() {
  const summary = calculateReleaseSummary(release);
  const checks = {
    passRate: summary.passRate >= 90,
    failedTests: summary.tests.failed === 0,
    criticalBugs: summary.criticalBugs === 0
  };
  const passingCount = Object.values(checks).filter(Boolean).length;

  elements.status.textContent = summary.status;
  elements.statusPill.className = `status-pill status-${summary.status.toLowerCase()}`;
  elements.passRate.textContent = `${summary.passRate}%`;
  elements.failedTests.textContent = String(summary.tests.failed);
  elements.criticalBugs.textContent = String(summary.criticalBugs);
  elements.gateCount.textContent = `${passingCount} / 3 passing`;
  elements.decisionDetail.textContent = summary.status === 'READY' ? 'APPROVED TO DEPLOY' : 'DO NOT DEPLOY';

  setGate(gates.passRate, checks.passRate, `Currently ${summary.passRate}%`);
  setGate(
    gates.failedTests,
    checks.failedTests,
    checks.failedTests ? 'No failures detected' : `Currently ${summary.tests.failed} failure`
  );
  setGate(
    gates.criticalBugs,
    checks.criticalBugs,
    checks.criticalBugs ? 'No critical bugs open' : `Currently ${summary.criticalBugs} open`
  );

  elements.runSmoke.disabled = busy || summary.tests.failed === 0;
  elements.resolveBug.disabled = busy || summary.criticalBugs === 0;
  elements.reset.disabled = busy;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function perform({ pending, success, update }) {
  if (busy) return;
  busy = true;
  elements.message.textContent = pending;
  render();

  await wait(650);
  update();
  busy = false;
  elements.message.textContent = success;
  render();
}

elements.runSmoke.addEventListener('click', () =>
  perform({
    pending: 'Running 12 smoke tests across the critical path…',
    success: 'Smoke suite passed: 12/12 tests. One blocker remains.',
    update: () => {
      release.tests = { passed: 12, failed: 0, skipped: 0 };
      release.lastRun = new Date().toISOString();
    }
  })
);

elements.resolveBug.addEventListener('click', () =>
  perform({
    pending: 'Verifying the critical defect resolution…',
    success: 'Critical defect verified. All quality gates are passing.',
    update: () => {
      release.criticalBugs = 0;
    }
  })
);

elements.reset.addEventListener('click', () => {
  release = structuredClone(initialRelease);
  elements.message.textContent = 'Demo reset. Two blockers prevent this release from shipping.';
  render();
});

function inferRepositoryUrl() {
  const host = window.location.hostname;
  if (!host.endsWith('.github.io')) return null;

  const owner = host.slice(0, -'.github.io'.length);
  const [repository] = window.location.pathname.split('/').filter(Boolean);
  if (!repository) return `https://github.com/${owner}/${owner}.github.io`;
  return `https://github.com/${owner}/${repository}`;
}

const repositoryUrl = inferRepositoryUrl();
for (const link of [document.querySelector('#source-link'), document.querySelector('#source-link-bottom')]) {
  if (repositoryUrl) {
    link.href = repositoryUrl;
  } else {
    link.href = 'https://github.com/';
    link.title = 'Repository link is automatically detected after GitHub Pages deployment.';
  }
}

render();
