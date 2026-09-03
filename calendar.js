(function () {
  const ICS_HTTP = 'https://thomastramel2011-debug.github.io/tramel-family-calendar/holidays.ics';
  const ICS_WEB = 'webcal://thomastramel2011-debug.github.io/tramel-family-calendar/holidays.ics';
  const GCAL = 'https://calendar.google.com/calendar/r?cid=' + encodeURIComponent(ICS_HTTP);
  const HOLIDAYS = [{"d":"2026-01-01","n":"New Year's Day","k":"US"},{"d":"2026-01-06","n":"Epiphany","k":"Christian"},{"d":"2026-01-19","n":"Martin Luther King Jr. Day","k":"US"},{"d":"2026-02-02","n":"Candlemas","k":"Christian"},{"d":"2026-02-14","n":"Valentine's Day","k":"US"},{"d":"2026-02-16","n":"Presidents' Day","k":"US"},{"d":"2026-02-18","n":"Ash Wednesday","k":"Christian"},{"d":"2026-03-17","n":"St. Patrick's Day","k":"US"},{"d":"2026-03-25","n":"Annunciation","k":"Christian"},{"d":"2026-03-29","n":"Palm Sunday","k":"Christian"},{"d":"2026-04-02","n":"Maundy Thursday","k":"Christian"},{"d":"2026-04-03","n":"Good Friday","k":"Christian"},{"d":"2026-04-04","n":"Holy Saturday","k":"Christian"},{"d":"2026-04-05","n":"Easter Sunday","k":"Christian"},{"d":"2026-05-10","n":"Mother's Day","k":"US"},{"d":"2026-05-14","n":"Ascension","k":"Christian"},{"d":"2026-05-24","n":"Pentecost","k":"Christian"},{"d":"2026-05-25","n":"Memorial Day","k":"US"},{"d":"2026-05-31","n":"Trinity Sunday","k":"Christian"},{"d":"2026-06-14","n":"Flag Day","k":"US"},{"d":"2026-06-19","n":"Juneteenth","k":"US"},{"d":"2026-06-21","n":"Father's Day","k":"US"},{"d":"2026-07-04","n":"Independence Day","k":"US"},{"d":"2026-08-15","n":"Assumption","k":"Christian"},{"d":"2026-09-07","n":"Labor Day","k":"US"},{"d":"2026-10-12","n":"Columbus Day / Indigenous Peoples' Day","k":"US"},{"d":"2026-10-31","n":"Halloween / Reformation Day","k":"US / Christian"},{"d":"2026-11-01","n":"All Saints' Day","k":"Christian"},{"d":"2026-11-11","n":"Veterans Day","k":"US"},{"d":"2026-11-26","n":"Thanksgiving","k":"US"},{"d":"2026-11-29","n":"First Sunday of Advent","k":"Christian"},{"d":"2026-12-24","n":"Christmas Eve","k":"Christian"},{"d":"2026-12-25","n":"Christmas Day","k":"Christian / US"},{"d":"2026-12-26","n":"St. Stephen's Day","k":"Christian"},{"d":"2026-12-31","n":"New Year's Eve","k":"US"}];
  function isoToday() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function labels() {
    var n = { dad:'Thomas', mom:'Allyson', son:'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    return n;
  }
  function loadTodos() {
    try { return JSON.parse(localStorage.getItem('tramel-todos-' + isoToday())) || []; } catch (e) { return []; }
  }
  function saveTodos(list) { localStorage.setItem('tramel-todos-' + isoToday(), JSON.stringify(list)); }
  function loadBdays() {
    try { return JSON.parse(localStorage.getItem('tramel-bdays')) || { dad:'', mom:'', son:'', extra:[] }; } catch (e) { return { dad:'', mom:'', son:'', extra:[] }; }
  }
  function saveBdays(b) { localStorage.setItem('tramel-bdays', JSON.stringify(b)); }
  window.addTodo = function () {
    var el = document.getElementById('todoIn');
    if (!el || !el.value.trim()) return;
    var list = loadTodos();
    list.push({ t: el.value.trim(), done: false });
    saveTodos(list);
    paintTodo();
  };
  window.toggleTodo = function (i) {
    var list = loadTodos();
    if (!list[i]) return;
    list[i].done = !list[i].done;
    saveTodos(list);
    paintTodo();
  };
  window.dropTodo = function (i) {
    var list = loadTodos();
    list.splice(i, 1);
    saveTodos(list);
    paintTodo();
  };
  window.saveBdaysUI = function () {
    var b = loadBdays();
    b.dad = (document.getElementById('bdDad') || {}).value || '';
    b.mom = (document.getElementById('bdMom') || {}).value || '';
    b.son = (document.getElementById('bdSon') || {}).value || '';
    saveBdays(b);
    paintCal();
  };
  function holidaysOn(dayIso) { return HOLIDAYS.filter(function (h) { return h.d === dayIso; }); }
  function upcoming(n) {
    var today = isoToday();
    return HOLIDAYS.filter(function (h) { return h.d >= today; }).slice(0, n || 6);
  }
  function birthdayHits(dayIso) {
    var b = loadBdays(); var n = labels(); var md = dayIso.slice(5); var out = [];
    if (b.dad && b.dad.slice(5) === md) out.push(n.dad);
    if (b.mom && b.mom.slice(5) === md) out.push(n.mom);
    if (b.son && b.son.slice(5) === md) out.push(n.son);
    return out;
  }
  function todoCard() {
    var list = loadTodos();
    var rows = list.map(function (item, i) {
      return '<div class="todo-row"><label><input type="checkbox" ' + (item.done ? 'checked' : '') + ' onchange="toggleTodo(' + i + ')" /> <span class="' + (item.done ? 'done' : '') + '">' + item.t.replace(/</g,'') + '</span></label><button type="button" class="ghost tiny" onclick="dropTodo(' + i + ')">x</button></div>';
    }).join('');
    if (!rows) rows = '<p class="note">Nothing yet. Add the first item.</p>';
    return '<div class="card" id="todoCard"><h2>Daily to-do</h2>' + rows + '<div class="todo-add"><input id="todoIn" type="text" placeholder="Add a task" onkeydown="if(event.key===\'Enter\')addTodo()" /><button type="button" class="btn" onclick="addTodo()">Add</button></div><p class="note">This list is for today. It clears tomorrow.</p></div>';
  }
  function holidayCard() {
    var today = isoToday();
    var here = holidaysOn(today);
    var bday = birthdayHits(today);
    var now = here.map(function (h) { return '<p><b>' + h.n + '</b> \u00b7 ' + h.k + '</p>'; }).join('');
    if (bday.length) now += '<p><b>Birthday</b> \u00b7 ' + bday.join(', ') + '</p>';
    if (!now) now = '<p class="note">No holiday today.</p>';
    var next = upcoming(8).map(function (h) { return '<p>' + h.d.slice(5) + ' \u00b7 ' + h.n + ' <span class="note">(' + h.k + ')</span></p>'; }).join('');
    var n = labels(); var b = loadBdays();
    return '<div class="card" id="holCard"><h2>Today on the calendar</h2>' + now +
      '<h2 style="margin-top:14px">Coming up</h2>' + next +
      '<h2 style="margin-top:14px">Birthdays</h2>' +
      '<label>' + n.dad + ' <input type="date" id="bdDad" value="' + (b.dad || '') + '" /></label>' +
      '<label>' + n.mom + ' <input type="date" id="bdMom" value="' + (b.mom || '') + '" /></label>' +
      '<label>' + n.son + ' <input type="date" id="bdSon" value="' + (b.son || '') + '" /></label>' +
      '<button type="button" class="btn" onclick="saveBdaysUI()">Save birthdays</button>' +
      '<h2 style="margin-top:14px">Link to your calendars</h2>' +
      '<p class="note">US and Christian holidays 2026–2028 are in the subscribe file.</p>' +
      '<a class="btn" href="' + ICS_WEB + '">Add to iPhone Calendar</a>' +
      '<a class="btn" href="' + GCAL + '" target="_blank" rel="noopener">Add to Google Calendar</a>' +
      '<a class="btn" href="' + ICS_HTTP + '">Download holiday file</a>' +
      '<p class="note">iPhone: tap Add to iPhone Calendar, then Subscribe.</p></div>';
  }
  function paintTodo() {
    var card = document.getElementById('todoCard');
    if (!card) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = todoCard();
    card.replaceWith(wrap.firstChild);
  }
  function paintCal() {
    var card = document.getElementById('holCard');
    if (!card) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = holidayCard();
    card.replaceWith(wrap.firstChild);
  }
  function inject() {
    var view = document.getElementById('view-today');
    if (!view) return;
    if (document.getElementById('todoCard')) return;
    var wrap = document.createElement('div');
    wrap.innerHTML = todoCard() + holidayCard();
    view.appendChild(wrap);
  }
  if (typeof renderToday === 'function') {
    var orig = renderToday;
    renderToday = function () { orig(); inject(); };
  }
  if (typeof renderShare === 'function') {
    var origShare = renderShare;
    renderShare = function () {
      origShare();
      var view = document.getElementById('view-share');
      if (!view) return;
      var wrap = document.createElement('div');
      wrap.innerHTML = holidayCard();
      view.insertBefore(wrap, view.firstChild);
    };
  }
  try { inject(); } catch (e) {}
})();
