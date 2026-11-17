// On-Trac pure helpers: no DOM access, so they can be unit tested.

// MET (metabolic equivalent) values used for calorie estimates.
const MET = { Running: 9.8, Walking: 3.8, Cycling: 7.5, Treadmill: 8.3, StairMaster: 9, Other: 6 };
const DEFAULT_WEIGHT_LB = 160;

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addD = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const round = (n, p = 1) => Math.round(n * 10 ** p) / 10 ** p;
const sum = (a, k) => a.reduce((t, s) => t + (s[k] || 0), 0);
const esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');

// Estimated calories = MET x weight (kg) x hours. Falls back to 160 lb if weight is missing.
function calories(type, mins, weightLb) {
  const met = MET[type] ?? MET.Other;
  return Math.round(met * (weightLb || DEFAULT_WEIGHT_LB) * 0.4536 * mins / 60);
}

// Monday of the week that contains the given date.
function weekStart(date) {
  return addD(date, -((date.getDay() + 6) % 7));
}

// Consecutive days with a workout, counting back from today (or yesterday if today is empty).
function streak(dateStrings, today) {
  const days = new Set(dateStrings);
  let cur = today, n = 0;
  if (!days.has(iso(cur))) cur = addD(cur, -1);
  while (days.has(iso(cur))) { n++; cur = addD(cur, -1); }
  return n;
}
