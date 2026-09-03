try {
  if (typeof SUPPS !== 'undefined') {
    SUPPS.dad.unshift({when:'Morning',item:'NAD+ 5 mg',note:'Thomas. With breakfast. Skip if a doctor said no.'});
    SUPPS.mom.unshift({when:'Morning',item:'NAD+ 5 mg',note:'Allyson. With breakfast. Skip if a doctor said no.'});
  }
  var n = names();
  if (n.mom === 'Mom') {
    n.mom = 'Allyson';
    saveNames(n);
    if (typeof bindPills === 'function') bindPills();
  }
} catch (e) {}
