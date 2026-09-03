(function () {
  try {
    if (!localStorage.getItem('tramel-weights-cleared-k')) {
      localStorage.removeItem('tramel-weights');
      localStorage.setItem('tramel-weights-cleared-k', '1');
    }
  } catch (e) {}
  const GOAL = { dad: 224, son: 224, mom: null };
  function loadW() { try { return JSON.parse(localStorage.getItem('tramel-weights')) || {}; } catch (e) { return {}; } }
  function saveW(data) { localStorage.setItem('tramel-weights', JSON.stringify(data)); }
  function rec(who) {
    const row = loadW()[who] || {};
    const start = row.start != null && row.start !== '' ? Number(row.start) : null;
    const current = row.current != null && row.current !== '' ? Number(row.current) : null;
    return { start: start != null && !isNaN(start) ? start : null, current: current != null && !isNaN(current) ? current : null, logs: row.logs || [] };
  }
  function rnd(n) { return Math.round(n * 10) / 10; }
  function phrase(diff) {
    if (diff == null || isNaN(diff)) return { line: '—', cls: 'flat' };
    if (diff === 0) return { line: 'Even', cls: 'flat' };
    if (diff < 0) return { line: 'Down ' + Math.abs(diff) + ' lb', cls: 'down' };
    return { line: 'Up ' + diff + ' lb', cls: 'up' };
  }
  function monthKey(d) { return String(d).slice(0, 7); }
  function totals(who) {
    const r = rec(who);
    if (r.current == null) return { month: null, all: null };
    const all = r.start != null ? rnd(r.current - r.start) : null;
    const now = new Date();
    const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const logs = (r.logs || []).slice().sort(function (a, b) { return String(a.d).localeCompare(String(b.d)); });
    var before = null;
    var firstThis = null;
    for (var i = 0; i < logs.length; i++) {
      if (monthKey(logs[i].d) < ym) before = logs[i].w;
      if (monthKey(logs[i].d) === ym && firstThis == null) firstThis = logs[i].w;
    }
    var monthStart = before != null ? before : (firstThis != null ? firstThis : r.start);
    var month = monthStart != null ? rnd(r.current - monthStart) : null;
    return { month: month, all: all };
  }
  window.saveWeight = function (who) {
    const startEl = document.getElementById('w-start-' + who);
    const nowEl = document.getElementById('w-now-' + who);
    var start = startEl && startEl.value !== '' ? Number(startEl.value) : rec(who).start;
    var now = nowEl && nowEl.value !== '' ? Number(nowEl.value) : rec(who).current;
    if (now == null || isNaN(now)) return;
    if (start == null || isNaN(start)) start = now;
    const prev = rec(who);
    const logs = prev.logs.slice();
    logs.push({ d: new Date().toISOString().slice(0, 10), w: now });
    const all = loadW();
    all[who] = { start: start, current: now, logs: logs.slice(-90) };
    saveW(all);
    if (typeof selectedPerson !== 'undefined' && selectedPerson === who && typeof togglePerson === 'function') {
      var keep = selectedPerson;
      selectedPerson = null;
      togglePerson(keep);
    }
  };
  function weightCard(who) {
    const r = rec(who);
    const t = totals(who);
    const month = phrase(t.month);
    const all = phrase(t.all);
    var n = { dad: 'Thomas', mom: 'Allyson', son: 'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    const label = who === 'dad' ? n.dad : (who === 'mom' ? n.mom : n.son);
    const goal = GOAL[who];
    var extra = '';
    if (goal && r.current != null) {
      const left = rnd(r.current - goal);
      extra = left > 0 ? '<p class="wmeta">' + left + ' lb to ' + goal + '</p>' : '<p class="wmeta">At goal</p>';
    }
    return '<div class="card"><h2>Weight \u00b7 ' + label + '</h2>' +
      '<div class="wtotals">' +
      '<div><span class="wmeta">This month</span><p class="wdelt ' + month.cls + '">' + month.line + '</p></div>' +
      '<div><span class="wmeta">All time</span><p class="wdelt ' + all.cls + '">' + all.line + '</p></div>' +
      '</div>' +
      '<label>Start <input type="number" inputmode="decimal" id="w-start-' + who + '" value="' + (r.start != null ? r.start : '') + '" placeholder="0" /></label>' +
      '<label>Today <input type="number" inputmode="decimal" id="w-now-' + who + '" value="' + (r.current != null ? r.current : '') + '" placeholder="0" /></label>' +
      extra +
      '<button type="button" class="btn" onclick="saveWeight(\'' + who + '\')">Save weigh-in</button>' +
      '<p class="note" style="margin-top:8px">This month uses the last weigh-in from last month, or start if this is the first month. All time is today versus start.</p></div>';
  }
  function hideFront() {
    var host = document.getElementById('wtrack');
    if (host) host.remove();
  }
  if (typeof personHtml === 'function') {
    var orig = personHtml;
    personHtml = function (who) { return orig(who) + weightCard(who); };
  }
  hideFront();
})();
