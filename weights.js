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
  function deltaText(who) {
    const r = rec(who);
    if (r.current == null || r.start == null) return { line: 'Enter start and today', cls: 'flat' };
    const diff = Math.round((r.current - r.start) * 10) / 10;
    if (diff === 0) return { line: 'Even with start', cls: 'flat' };
    if (diff < 0) return { line: 'Down ' + Math.abs(diff) + ' lb', cls: 'down' };
    return { line: 'Up ' + diff + ' lb', cls: 'up' };
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
    all[who] = { start: start, current: now, logs: logs.slice(-60) };
    saveW(all);
    if (typeof selectedPerson !== 'undefined' && selectedPerson === who && typeof togglePerson === 'function') {
      var keep = selectedPerson;
      selectedPerson = null;
      togglePerson(keep);
    }
  };
  function weightCard(who) {
    const r = rec(who);
    const d = deltaText(who);
    var n = { dad: 'Thomas', mom: 'Allyson', son: 'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    const label = who === 'dad' ? n.dad : (who === 'mom' ? n.mom : n.son);
    const goal = GOAL[who];
    var extra = '';
    if (goal && r.current != null) {
      const left = Math.round((r.current - goal) * 10) / 10;
      extra = left > 0 ? '<p class="wmeta">' + left + ' lb to ' + goal + '</p>' : '<p class="wmeta">At goal</p>';
    }
    return '<div class="card"><h2>Weight \u00b7 ' + label + '</h2>' +
      '<p class="wdelt ' + d.cls + '">' + d.line + '</p>' +
      '<label>Start <input type="number" inputmode="decimal" id="w-start-' + who + '" value="' + (r.start != null ? r.start : '') + '" placeholder="0" /></label>' +
      '<label>Today <input type="number" inputmode="decimal" id="w-now-' + who + '" value="' + (r.current != null ? r.current : '') + '" placeholder="0" /></label>' +
      extra +
      '<button type="button" class="btn" onclick="saveWeight(\'' + who + '\')">Save weigh-in</button>' +
      '<p class="note" style="margin-top:8px">Morning, after the bathroom, before breakfast. First save sets the start if it is still blank.</p></div>';
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
