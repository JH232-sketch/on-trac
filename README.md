# On-Trac

A cardio tracking web app prototype. Log a workout in a few clicks and see your progress update right away.

**Live site:** https://jh232-sketch.github.io/on-trac/

## Features

- **Dashboard:** weekly distance, time, estimated calories, workouts, current streak, a weekly chart, and a goal lap around a track
- **Track workout:** running, walking, cycling, treadmill, StairMaster, or other, with a live stopwatch and calorie estimate
- **History:** all sessions, filterable by activity, with delete
- **Progress & stats:** 8-week charts, personal records, and a monthly calendar
- **Profile:** name, email, age, weight, weekly goal, dark mode, sample data

## Project structure

```
on-trac/
├── index.html        Page markup (all five views)
├── css/styles.css    Styles, light and dark themes
├── js/logic.js       Pure helpers: calories, week start, streak, date utils
├── js/app.js         UI: state, rendering, routing, event handlers
├── tests/
│   ├── tests.js      Unit tests for logic.js
│   └── tests.html    Browser test runner
├── .gitignore
└── README.md
```

## Build and run

There is no build step.

**Dependencies:** a modern web browser. The only external resource is Google Fonts (optional; the app falls back to system fonts offline).

1. Download or clone the repo.
2. Open `index.html` in a browser.
3. Sign up with any name and email. Use **Profile → Load sample data** to fill the charts.

## Run the tests

- **Browser:** open `tests/tests.html`. It shows PASS or FAIL for each test.
- **Node (optional, v14+):** from the repo root run:

  ```
  node -e "const fs=require('fs');require('vm').runInThisContext(fs.readFileSync('js/logic.js','utf8')+'\n'+fs.readFileSync('tests/tests.js','utf8'))"
  ```

The tests cover the calorie formula, week boundaries, streak counting, date helpers, and HTML escaping.

## How it works

- Data is saved in the browser with `localStorage`, so it stays on one device.
- Calories are estimated as `MET × weight (kg) × hours`, using 160 lb if no weight is set.
- Weeks run Monday through Sunday.

## Known limitations

- Sign-in is a local profile, not real authentication. Accounts and passwords need a backend.
- No cross-device sync.
- Calorie values are estimates and not medical advice.

## Commit message convention

`feat:` new feature, `fix:` bug fix, `refactor:` code restructuring, `test:` tests, `docs:` documentation.

## AI assistance

The first version of this code was generated with Claude (Anthropic). It was then reviewed, restructured into modules, and covered with unit tests. See the prompt log in the course report for the prompts and how the output was verified.
