(function () {
  const START = { dad: 304, son: 304, mom: null };
  const GOAL = { dad: 224, son: 224, mom: null };
  function loadW() { try { return JSON.parse(localStorage.getItem('tramel-weights')) || {}; } catch (e) { return {}; } }
  function saveW(data) { localStorage.setItem('tramel-weights', JSON.stringify(data)); }
  function rec(who) {
    const all = loadW();
    const row = all[who] || {};
    return {
      start: row.start != null ? Number(row.start) : START[who],
      current: row.current != null ? Number(row.current) : (row.start != null ? Number(row.start) : START[who]),
      logs: row.logs || []
    };
  }
  function deltaText(who) {
    const r = rec(who);
    if (r.current == null || r.start == null || isNaN(r.current) || isNaN(r.start)) return { line: 'Set start + today', cls: 'flat' };
    const diff = Math.round((r.current - r.start) * 10) / 10;
    if (diff === 0) return { line: 'Even with start', cls: 'flat' };
    if (diff < 0) return { line: 'Down ' + Math.abs(diff) + ' lb', cls: 'down' };
    return { line: 'Up ' + diff + ' lb', cls: 'up' };
  }
  window.saveWeight = function (who) {
    const startEl = document.getElementById('w-start-' + who);
    const nowEl = document.getElementById('w-now-' + who);
    const start = startEl ? Number(startEl.value) : rec(who).start;
    const now = nowEl ? Number(nowEl.value) : rec(who).current;
    if (!now || isNaN(now)) return;
    const all = loadW();
    const prev = rec(who);
    const logs = prev.logs.slice();
    logs.push({ d: new Date().toISOString().slice(0, 10), w: now });
    all[who] = { start: start && !isNaN(start) ? start : prev.start, current: now, logs: logs.slice(-60) };
    saveW(all);
    renderWeights();
  };
  function box(who, label) {
    const r = rec(who);
    const d = deltaText(who);
    const goal = GOAL[who];
    const startVal = r.start != null ? r.start : '';
    const nowVal = r.current != null ? r.current : '';
    var extra = '';
    if (goal && r.current != null) {
      const left = Math.round((r.current - goal) * 10) / 10;
      extra = left > 0 ? '<p class="wmeta">' + left + ' lb to ' + goal + '</p>' : '<p class="wmeta">At goal</p>';
    }
    return '<div class="wbox ' + who + '"><h3>' + label + '</h3><p class="wdelt ' + d.cls + '">' + d.line + '</p><label>Start <input type="number" inputmode="decimal" id="w-start-' + who + '" value="' + startVal + '" /></label><label>Today <input type="number" inputmode="decimal" id="w-now-' + who + '" value="' + nowVal + '" /></label>' + extra + '<button type="button" class="ghost" onclick="saveWeight(\'' + who + '\')">Save</button></div>';
  }
  function labels() {
    var n = { dad: 'Thomas', mom: 'Allyson', son: 'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    return n;
  }
  window.renderWeights = function () {
    var host = document.getElementById('wtrack');
    if (!host) {
      host = document.createElement('div');
      host.id = 'wtrack';
      host.className = 'wtrack';
      var pills = document.querySelector('.pills');
      if (pills && pills.parentNode) pills.parentNode.insertBefore(host, pills.nextSibling);
      else document.querySelector('header').appendChild(host);
    }
    const n = labels();
    host.innerHTML = box('dad', n.dad) + box('mom', n.mom) + box('son', n.son);
  };
  if (typeof personHtml === 'function') {
    var orig = personHtml;
    personHtml = function (who) {
      const r = rec(who);
      const d = deltaText(who);
      const n = labels();
      const label = who === 'dad' ? n.dad : (who === 'mom' ? n.mom : n.son);
      const card = '<div class="card"><h2>Weight \u00b7 ' + label + '</h2><p class="wdelt ' + d.cls + '">' + (r.current != null ? r.current + ' lb \u00b7 ' + d.line : 'Log a weigh-in') + '</p><p class="note">Use the boxes under the names. Morning weigh-in after the bathroom, before breakfast.</p></div>';
      return orig(who) + card;
    };
  }
  renderWeights();
})();
