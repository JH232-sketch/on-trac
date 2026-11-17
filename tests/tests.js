// Minimal test runner. Works in the browser (tests/tests.html) and in Node (see README).
const results = [];
function test(name, fn) {
  try { fn(); results.push({ name, ok: true }); }
  catch (e) { results.push({ name, ok: false, msg: e.message }); }
}
function eq(actual, expected) {
  if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`);
}
const D = (y, m, d) => new Date(y, m - 1, d);

// calories()
test('Running 60 min at 160 lb is about 711 cal', () => eq(calories('Running', 60, 160), 711));
test('Walking 30 min at 160 lb is about 138 cal', () => eq(calories('Walking', 30, 160), 138));
test('0 minutes gives 0 calories', () => eq(calories('Running', 0, 160), 0));
test('Missing weight falls back to 160 lb', () => eq(calories('Running', 60, null), calories('Running', 60, 160)));
test('Unknown activity uses the Other MET value', () => eq(calories('Curling', 60, 160), calories('Other', 60, 160)));
test('Heavier person burns more calories', () => eq(calories('Cycling', 45, 200) > calories('Cycling', 45, 150), true));

// weekStart()
test('Monday stays Monday', () => eq(iso(weekStart(D(2026, 11, 16))), '2026-11-16'));
test('Sunday belongs to the week starting the previous Monday', () => eq(iso(weekStart(D(2026, 11, 15))), '2026-11-09'));
test('Week start works across a month boundary', () => eq(iso(weekStart(D(2026, 12, 2))), '2026-11-30'));

// streak()
test('No workouts gives a streak of 0', () => eq(streak([], D(2026, 11, 17)), 0));
test('Workout today counts', () => eq(streak(['2026-11-17'], D(2026, 11, 17)), 1));
test('Streak may end yesterday', () => eq(streak(['2026-11-16', '2026-11-15'], D(2026, 11, 17)), 2));
test('A gap breaks the streak', () => eq(streak(['2026-11-17', '2026-11-15'], D(2026, 11, 17)), 1));
test('Last workout two days ago gives 0', () => eq(streak(['2026-11-15'], D(2026, 11, 17)), 0));
test('Multiple workouts in one day count once', () => eq(streak(['2026-11-17', '2026-11-17'], D(2026, 11, 17)), 1));

// date helpers
test('iso and parse round-trip', () => eq(iso(parse('2026-02-28')), '2026-02-28'));
test('addD handles leap day', () => eq(iso(addD(D(2028, 2, 28), 1)), '2028-02-29'));

// esc() and sum()
test('esc blocks HTML injection', () => eq(esc('<script>"x"</script>'), '&#60;script&#62;&#34;x&#34;&#60;/script&#62;'));
test('sum ignores missing values', () => eq(sum([{ a: 2 }, {}, { a: 3 }], 'a'), 5));

// report
const failed = results.filter(r => !r.ok).length;
if (typeof document !== 'undefined') {
  document.getElementById('summary').textContent = `${results.length - failed} of ${results.length} tests passed`;
  document.getElementById('out').innerHTML = results.map(r =>
    `<li class="${r.ok ? 'ok' : 'bad'}">${r.ok ? 'PASS' : 'FAIL'}: ${esc(r.name)}${r.ok ? '' : ' (' + esc(r.msg) + ')'}</li>`).join('');
} else {
  results.forEach(r => console.log(`${r.ok ? 'PASS' : 'FAIL'}: ${r.name}${r.ok ? '' : ' (' + r.msg + ')'}`));
  console.log(`${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
}
