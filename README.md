# On-Trac

A cardio tracking web app prototype. Log a workout in a few clicks and see your progress update right away.

## Pages

- **Dashboard**: weekly distance, time, estimated calories, workouts, a weekly activity chart, a goal lap around a track, and recent workouts
- **Track workout**: log running, walking, cycling, treadmill, StairMaster or other cardio, with a live stopwatch and calorie estimate
- **History**: every session, filterable by activity, with delete
- **Progress & stats**: 8-week minutes and distance charts, workouts per week, personal records, and a monthly calendar
- **Profile**: name, email, age, weight, weekly goal, dark mode, and sample data

## How it works

Plain HTML, CSS and JavaScript in a single `index.html`. No build step. Data is saved in the browser with `localStorage`, so it stays on one device.

Calories are estimated with MET values: `MET × weight (kg) × hours`.

## Run it

Open `index.html` in a browser.

## Deploy with GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Choose the `main` branch and the root folder, then save.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Prototype limits and next steps

- The sign-in screen is a local profile, not real authentication. Real accounts and password changes need a backend.
- Suggested upgrade path: Python Flask + SQLite or PostgreSQL for accounts and cloud storage, and Chart.js for richer charts.
- Ideas: reminders, AI fitness assistant, heart-rate zones.

*Not medical advice.*
