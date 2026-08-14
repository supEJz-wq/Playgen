# QA Manual

Manual QA workspace for **Playgen**. Everything here is created and maintained by hand (no automation).

## Folder structure

| Folder           | What goes in it                                                                 |
| ---------------- | ------------------------------------------------------------------------------- |
| `test-cases/`    | One file per test case or feature — preconditions, steps, expected results       |
| `test-plans/`    | Test strategy documents — what to test, in what order, per release/feature       |
| `bug-reports/`   | Bug tickets — how to reproduce, severity, affected area, screenshots             |
| `test-data/`     | Sample input data — test accounts, login credentials, payloads, edge-case values |
| `screenshots/`   | Evidence screenshots — organized by feature/date, linked from test cases & bugs  |
| `manual-testing/`| Execution checklists, session logs, and sign-off records                          |

## Rules

- Never delete or rename anything without explicit instruction.
- Name files descriptively, e.g. `TC-001-login-valid-credentials.md`, `BUG-014-dashboard-not-loading.md`.
- Screenshot files: `feature-date-description.png`.