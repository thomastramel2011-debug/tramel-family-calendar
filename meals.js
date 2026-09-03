(function () {
  const KCAL = { dad: 2200, son: 2400, mom: 1700 };
  const SPLIT = {
    dad: { b: 550, l: 700, d: 750, s: 200 },
    son: { b: 600, l: 750, d: 800, s: 250 },
    mom: { b: 400, l: 550, d: 650, s: 100 }
  };
  function searchUrl(q) {
    return 'https://www.allrecipes.com/search?q=' + encodeURIComponent(q);
  }
  const LINKS = {
    'Egg skillet + yogurt': 'https://www.allrecipes.com/recipe/262692/fluffy-scrambled-eggs/',
    'Eggs and sausage': searchUrl('sausage and scrambled eggs'),
    'Yogurt bowl and eggs': 'https://www.allrecipes.com/recipe/240233/greek-yogurt-parfait/',
    'Leftover-meat omelette': 'https://www.allrecipes.com/recipe/16383/basic-omelette-i/',
    'Walk-day scramble': 'https://www.allrecipes.com/recipe/262692/fluffy-scrambled-eggs/',
    'Eggs and cottage or yogurt': 'https://www.allrecipes.com/recipe/240233/greek-yogurt-parfait/',
    'Bigger Saturday scramble': 'https://www.allrecipes.com/recipe/262692/fluffy-scrambled-eggs/',
    'Sunday leftover bowls': searchUrl('leftover chicken salad bowl'),
    'Chicken + slaw': 'https://www.allrecipes.com/recipe/14168/super-easy-vinegar-coleslaw/',
    'Beef + salad': searchUrl('steak salad'),
    'Pork + green beans': searchUrl('pork chops green beans'),
    'Chicken bowls': searchUrl('chicken burrito bowl'),
    'Fish or tuna plate': 'https://www.allrecipes.com/recipe/14749/tuna-salad/',
    'Leftover Saturday bowls': searchUrl('leftover meat vegetable bowl'),
    'Beef skillet': searchUrl('ground beef pepper skillet'),
    'Chicken sheet pan': searchUrl('sheet pan chicken and vegetables'),
    'Pork + vinegar slaw': searchUrl('baked pork chops vinegar slaw'),
    'Baked catfish': 'https://www.allrecipes.com/recipe/51283/cajun-baked-catfish/',
    'Beef pepper skillet': searchUrl('beef pepper onion skillet'),
    'Chicken fajita bowls': 'https://www.allrecipes.com/recipe/46922/chicken-fajitas/',
    'Leftover skillet': searchUrl('leftover beef vegetable skillet'),
    'Stuffed peppers, beef': 'https://www.allrecipes.com/recipe/16330/stuffed-peppers/',
    'Mustard-herb chicken + cabbage steaks': searchUrl('mustard roasted chicken cabbage'),
    'Pork medallions, cider pan sauce': searchUrl('pork tenderloin apple cider'),
    'Catfish with tomato-cucumber relish': 'https://www.allrecipes.com/recipe/51283/cajun-baked-catfish/',
    'Beef and cabbage skillet': searchUrl('ground beef cabbage skillet'),
    'Lemon-garlic sheet chicken': searchUrl('lemon garlic sheet pan chicken'),
    'Smothered pork, vinegar onions': searchUrl('smothered pork chops onions'),
    'Catfish parcels': searchUrl('foil packet baked catfish'),
    'Beef fajita skillet': searchUrl('beef fajita skillet'),
    'Yogurt-spice roast chicken': searchUrl('yogurt roasted chicken'),
    'Kitchen-sink skillet': searchUrl('leftover skillet dinner')
  };
  const HOW = {
    'Egg skillet + yogurt': 'Nonstick skillet, medium. Butter or spray. Scramble eggs until just set. Salt. Side: plain Greek yogurt. Men: 3 eggs + 1 cup yogurt. Allyson: 2 eggs + yogurt and fruit.',
    'Eggs and sausage': 'Brown one pork patty. Wipe extra grease. Scramble eggs in the same pan. Yogurt on the side. Allyson can skip the extra sausage.',
    'Yogurt bowl and eggs': 'Yogurt in a bowl. Berries if you have them. Eggs in a skillet. Men add a whey shake if still hungry.',
    'Leftover-meat omelette': 'Beaten eggs into a hot pan. Add 3 oz chopped leftover meat and salsa. Fold. Fruit for Allyson.',
    'Walk-day scramble': 'Eggs plus leftover spinach if it is there. Soft scramble. Whey or yogurt after the walk.',
    'Eggs and cottage or yogurt': 'Eggs in a skillet. Cup of yogurt or cottage on the side. Fruit for Allyson.',
    'Bigger Saturday scramble': 'Bigger pan. 3-4 eggs, optional sausage. Yogurt. Allyson keeps toast or fruit if she wants starch.',
    'Sunday leftover bowls': 'Cold or reheated meat. 8 oz men, 4-5 oz Allyson. Vinegar slaw or bagged salad. Salsa. No extra oil.',
    'Chicken + slaw': 'Sunday chicken, sliced. Vinegar slaw: shredded cabbage, vinegar, mustard, salt. Pickle on the side.',
    'Beef + salad': 'Reheat beef in a dry pan. Bagged salad. Mustard or salsa. Allyson may add a small potato.',
    'Pork + green beans': 'Reheat pork. Green beans or cabbage, hot or cold. Mustard. Fruit for Allyson.',
    'Chicken bowls': 'Chicken, peppers or salad, salsa. No tortilla for the men. Allyson may take one small corn tortilla.',
    'Fish or tuna plate': 'Leftover catfish or two cans tuna drained. Salad. Lemon. No mayo mountain. Crackers only for Allyson.',
    'Leftover Saturday bowls': 'Whatever is left. 8 oz men, 4-5 oz Allyson. Two cups veg. Salsa. Rice or potato is hers.'
  };
  function labels() {
    var n = { dad: 'Thomas', mom: 'Allyson', son: 'Son' };
    try { if (typeof names === 'function') n = names(); } catch (e) {}
    return n;
  }
  function info(kind, day) {
    var title, how, link, time, pull, steps, swap;
    if (kind === 'breakfast') {
      title = BREAKFAST[day].family;
      how = HOW[title] || 'Cook the eggs. Measure the yogurt. Keep the ounces.';
      link = LINKS[title] || searchUrl(title);
    } else if (kind === 'lunch') {
      title = LUNCH[day].family;
      how = HOW[title] || 'Reheat the meat. Pile the vegetables. Salsa or mustard. Men skip the starch.';
      link = LINKS[title] || searchUrl(title);
    } else {
      var r = recipeFor(day);
      title = r.title;
      time = r.time; pull = r.pull; steps = r.steps; swap = r.swap;
      how = (r.pull ? 'Pull: ' + r.pull + ' ' : '') + (r.steps || '');
      if (r.swap) how += ' Swap: ' + r.swap;
      link = LINKS[title] || searchUrl(title);
    }
    return { title: title, how: how, link: link, time: time, pull: pull, steps: steps, swap: swap };
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
    var n = labels();
    extra += '<p class="note">Plates: ' + n.dad + ' and ' + n.son + ' 8 oz meat. ' + n.mom + ' 4-5 oz and she keeps starch.</p>';
    box.innerHTML = '<div class="meal-sheet" role="dialog"><h2>' + m.title + '</h2>' + extra +
      '<p>' + m.how + '</p>' +
      '<a class="btn" href="' + m.link + '" target="_blank" rel="noopener">Open full recipe</a>' +
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
    return '<div class="card"><h2>Tap a meal for the recipe</h2><p class="note">Each one opens the how-to and a full recipe.</p><div class="meal-btns">' +
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
