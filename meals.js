(function () {
  const KCAL = { dad: 2200, son: 2400, mom: 1700 };
  const SPLIT = {
    dad: { b: 550, l: 700, d: 750, s: 200 },
    son: { b: 600, l: 750, d: 800, s: 250 },
    mom: { b: 400, l: 550, d: 650, s: 100 }
  };
  function yt(q) {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q + ' recipe');
  }
  const HOW = {
    'Egg skillet + yogurt': 'Heat a nonstick skillet on medium. Spray or 1 tsp butter. Beat eggs with a pinch of salt. Pour in. Soft scramble 2-3 min. Plate. Side: plain Greek yogurt. Men: 3 eggs + 1 cup yogurt. Allyson: 2 eggs + yogurt and fruit.',
    'Eggs and sausage': 'Brown 1 pork patty. Pour off grease. Beat eggs. Scramble in the same pan. Yogurt on the side. Allyson can skip the extra sausage.',
    'Yogurt bowl and eggs': 'Yogurt in a bowl. Berries if you have them. Soft scramble eggs in a skillet. Men add a whey shake if still hungry.',
    'Leftover-meat omelette': 'Beat eggs. Hot pan, spray. Pour eggs. Add 3 oz chopped leftover meat and salsa on one half. Fold. Fruit for Allyson.',
    'Walk-day scramble': 'Eggs plus leftover spinach if it is there. Soft scramble 2-3 min. Whey or yogurt after the walk.',
    'Eggs and cottage or yogurt': 'Eggs in a skillet. Cup of yogurt or cottage on the side. Fruit for Allyson.',
    'Bigger Saturday scramble': 'Bigger pan. 3-4 eggs, optional sausage. Yogurt. Allyson keeps toast or fruit if she wants starch.',
    'Sunday leftover bowls': 'Reheat leftover meat in a dry pan. 8 oz men, 4-5 oz Allyson. Vinegar slaw or bagged salad. Salsa. No extra oil.',
    'Chicken + slaw': 'Slice Sunday chicken. Slaw: bagged cabbage, 2 Tbsp vinegar, 1 tsp mustard, salt. Toss. Pickle on the side.',
    'Beef + salad': 'Reheat beef in a dry pan. Bagged salad. Mustard or salsa. Allyson may add a small potato.',
    'Pork + green beans': 'Reheat pork. Green beans hot in the same pan 3 min. Mustard. Fruit for Allyson.',
    'Chicken bowls': 'Warm chicken. Peppers or salad. Salsa. No tortilla for the men. Allyson may take one small corn tortilla.',
    'Fish or tuna plate': 'Leftover catfish or 2 cans tuna, drained. Salad. Lemon. Light mayo only if needed. Crackers only for Allyson.',
    'Leftover Saturday bowls': 'Whatever is left. 8 oz men, 4-5 oz Allyson. Two cups veg. Salsa. Rice or potato is hers.'
  };
  function labels() {
    var n = { dad: 'Thomas', mom: 'Allyson', son: 'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    return n;
  }
  function info(kind, day) {
    var title, how, time, pull, steps, swap;
    if (kind === 'breakfast') {
      title = BREAKFAST[day].family;
      how = HOW[title] || 'Cook the eggs. Measure the yogurt. Keep the ounces.';
    } else if (kind === 'lunch') {
      title = LUNCH[day].family;
      how = HOW[title] || 'Reheat the meat. Pile the vegetables. Salsa or mustard. Men skip the starch.';
    } else {
      var r = recipeFor(day);
      title = r.title;
      time = r.time; pull = r.pull; steps = r.steps; swap = r.swap;
      how = 'This is the family dinner. Follow Pull and Cook below.';
    }
    return { title: title, how: how, video: yt(title), time: time, pull: pull, steps: steps, swap: swap };
  }
  window.showMeal = function (kind, day) {
    var m = info(kind, day);
    var box = document.getElementById('meal-modal');
    if (!box) { box = document.createElement('div'); box.id = 'meal-modal'; document.body.appendChild(box); }
    var extra = '';
    if (m.time) extra += '<p class="note">' + m.time + '</p>';
    if (m.pull) extra += '<p><b>Pull</b> ' + m.pull + '</p>';
    if (m.steps) extra += '<p><b>Cook</b> ' + m.steps + '</p>';
    if (m.swap) extra += '<p><b>Swap</b> ' + m.swap + '</p>';
    extra += '<p>' + m.how + '</p>';
    var n = labels();
    extra += '<p class="note">Plates: ' + n.dad + ' and ' + n.son + ' 8 oz meat. ' + n.mom + ' 4-5 oz and she keeps starch.</p>';
    box.innerHTML = '<div class="meal-sheet" role="dialog"><h2>' + m.title + '</h2>' + extra +
      '<a class="btn" href="' + m.video + '" target="_blank" rel="noopener">Watch a video</a>' +
      '<button type="button" class="ghost" onclick="closeMeal()">Close</button></div>';
    box.className = 'meal-modal on';
    box.onclick = function (e) { if (e.target === box) closeMeal(); };
  };
  window.closeMeal = function () {
    var box = document.getElementById('meal-modal');
    if (box) box.className = 'meal-modal';
  };
  function mealBtn(kind, day, text) {
    return '<button type="button" class="meal-link" onclick="showMeal(\'' + kind + '\',' + day + ')">' + text + '</button>';
  }
  function kcalLine(who) {
    var n = labels();
    var label = who === 'dad' ? n.dad : (who === 'mom' ? n.mom : n.son);
    var s = SPLIT[who];
    return '<div class="kcal-box ' + who + '"><h3>' + label + '</h3><p class="kcal-num">' + KCAL[who].toLocaleString() + ' kcal</p><p class="note">B ' + s.b + ' \u00b7 L ' + s.l + ' \u00b7 D ' + s.d + ' \u00b7 extra ' + s.s + '</p></div>';
  }
  function kcalCard() {
    return '<div class="card"><h2>Daily calories</h2><div class="kcal-row">' + kcalLine('dad') + kcalLine('son') + kcalLine('mom') + '</div><p class="note">Men are in a cut. Allyson is at maintenance. These are working targets, not a lab number.</p></div>';
  }
  function todayMealCard(day) {
    return '<div class="card"><h2>Tap a meal for the recipe</h2><p class="note">The recipe is in the app. Watch a video if you want to see it cooked.</p><div class="meal-btns">' +
      mealBtn('breakfast', day, 'Breakfast \u00b7 ' + BREAKFAST[day].family) +
      mealBtn('lunch', day, 'Lunch \u00b7 ' + LUNCH[day].family) +
      mealBtn('dinner', day, 'Dinner \u00b7 ' + recipeFor(day).title) +
      '</div></div>';
  }
  if (typeof plateCard === 'function') {
    plateCard = function (day) {
      var p = platesFor(day); var n = p.names;
      return '<div class="card"><h2>Suggested plates</h2><div class="plate">' +
        '<div><h3 style="color:#5b9fd4">' + n.dad + '</h3><p><b>Day</b> ' + KCAL.dad.toLocaleString() + ' kcal</p><p><b>B</b> ' + mealBtn('breakfast', day, p.breakfast.dad) + '</p><p><b>L</b> ' + mealBtn('lunch', day, p.lunch.dad) + '</p><p><b>D</b> ' + mealBtn('dinner', day, p.dinner.dad) + '</p></div>' +
        '<div><h3 style="color:#7d6ad9">' + n.son + '</h3><p><b>Day</b> ' + KCAL.son.toLocaleString() + ' kcal</p><p><b>B</b> ' + mealBtn('breakfast', day, p.breakfast.son) + '</p><p><b>L</b> ' + mealBtn('lunch', day, p.lunch.son) + '</p><p><b>D</b> ' + mealBtn('dinner', day, p.dinner.son) + '</p></div>' +
        '<div><h3 style="color:#d46b8a">' + n.mom + '</h3><p><b>Day</b> ' + KCAL.mom.toLocaleString() + ' kcal</p><p><b>B</b> ' + mealBtn('breakfast', day, p.breakfast.mom) + '</p><p><b>L</b> ' + mealBtn('lunch', day, p.lunch.mom) + '</p><p><b>D</b> ' + mealBtn('dinner', day, p.dinner.mom) + '</p></div>' +
        '</div></div>';
    };
  }
  if (typeof personHtml === 'function') {
    var origPerson = personHtml;
    personHtml = function (who) {
      var day = new Date().getDay();
      var s = SPLIT[who];
      var n = labels();
      var label = who === 'dad' ? n.dad : (who === 'mom' ? n.mom : n.son);
      var head = '<div class="card"><h2>Daily calories \u00b7 ' + label + '</h2><p class="kcal-num">' + KCAL[who].toLocaleString() + ' kcal</p><p class="note">Breakfast ' + s.b + ' \u00b7 Lunch ' + s.l + ' \u00b7 Dinner ' + s.d + ' \u00b7 leftover room ' + s.s + '</p></div>';
      return head + origPerson(who) + todayMealCard(day);
    };
  }
  if (typeof renderToday === 'function') {
    var origToday = renderToday;
    renderToday = function () {
      origToday();
      if (typeof selectedPerson !== 'undefined' && selectedPerson) return;
      var view = document.getElementById('view-today');
      if (!view) return;
      var wrap = document.createElement('div');
      wrap.innerHTML = kcalCard() + todayMealCard(new Date().getDay());
      view.insertBefore(wrap, view.children[1] || null);
    };
  }
  if (typeof renderMeals === 'function') {
    var origMeals = renderMeals;
    renderMeals = function () {
      origMeals();
      var view = document.getElementById('view-meals');
      if (!view) return;
      var wrap = document.createElement('div');
      wrap.innerHTML = kcalCard();
      view.insertBefore(wrap, view.firstChild);
      var cards = view.querySelectorAll('.card');
      cards.forEach(function (card, idx) {
        if (idx === 0) return;
        var day = idx - 1;
        if (day > 6) return;
        var h = card.querySelector('h2');
        if (!h) return;
        h.style.cursor = 'pointer';
        h.onclick = function () { showMeal('dinner', day); };
        var ps = card.querySelectorAll('p');
        if (ps[1]) { ps[1].style.cursor = 'pointer'; ps[1].onclick = function () { showMeal('breakfast', day); }; }
        if (ps[2]) { ps[2].style.cursor = 'pointer'; ps[2].onclick = function () { showMeal('lunch', day); }; }
      });
    };
  }
  try { renderToday(); } catch (e) {}
})();
