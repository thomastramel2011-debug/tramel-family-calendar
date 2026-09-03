(function () {
  const MOVES = {
    walk: {
      name: 'Neighborhood walk',
      how: 'Start at 106 E Sunset. Easy pace you can talk through. Arms swing. Look up, not at the phone. Turn around if anyone is gassed. Heat index over 95, ice, lightning, or hard rain: skip this and use the treadmill.',
      video: 'https://www.youtube.com/watch?v=wYNb5P4d3qI'
    },
    treadmill: {
      name: 'Treadmill backup',
      how: '3.0 to 3.3 mph. One to two percent incline. Hold the rails only to get on. Then let go. Same minutes as the outdoor walk. Stop if you feel dizzy or the chest feels wrong.',
      video: 'https://www.youtube.com/watch?v=gC_L9qAHVJ8'
    },
    sitstand: {
      name: 'Sit-to-stand',
      how: 'Sit on the front of a sturdy chair. Feet under you, hip width. Lean the nose over the toes. Push the floor away and stand tall. Sit back by sending the hips back first. Use the armrests at first. 8 to 10 slow reps.',
      video: 'https://www.youtube.com/watch?v=0FkRr45YeEQ'
    },
    goblet: {
      name: 'Goblet squat',
      how: 'Hold one dumbbell or a milk jug at the chest. Feet a little wider than the hips. Sit the hips back and down. Knees track over the toes. Chest stays up. Stand by pushing the floor. Stop above parallel if the knees or back complain.',
      video: 'https://www.youtube.com/watch?v=MeIiIdhvXT4'
    },
    counterpu: {
      name: 'Counter push-up',
      how: 'Hands on a kitchen counter, shoulder width. Body in a straight line from head to heels. Bend the elbows and lower the chest toward the edge. Push the counter away. Do not sag the hips. 6 to 10 reps.',
      video: 'https://www.youtube.com/watch?v=4dF1DOWzf20'
    },
    kneepu: {
      name: 'Knee push-up',
      how: 'Hands under the shoulders on the floor. Knees down, hips straight from knees to head. Lower the chest. Push the floor. If this is too hard, stay on the counter.',
      video: 'https://www.youtube.com/watch?v=jWxvvcjvKow'
    },
    wallpu: {
      name: 'Wall push-up',
      how: 'Hands on the wall at chest height. Step the feet back. Body stays long. Bend the elbows and bring the chest toward the wall. Push away. Good first version for Allyson.',
      video: 'https://www.youtube.com/watch?v=a6YHbXD2XlU'
    },
    bandrow: {
      name: 'Band row',
      how: 'Anchor a band in a door or around a post at chest height. Stand tall. Pull the elbows back toward the ribs. Squeeze the shoulder blades. Let the arms go forward slow. 8 to 10 each side or both arms together.',
      video: 'https://www.youtube.com/watch?v=pYcpY20QaE8'
    },
    dbrow: {
      name: 'Dumbbell row',
      how: 'One hand and one knee on a bench or sturdy chair. Other foot on the floor. Pull the weight to the hip, not the ear. Elbow close to the body. Lower slow. 8 to 10 each side.',
      video: 'https://www.youtube.com/watch?v=roCP6wCXPqo'
    },
    hinge: {
      name: 'Hip hinge',
      how: 'Soft knees. Push the hips back as if closing a car door with the hips. Spine stays long. You should feel the work in the backs of the legs, not the low back. Stand by squeezing the glutes. Empty hands first, then a light weight.',
      video: 'https://www.youtube.com/watch?v=hCDzSR6bW10'
    },
    carry: {
      name: 'Farmer carry',
      how: 'Pick up two even objects at the sides, grocery bags work. Stand tall. Walk 30 to 40 seconds. Do not lean. Set them down like you mean it. Rest and repeat.',
      video: 'https://www.youtube.com/watch?v=Fkzk_RqlYig'
    },
    deadbug: {
      name: 'Dead bug',
      how: 'Lie on your back. Arms up. Knees bent over the hips. Press the low back into the floor. Lower the opposite arm and opposite leg. Come back. Switch. Slow. Stop if the back peels off the floor.',
      video: 'https://www.youtube.com/watch?v=4XLEnwUr1d8'
    },
    stretch: {
      name: 'Easy stretch',
      how: 'After the walk: calves against a wall, gentle hip flexor kneeling or standing, and a seated hamstring reach. Thirty seconds each. No bouncing. Breathe.',
      video: 'https://www.youtube.com/watch?v=L_xrDAtykF4'
    }
  };

  const LIFT = { 1: true, 3: true, 5: true };

  function idsFor(who) {
    const day = new Date().getDay();
    const lift = !!LIFT[day];
    if (who === 'mom') {
      return lift
        ? ['walk', 'treadmill', 'sitstand', 'wallpu', 'counterpu', 'bandrow', 'carry']
        : ['walk', 'treadmill', 'stretch'];
    }
    return lift
      ? ['walk', 'treadmill', 'sitstand', 'goblet', 'counterpu', 'kneepu', 'bandrow', 'dbrow', 'hinge', 'carry']
      : ['walk', 'treadmill', 'stretch', 'deadbug', 'wallpu'];
  }

  function moveButtons(who) {
    return idsFor(who).map(function (id) {
      const m = MOVES[id];
      return '<button type="button" class="move" onclick="showMove(\'' + id + '\')">' + m.name + '</button>';
    }).join('');
  }

  function movesCard(who) {
    const lift = !!LIFT[new Date().getDay()];
    const title = lift ? 'Tap a move \u00b7 lift day' : 'Tap a move \u00b7 walk day';
    return '<div class="card"><h2>' + title + '</h2>' +
      '<p class="note">Each button opens the how-to and a video.</p>' +
      '<div class="moves">' + moveButtons(who) + '</div></div>';
  }

  window.showMove = function (id) {
    const m = MOVES[id];
    if (!m) return;
    var box = document.getElementById('move-modal');
    if (!box) {
      box = document.createElement('div');
      box.id = 'move-modal';
      document.body.appendChild(box);
    }
    box.innerHTML =
      '<div class="move-sheet" role="dialog">' +
      '<h2>' + m.name + '</h2>' +
      '<p>' + m.how + '</p>' +
      '<a class="btn" href="' + m.video + '" target="_blank" rel="noopener">Watch the video</a>' +
      '<button type="button" class="ghost" onclick="closeMove()">Close</button>' +
      '</div>';
    box.className = 'move-modal on';
    box.onclick = function (e) { if (e.target === box) closeMove(); };
  };

  window.closeMove = function () {
    var box = document.getElementById('move-modal');
    if (box) box.className = 'move-modal';
  };

  if (typeof personHtml === 'function') {
    var origPerson = personHtml;
    personHtml = function (who) {
      return origPerson(who) + movesCard(who);
    };
  }

  if (typeof renderToday === 'function') {
    var origToday = renderToday;
    renderToday = function () {
      origToday();
      if (typeof selectedPerson !== 'undefined' && selectedPerson) return;
      var view = document.getElementById('view-today');
      if (!view) return;
      var extra = document.createElement('div');
      extra.innerHTML = movesCard('dad');
      view.appendChild(extra.firstChild);
    };
  }
})();
