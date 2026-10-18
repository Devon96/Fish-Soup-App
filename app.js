(() => {
  'use strict';

  const FISH_PER_PERSON_KG = 0.4;
  const WATER_PER_KG_L = 1.4;
  const PASTA_PER_PERSON_G = 80;
  const TIMED_MINUTES = 15;
  const COOKING_STORAGE_KEY = 'bajai-halaszle-cooking-v1';
  const UI_STORAGE_KEY = 'bajai-halaszle-ui-v1';
  const CONSENT_STORAGE_KEY = 'bajai-halaszle-cookie-consent-v1';
  const CONSENT_VERSION = 1;
  const GOOGLE_ANALYTICS_ID = 'G-JEFFP3CYK5';
  let analyticsLoaded = false;

  const translations = {
    hu: {
      brandSub: 'konyhai segéd', eyebrow: 'KLASSZIKUS BAJAI RECEPT', heroTitle: 'Halászlé, lépésről lépésre.',
      heroDescription: 'Számold ki a hozzávalókat, indítsd el a főzést, és hagyd, hogy az időzítő végigvezessen a bogrács mellett.',
      metaTime: '45 perc időzített főzés', metaBogracs: 'Bográcshoz és tűzhelyhez', artCaption: 'Lassan, türelmesen, forrásban.',
      recipeCardKicker: 'ELŐKÉSZÍTÉS', ingredientsTitle: 'Hozzávalók',
      ingredientsIntro: 'A mennyiségek a megadott recept arányai alapján automatikusan változnak.',
      modeWeight: 'Hal súlya', modeServings: 'Adagok száma', weightLabel: 'Hal összesen', servingsLabel: 'Hány főre?', peopleUnit: 'fő',
      yieldCaption: '400 g hal / fő becsléssel', ingredientNameHeading: 'Hozzávaló', amountHeading: 'Mennyiség',
      assumptionNote: 'A tészta becsült mennyisége 80 g/fő, 400 g hal/fő aránnyal. A hagyma és a kocka tört mennyisége méret, illetve ízlés szerint kerekíthető.',
      cookNotesKicker: 'JÓ TUDNI', notesTitle: 'Pár apró tipp',
      tipOne: 'A halszeleteket előre sózd be.',
      tipTwo: 'A halászlé a főzési szakaszokban végig forrjon, de ne kavargasd erősen; inkább óvatosan rázd meg a bográcsot.',
      tipThree: 'A halászlé tésztáját külön, a csomagolás szerint főzd meg.',
      liveGuideKicker: 'FŐZÉSI SEGÉD', processTitle: 'A főzés menete',
      processIntro: 'Haladj sorban. A forrást külön jelezheted, az időzítők pedig számolják a hátralévő időt.',
      stepsLabel: 'lépés', progressReady: 'Készen állsz a kezdésre?', notificationFootnote: 'Az értesítésekhez engedélyezd a böngészőértesítéseket, és hagyd nyitva ezt az oldalt. A pontos riasztás függ a böngészőtől és az eszköz beállításaitól.',
      footerText: 'Hagyományos arányok alapján · A sót kóstolás után állítsd be.', footerMade: 'főzz jó étvággyal',
      cookieSettingsLink: 'Süti-beállítások',
      cookieKicker: 'ADATVÉDELEM', cookieTitle: 'Hozzájárulsz a látogatottsági statisztikák méréséhez?',
      cookieDescription: 'Az oldal a működéshez szükséges beállításokat a böngésződben tárolja. A Google Analytics 4 látogatottsági mérése csak akkor indul el, ha elfogadod. A választásodat később a Süti-beállítások gombbal módosíthatod.',
      cookieReject: 'Elutasítom', cookieAccept: 'Elfogadom',
      cookieRejected: 'Az analitikát elutasítottad; a mérőkód nem fut tovább.', cookieAccepted: 'Az analitikát engedélyezted.',
      fish: 'Hal, vegyesen', water: 'Víz összesen', onions: 'Nagy vöröshagyma', cubes: 'Halászlé-kocka', paprika: 'Édes őrölt pirospaprika', pasta: 'Halászlé-/gyufatészta', salt: 'Só',
      toTaste: 'ízlés szerint', servingsEstimate: 'Kb. {n} adag', fishEstimate: 'Becsült adag: {n} főre',
      stepStatusCurrent: 'MOST EZ JÖN', stepStatusDone: 'KÉSZ', stepStatusNext: 'KÖVETKEZIK', stepStatusWaiting: 'VÁRAKOZÁS',
      step1Title: 'Főzd a hagymát', step1Subtitle: '15 perc · kevés vízben',
      step1Instructions: [
        'A felkockázott vöröshagymát tedd a bográcsba vagy egy nagy fazékba.',
        'A kimért vízből csak annyit adj hozzá, amennyi a hagyma főzéséhez kell; a többit tartsd meg a következő lépéshez.',
        'Főzd 15 percig. Az időzítő az „Indítsd a főzést” gomb megnyomásakor indul.'
      ],
      step2Title: 'Add hozzá a vizet, a halat és a kockát', step2Subtitle: 'Várakozás a forrásra · nincs időzítő',
      step2Instructions: [
        'Öntsd hozzá a maradék vizet, majd óvatosan tedd bele az előre sózott, szeletelt halat és a halászlé-kockát.',
        'A törpeharcsát, az ikrát és a haltejet egyelőre tedd félre; ezek később kerülnek bele.',
        'Várd meg, amíg a lé forrni kezd. Amikor megindul a forrás, nyomd meg a gombot.'
      ],
      step3Title: 'Add hozzá a paprikát', step3Subtitle: '15 perc · forrástól számítva',
      step3Instructions: [
        'A forrás megindulásakor add hozzá a kimért édes őrölt pirospaprikát ({amount}).',
        'Óvatosan rázd meg vagy mozgasd át a bográcsot; ne törd össze a halszeleteket.',
        'Főzd további 15 percig, folyamatos, élénk forrásban. Az időzítő már elindult.'
      ],
      step4Title: 'Tedd bele a késői hozzávalókat', step4Subtitle: '15 perc · forrásban főzés',
      step4Instructions: [
        'Tedd a lébe a félretett törpeharcsát, ikrát és haltejet, ha használsz ilyeneket.',
        'Miután hozzáadtad őket, indítsd el a 15 perces időzítőt, és főzd tovább forrásban.'
      ],
      step5Title: 'Fejezd be és tálald', step5Subtitle: 'Kóstolás · szűrés · tészta',
      step5Instructions: [
        'A második 15 perces főzés végén kóstold meg, és csak ezután sózd utána, ha szükséges.',
        'Óvatosan emeld ki a haldarabokat. Ha tisztább levet szeretnél, szűrd le a hagymát.',
        'A halászlé-/gyufatésztát külön főzd meg a csomagolás szerint, majd a levet, a halat és a tésztát tálald.'
      ],
      startCooking: 'Indítsd a főzést', pause: 'Szünet', resume: 'Folytatás', nextStep: 'Lépés kész · tovább',
      boilingButton: 'Forrni kezdett', addLateIngredients: 'Hozzávalók hozzáadva · indul a 15 perc', finishButton: 'Kész, tálalhatom', restartButton: 'Új főzés indítása',
      timerLabel: 'VISSZASZÁMLÁLÓ', timerRunning: 'Főzési időből hátravan', timerPaused: 'Az időzítő szünetel', timerReady: 'Az idő lejárt · lépj tovább, ha kész vagy.',
      timerIdle: 'Az időzítő a hozzávalók hozzáadása után indul.', waitingForBoil: 'Várakozás a forrásra', waitingForAction: 'Várakozás a következő lépésre',
      progressCooking: 'A halászlé készül · haladj a következő jelzésig.', progressFinished: 'Elkészült a halászlé. Jó étvágyat!', progressPaused: 'Az időzítő szünetel.', progressReadyToContinue: 'Az idő lejárt. Ellenőrizd a fazekat, majd lépj tovább.',
      completionNote: 'A halászlé elkészült. Tálald a külön főzött tésztával, és vigyázz a forró bográcsra!',
      timerMinutes: '15 perc', notificationEnabled: 'Értesítések aktívak', notifications: 'Értesítések',
      notifyPermissionGranted: 'A böngészőértesítések aktívak.', notifyPermissionDenied: 'Az értesítéseket a böngésző letiltotta. A weboldal időzítője ettől még működik.',
      notifyUnsupported: 'Ebben a böngészőben nem érhetők el az értesítések. Az időzítő a weboldalon továbbra is működik.',
      notifyNeedSecure: 'Az értesítésekhez nyisd meg az oldalt HTTPS-en vagy localhoston, majd engedélyezd őket.',
      notifyPermissionError: 'Nem sikerült bekapcsolni az értesítéseket. Ellenőrizd a böngésző beállításait.',
      notifyStepTitle: 'Új főzési lépés', notifyTimerTitle: 'Lejárt az időzítő', notifyTimerBody: 'A 15 perc letelt. Ellenőrizd a halászlét, majd kövesd a következő utasítást.',
      notifyFinishBody: 'A főzés befejeződött. Jó étvágyat!', resetConfirm: 'Biztosan elölről indítod a főzést? Az aktuális időzítő és a folyamat állapota törlődik.',
      toastCookingStarted: 'Elindult a 15 perces hagymafőzés.', toastTimerPaused: 'Az időzítő szünetel.', toastTimerResumed: 'Az időzítő folytatódik.',
      toastBoiling: 'Forrás jelölve. Add hozzá a paprikát; elindult a 15 perces időzítő.', toastLateTimerStarted: 'Elindult a második 15 perces főzési szakasz.', toastStepComplete: 'Lépés kész. Kövesd a következő utasítást.', toastFinished: 'A Bajai halászlé elkészült. Jó étvágyat!', toastReset: 'Új főzési folyamat indult.',
      themeLight: 'Világos módra váltás', themeDark: 'Sötét módra váltás', languageSwitch: 'Switch to English',
      boilingCallout: 'A forrásnál nyomd meg a gombot. Ezzel indul a paprikás, 15 perces szakasz időmérése.',
      startCallout: 'Készítsd elő a hozzávalókat, majd indítsd el az időzítőt a hagyma főzésének kezdetekor.',
      lateCallout: 'Csak akkor indítsd az időzítőt, amikor a törpeharcsa, az ikra és a haltej már a lében van.',
      finishedAction: 'A főzés kész. Új adagot is készíthetsz az újrakezdés gombbal.',
      generalTimerPaused: 'SZÜNETEL', generalTimerRunning: 'FUT', generalTimerDone: 'LEJÁRT', generalTimerIdle: 'INDÍTÁSRA VÁR',
      weightInvalid: 'Adj meg 0,1 kg-nál nagyobb halmennyiséget.', servingsInvalid: 'Adj meg legalább 1 adagot.'
    },
    en: {
      brandSub: 'kitchen companion', eyebrow: 'CLASSIC BAJA RECIPE', heroTitle: 'Fisherman’s soup, step by step.',
      heroDescription: 'Scale the ingredients, start cooking, and let the timers guide you through every stage by the kettle.',
      metaTime: '45 minutes of timed cooking', metaBogracs: 'For kettle or stovetop', artCaption: 'Slow, steady, gently boiling.',
      recipeCardKicker: 'PREPARATION', ingredientsTitle: 'Ingredients',
      ingredientsIntro: 'Amounts are scaled automatically using the ratios in the recipe you provided.',
      modeWeight: 'Fish weight', modeServings: 'Servings', weightLabel: 'Total fish', servingsLabel: 'How many people?', peopleUnit: 'people',
      yieldCaption: 'Estimated at 400 g fish per person', ingredientNameHeading: 'Ingredient', amountHeading: 'Amount',
      assumptionNote: 'Pasta is estimated at 80 g per person, using 400 g fish per person. Round fractional onion and stock-cube amounts to suit size and taste.',
      cookNotesKicker: 'GOOD TO KNOW', notesTitle: 'A few tips',
      tipOne: 'Salt the fish slices in advance.',
      tipTwo: 'Keep the soup boiling during the timed stages, but do not stir vigorously; gently rock the kettle instead.',
      tipThree: 'Cook the soup pasta separately, following the package instructions.',
      liveGuideKicker: 'COOKING GUIDE', processTitle: 'Cooking steps',
      processIntro: 'Follow the steps in order. Confirm when the soup starts boiling; the timers will track the remaining time.',
      stepsLabel: 'step', progressReady: 'Ready to start?', notificationFootnote: 'Allow browser notifications and keep this page open to receive alerts. Exact delivery depends on your browser and device settings.',
      footerText: 'Scaled from the traditional ratios · Adjust salt after tasting.', footerMade: 'cook and enjoy',
      cookieSettingsLink: 'Cookie settings',
      cookieKicker: 'PRIVACY', cookieTitle: 'Allow visit statistics?',
      cookieDescription: 'This site stores the settings needed for its core features in your browser. Google Analytics 4 visit measurement starts only if you accept. You can change your choice later using the Cookie settings button.',
      cookieReject: 'Reject', cookieAccept: 'Accept',
      cookieRejected: 'Analytics was rejected; measurement will not continue.', cookieAccepted: 'Analytics was allowed.',
      fish: 'Mixed fish', water: 'Water, total', onions: 'Large onion', cubes: 'Fish-soup stock cube', paprika: 'Sweet ground paprika', pasta: 'Soup / matchstick pasta', salt: 'Salt',
      toTaste: 'to taste', servingsEstimate: 'Approx. {n} servings', fishEstimate: 'Estimated yield: {n} people',
      stepStatusCurrent: 'UP NEXT', stepStatusDone: 'DONE', stepStatusNext: 'UPCOMING', stepStatusWaiting: 'WAITING',
      step1Title: 'Cook the onion', step1Subtitle: '15 minutes · in a little water',
      step1Instructions: [
        'Put the diced onion into the cooking kettle or a large pot.',
        'Add only as much of the measured water as needed to cook the onion; save the rest for the next step.',
        'Cook for 15 minutes. The timer starts when you press “Start cooking”.'
      ],
      step2Title: 'Add the water, fish and stock cube', step2Subtitle: 'Wait for boiling · no countdown yet',
      step2Instructions: [
        'Add the remaining water, then carefully add the salted fish slices and the fish-soup stock cube.',
        'Keep the dwarf catfish, roe and milt aside for now; they are added later.',
        'Wait until the soup comes to a boil, then press the button.'
      ],
      step3Title: 'Add the paprika', step3Subtitle: '15 minutes · from the start of boiling',
      step3Instructions: [
        'As soon as it starts boiling, add the measured sweet ground paprika ({amount}).',
        'Gently rock or move the kettle; avoid breaking up the fish slices by stirring hard.',
        'Boil briskly for another 15 minutes. The timer has already started.'
      ],
      step4Title: 'Add the ingredients held back', step4Subtitle: '15 minutes · keep boiling',
      step4Instructions: [
        'Add the reserved dwarf catfish, roe and milt, if you are using them.',
        'Once they are in the soup, start the 15-minute timer and continue boiling.'
      ],
      step5Title: 'Finish and serve', step5Subtitle: 'Season · strain · pasta',
      step5Instructions: [
        'At the end of the second 15-minute stage, taste the soup and add salt only if needed.',
        'Carefully lift out the fish pieces. For a clearer broth, strain out the onion.',
        'Cook the soup or matchstick pasta separately according to the package, then serve with the broth and fish.'
      ],
      startCooking: 'Start cooking', pause: 'Pause timer', resume: 'Resume timer', nextStep: 'Step complete · continue',
      boilingButton: 'It has started boiling', addLateIngredients: 'Ingredients added · start 15 minutes', finishButton: 'Ready to serve', restartButton: 'Start a new batch',
      timerLabel: 'COUNTDOWN', timerRunning: 'Cooking time remaining', timerPaused: 'Timer is paused', timerReady: 'Time is up · continue when ready.',
      timerIdle: 'Start the timer after adding the ingredients.', waitingForBoil: 'Waiting for the boil', waitingForAction: 'Waiting for your next action',
      progressCooking: 'The soup is cooking · follow the next prompt.', progressFinished: 'The soup is ready. Enjoy your meal!', progressPaused: 'The timer is paused.', progressReadyToContinue: 'Time is up. Check the pot, then continue.',
      completionNote: 'The soup is ready. Serve with separately cooked pasta, and take care around the hot kettle!',
      timerMinutes: '15 minutes', notificationEnabled: 'Notifications enabled', notifications: 'Notifications',
      notifyPermissionGranted: 'Browser notifications are enabled.', notifyPermissionDenied: 'Browser notifications are blocked. The on-page timer will still work.',
      notifyUnsupported: 'Notifications are not available in this browser. The on-page timer will still work.',
      notifyNeedSecure: 'For notifications, open this page over HTTPS or localhost and allow them.',
      notifyPermissionError: 'Could not enable notifications. Check your browser settings.',
      notifyStepTitle: 'New cooking step', notifyTimerTitle: 'Timer finished', notifyTimerBody: 'The 15 minutes are up. Check the soup and follow the next instruction.',
      notifyFinishBody: 'Cooking is complete. Enjoy your meal!', resetConfirm: 'Restart the cooking process from the beginning? The current timer and progress will be cleared.',
      toastCookingStarted: 'The 15-minute onion timer has started.', toastTimerPaused: 'The timer is paused.', toastTimerResumed: 'The timer has resumed.',
      toastBoiling: 'Boiling confirmed. Add the paprika; the 15-minute timer has started.', toastLateTimerStarted: 'The second 15-minute cooking stage has started.', toastStepComplete: 'Step complete. Follow the next instruction.', toastFinished: 'Your Baja fisherman’s soup is ready. Enjoy!', toastReset: 'A new cooking session has started.',
      themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode', languageSwitch: 'Váltás magyarra',
      boilingCallout: 'When boiling starts, press the button. This begins the 15-minute paprika stage timer.',
      startCallout: 'Prepare the ingredients, then start the timer when the onion begins cooking.',
      lateCallout: 'Start this timer only after the dwarf catfish, roe and milt are in the soup.',
      finishedAction: 'Cooking is complete. Use the restart button to make another batch.',
      generalTimerPaused: 'PAUSED', generalTimerRunning: 'RUNNING', generalTimerDone: 'TIME UP', generalTimerIdle: 'READY TO START',
      weightInvalid: 'Enter a fish weight greater than 0.1 kg.', servingsInvalid: 'Enter at least 1 serving.'
    }
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const defaultState = {
    lang: 'hu', theme: 'light', mode: 'weight', fishKg: 1.0, servings: 3,
    started: false, currentStep: 0, timerState: 'idle', timerRemaining: TIMED_MINUTES * 60,
    timerEndAt: null, finished: false
  };

  let state = { ...defaultState };
  let toastTimeout = null;
  let ticker = null;

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch { /* Storage may be disabled; the page still works. */ }
  }
  function t(key, vars = {}) {
    let value = translations[state.lang]?.[key] ?? translations.hu[key] ?? key;
    if (Array.isArray(value)) return value;
    return String(value).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  }
  function fmt(value, digits = 1) {
    return new Intl.NumberFormat(state.lang === 'hu' ? 'hu-HU' : 'en-GB', {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0
    }).format(value);
  }
  function pluralNumber(value) { return fmt(value, 1); }
  function scaledOnions(kg) { return Math.round(kg * 2) / 2; }
  function displayTimer(seconds) {
    const safe = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  function loadSavedState() {
    try {
      const ui = JSON.parse(safeGet(UI_STORAGE_KEY) || 'null');
      if (ui && (ui.lang === 'hu' || ui.lang === 'en')) state.lang = ui.lang;
      if (ui && (ui.theme === 'light' || ui.theme === 'dark')) state.theme = ui.theme;
      const requestedLanguage = new URLSearchParams(window.location.search).get('lang');
      if (requestedLanguage === 'hu' || requestedLanguage === 'en') state.lang = requestedLanguage;
      const saved = JSON.parse(safeGet(COOKING_STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        if (Number.isFinite(saved.fishKg) && saved.fishKg > 0) state.fishKg = saved.fishKg;
        if (Number.isInteger(saved.servings) && saved.servings > 0) state.servings = saved.servings;
        if (['weight', 'servings'].includes(saved.mode)) state.mode = saved.mode;
        if (typeof saved.started === 'boolean') state.started = saved.started;
        if (Number.isInteger(saved.currentStep) && saved.currentStep >= 0 && saved.currentStep <= 4) state.currentStep = saved.currentStep;
        if (['idle', 'running', 'paused', 'done'].includes(saved.timerState)) state.timerState = saved.timerState;
        if (Number.isFinite(saved.timerRemaining) && saved.timerRemaining >= 0) state.timerRemaining = saved.timerRemaining;
        if (Number.isFinite(saved.timerEndAt)) state.timerEndAt = saved.timerEndAt;
        if (typeof saved.finished === 'boolean') state.finished = saved.finished;
        if (state.timerState === 'running' && state.timerEndAt) {
          state.timerRemaining = Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000));
        }
      }
    } catch { /* Invalid saved state should not prevent the page from loading. */ }
  }
  function saveUiState() {
    safeSet(UI_STORAGE_KEY, JSON.stringify({ lang: state.lang, theme: state.theme }));
  }
  function saveCookingState() {
    safeSet(COOKING_STORAGE_KEY, JSON.stringify({
      fishKg: state.fishKg, servings: state.servings, mode: state.mode, started: state.started,
      currentStep: state.currentStep, timerState: state.timerState, timerRemaining: state.timerRemaining,
      timerEndAt: state.timerEndAt, finished: state.finished
    }));
  }

  function applyTheme() {
    document.body.dataset.theme = state.theme;
    const icon = $('#themeIcon');
    if (state.theme === 'dark') {
      icon.innerHTML = '<path d="M20.5 15.2A8.6 8.6 0 0 1 8.8 3.5 8.6 8.6 0 1 0 20.5 15.2Z"/>';
      $('#themeButton').setAttribute('aria-label', t('themeLight'));
      $('#themeButton').title = t('themeLight');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#161a17');
    } else {
      icon.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
      $('#themeButton').setAttribute('aria-label', t('themeDark'));
      $('#themeButton').title = t('themeDark');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f6f4ee');
    }
  }

  function applyLanguage() {
    document.documentElement.lang = state.lang;
    document.title = state.lang === 'hu' ? 'Bajai halászlé · konyhai segéd' : 'Baja fisherman’s soup · Kitchen companion';
    $('.brand').setAttribute('aria-label', state.lang === 'hu' ? 'Bajai halászlé kezdőlap' : 'Baja fisherman’s soup home');
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const value = translations[state.lang][key];
      if (typeof value === 'string') el.textContent = value;
    });
    $('#languageButton').textContent = state.lang === 'hu' ? 'EN' : 'HU';
    $('#languageButton').setAttribute('aria-label', t('languageSwitch'));
    $('#languageButton').title = t('languageSwitch');
    $('#themeButton').setAttribute('aria-label', state.theme === 'dark' ? t('themeLight') : t('themeDark'));
    $('#themeButton').title = state.theme === 'dark' ? t('themeLight') : t('themeDark');
    updateNotificationButton();
    updateModeUi();
    renderIngredients();
    renderSteps();
    updateProgress();
    applyTheme();
  }

  function updateModeUi() {
    $$('.mode-button').forEach(button => {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#weightInputWrap').classList.toggle('is-hidden', state.mode !== 'weight');
    $('#servingsInputWrap').classList.toggle('is-hidden', state.mode !== 'servings');
    $('#fishWeight').value = Number(state.fishKg.toFixed(2));
    $('#servingsInput').value = state.servings;
  }

  function currentServings() { return state.fishKg / FISH_PER_PERSON_KG; }
  function renderIngredients() {
    const kg = state.fishKg;
    const waterL = kg * WATER_PER_KG_L;
    const onions = scaledOnions(kg);
    const cubes = waterL;
    const paprikaTbsp = waterL;
    const pastaG = currentServings() * PASTA_PER_PERSON_G;
    const rows = [
      [t('fish'), `${fmt(kg, 2)} kg`],
      [t('water'), `${fmt(waterL, 1)} L`],
      [t('onions'), `~${fmt(onions, 1)} ${state.lang === 'hu' ? 'db' : 'pcs'}`],
      [t('cubes'), `~${fmt(cubes, 1)} ${state.lang === 'hu' ? 'db' : 'cubes'}`],
      [t('paprika'), `~${fmt(paprikaTbsp, 1)} ${state.lang === 'hu' ? 'ek' : 'tbsp'}`],
      [t('pasta'), `~${Math.round(pastaG)} g`],
      [t('salt'), t('toTaste')]
    ];
    $('#ingredientList').innerHTML = rows.map(([name, amount]) =>
      `<li class="ingredient-row"><span class="ingredient-name">${escapeHtml(name)}</span><span class="ingredient-amount">${escapeHtml(amount)}</span></li>`
    ).join('');
    $('#yieldValue').textContent = t('servingsEstimate', { n: fmt(currentServings(), 1) });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  const stepKeys = [
    { title: 'step1Title', subtitle: 'step1Subtitle', instructions: 'step1Instructions' },
    { title: 'step2Title', subtitle: 'step2Subtitle', instructions: 'step2Instructions' },
    { title: 'step3Title', subtitle: 'step3Subtitle', instructions: 'step3Instructions' },
    { title: 'step4Title', subtitle: 'step4Subtitle', instructions: 'step4Instructions' },
    { title: 'step5Title', subtitle: 'step5Subtitle', instructions: 'step5Instructions' }
  ];

  function stepStatus(i) {
    if (state.finished || i < state.currentStep) return { className: 'is-complete', label: t('stepStatusDone'), done: true };
    if (i === state.currentStep) return { className: 'is-active', label: t('stepStatusCurrent'), done: false };
    return { className: 'is-future', label: t('stepStatusNext'), done: false };
  }
  function instructionList(instructions) {
    return `<ul class="step-instructions">${instructions.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
  }
  function renderTimerBlock() {
    const seconds = state.timerState === 'running' && state.timerEndAt
      ? Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000))
      : state.timerRemaining;
    const stateLabel = state.timerState === 'running' ? t('generalTimerRunning')
      : state.timerState === 'paused' ? t('generalTimerPaused')
      : state.timerState === 'done' ? t('generalTimerDone') : t('generalTimerIdle');
    const caption = state.timerState === 'paused' ? t('timerPaused')
      : state.timerState === 'done' ? t('timerReady')
      : state.timerState === 'idle' ? t('timerIdle') : t('timerRunning');
    const digits = state.timerState === 'idle' ? displayTimer(TIMED_MINUTES * 60) : displayTimer(seconds);
    return `<div class="step-active-control timer-control">
      <div class="timer-row">
        <div><div class="timer-caption">${escapeHtml(t('timerLabel'))}</div><strong class="timer-digits ${state.timerState === 'done' ? 'is-done' : ''}" data-countdown>${digits}</strong><span class="timer-state" data-timer-caption>${escapeHtml(caption)}</span></div>
        <div class="timer-side"><span class="timer-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6M12 2v3"/></svg></span><span class="timer-state" data-timer-state>${escapeHtml(stateLabel)}</span></div>
      </div>
      <div class="control-actions">${timerButtons()}</div>
    </div>`;
  }
  function timerButtons() {
    const i = state.currentStep;
    if (!state.started && i === 0) return `<button class="primary-button" type="button" data-action="start">${iconSvg('play')} ${escapeHtml(t('startCooking'))}</button>`;
    if ((i === 0 || i === 2) && state.timerState === 'running') return `<button class="secondary-button" type="button" data-action="pause">${iconSvg('pause')} ${escapeHtml(t('pause'))}</button>`;
    if ((i === 0 || i === 2) && state.timerState === 'paused') return `<button class="primary-button" type="button" data-action="resume">${iconSvg('play')} ${escapeHtml(t('resume'))}</button>`;
    if ((i === 0 || i === 2 || i === 3) && state.timerState === 'done') return `<button class="primary-button" type="button" data-action="next">${iconSvg('check')} ${escapeHtml(t('nextStep'))}</button>`;
    if (i === 3 && state.timerState === 'idle') return `<button class="primary-button" type="button" data-action="start-late">${iconSvg('play')} ${escapeHtml(t('addLateIngredients'))}</button>`;
    if (i === 4) return `<button class="primary-button" type="button" data-action="finish">${iconSvg('check')} ${escapeHtml(t('finishButton'))}</button>`;
    return '';
  }
  function iconSvg(name) {
    const paths = {
      play: '<path d="m8 5 11 7-11 7Z"/>',
      pause: '<path d="M8 5h3v14H8zM15 5h3v14h-3z"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 0 3-2 4-2 4 0-4-2-7-5-10 1 5-3 7-3 13 0 4 3 7 7 7Z"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.check}</svg>`;
  }
  function activeStepControl() {
    if (state.finished) {
      return `<div class="step-callout">${iconSvg('check')}<span>${escapeHtml(t('completionNote'))}</span></div><div class="control-actions"><button class="secondary-button" type="button" data-action="restart">${iconSvg('play')} ${escapeHtml(t('restartButton'))}</button></div>`;
    }
    switch (state.currentStep) {
      case 0:
        return `${renderTimerBlock()}${!state.started ? `<div class="step-callout">${iconSvg('flame')}<span>${escapeHtml(t('startCallout'))}</span></div>` : ''}`;
      case 1:
        return `<div class="step-active-control">
          <div class="timer-row"><div><div class="timer-caption">${escapeHtml(t('waitingForBoil'))}</div><strong class="timer-digits">— — : — —</strong><span class="timer-state">${escapeHtml(t('waitingForAction'))}</span></div><span class="timer-icon" aria-hidden="true">${iconSvg('flame')}</span></div>
          <div class="control-actions"><button class="primary-button" type="button" data-action="boiling">${iconSvg('flame')} ${escapeHtml(t('boilingButton'))}</button></div>
          <div class="step-callout">${iconSvg('flame')}<span>${escapeHtml(t('boilingCallout'))}</span></div>
        </div>`;
      case 2:
        return renderTimerBlock();
      case 3:
        return `${renderTimerBlock()}<div class="step-callout">${iconSvg('flame')}<span>${escapeHtml(t('lateCallout'))}</span></div>`;
      case 4:
        return `<div class="step-active-control"><div class="step-callout">${iconSvg('check')}<span>${escapeHtml(t('completionNote'))}</span></div><div class="control-actions"><button class="primary-button" type="button" data-action="finish">${iconSvg('check')} ${escapeHtml(t('finishButton'))}</button></div></div>`;
      default: return '';
    }
  }

  function renderSteps() {
    $('#stepList').innerHTML = stepKeys.map((keys, i) => {
      const status = stepStatus(i);
      let instructions = t(keys.instructions);
      if (i === 2) instructions = instructions.map(line => line.replace('{amount}', `${fmt(state.fishKg * WATER_PER_KG_L, 1)} ${state.lang === 'hu' ? 'evőkanál' : 'tablespoons'}`));
      const number = status.done
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`
        : String(i + 1).padStart(2, '0');
      const activeControl = i === state.currentStep ? `<div class="step-controls">${activeStepControl()}</div>` : '';
      return `<article class="step-card ${status.className} ${state.finished && i === 4 ? 'is-finished' : ''}" id="step-${i + 1}" ${i === state.currentStep ? 'aria-current="step"' : ''}>
        <div class="step-main"><div class="step-number">${number}</div><div class="step-heading"><div class="step-title-row"><h3>${escapeHtml(t(keys.title))}</h3><span class="step-status">${escapeHtml(status.label)}</span></div><p class="step-subtitle">${escapeHtml(t(keys.subtitle))}</p></div></div>
        <div class="step-body">${instructionList(instructions)}${activeControl}</div>
      </article>`;
    }).join('');
    updateTimerDisplays();
    updateProgress();
  }

  function updateTimerDisplays() {
    const digits = $('[data-countdown]');
    if (!digits) return;
    const seconds = state.timerState === 'running' && state.timerEndAt
      ? Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000))
      : state.timerRemaining;
    digits.textContent = state.timerState === 'idle' ? displayTimer(TIMED_MINUTES * 60) : displayTimer(seconds);
    digits.classList.toggle('is-done', state.timerState === 'done');
    const caption = $('[data-timer-caption]');
    if (caption) caption.textContent = state.timerState === 'paused' ? t('timerPaused')
      : state.timerState === 'done' ? t('timerReady')
      : state.timerState === 'idle' ? t('timerIdle') : t('timerRunning');
    const status = $('[data-timer-state]');
    if (status) status.textContent = state.timerState === 'running' ? t('generalTimerRunning')
      : state.timerState === 'paused' ? t('generalTimerPaused')
      : state.timerState === 'done' ? t('generalTimerDone') : t('generalTimerIdle');
  }

  function updateProgress() {
    const count = state.finished ? 5 : state.currentStep + 1;
    const percent = state.finished ? 100 : Math.round((state.currentStep / 4) * 100);
    $('#stepCounter').textContent = `${count} / 5`;
    $('#progressFill').style.width = `${percent}%`;
    $('#progressTrack').setAttribute('aria-valuenow', String(percent));
    $('#progressPercent').textContent = `${percent}%`;
    let message = t('progressReady');
    if (state.finished) message = t('progressFinished');
    else if (state.timerState === 'paused') message = t('progressPaused');
    else if (state.timerState === 'done') message = t('progressReadyToContinue');
    else if (state.started) message = t('progressCooking');
    $('#progressMessage').textContent = message;
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  function updateNotificationButton() {
    const button = $('#notificationButton');
    const dot = $('#notificationDot');
    let granted = false;
    try { granted = 'Notification' in window && Notification.permission === 'granted'; } catch { granted = false; }
    dot.classList.toggle('is-on', granted);
    button.setAttribute('aria-label', t('notifications'));
    button.title = granted ? t('notificationEnabled') : t('notifications');
    const label = $('.button-label', button);
    if (label) label.textContent = granted ? t('notificationEnabled') : t('notifications');
  }

  function notify(title, body) {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, { body, tag: 'bajai-halaszle', renotify: false });
        notification.onclick = () => { window.focus(); notification.close(); };
      }
    } catch { /* Notifications can be blocked by browser or device policy. */ }
  }
  async function requestNotifications() {
    if (!('Notification' in window)) {
      showToast(t('notifyUnsupported'));
      return;
    }
    if (!window.isSecureContext && location.hostname !== 'localhost') {
      showToast(t('notifyNeedSecure'));
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      updateNotificationButton();
      if (permission === 'granted') {
        showToast(t('notifyPermissionGranted'));
        notify(t('notifications'), t('notifyPermissionGranted'));
      } else if (permission === 'denied') showToast(t('notifyPermissionDenied'));
      else showToast(t('notifyPermissionError'));
    } catch {
      showToast(t('notifyPermissionError'));
    }
  }

  function startTimer(seconds = TIMED_MINUTES * 60) {
    state.timerRemaining = seconds;
    state.timerEndAt = Date.now() + seconds * 1000;
    state.timerState = 'running';
    saveCookingState();
    beginTicker();
    renderSteps();
  }
  function pauseTimer() {
    if (state.timerState !== 'running') return;
    state.timerRemaining = Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000));
    state.timerEndAt = null;
    state.timerState = 'paused';
    saveCookingState();
    renderSteps();
    showToast(t('toastTimerPaused'));
  }
  function resumeTimer() {
    if (state.timerState !== 'paused') return;
    state.timerEndAt = Date.now() + state.timerRemaining * 1000;
    state.timerState = 'running';
    saveCookingState();
    beginTicker();
    renderSteps();
    showToast(t('toastTimerResumed'));
  }
  function beginTicker() {
    if (ticker) clearInterval(ticker);
    ticker = setInterval(tickTimer, 500);
    tickTimer();
  }
  function tickTimer() {
    if (state.timerState !== 'running' || !state.timerEndAt) return;
    state.timerRemaining = Math.max(0, Math.ceil((state.timerEndAt - Date.now()) / 1000));
    updateTimerDisplays();
    if (state.timerRemaining <= 0) {
      state.timerRemaining = 0;
      state.timerEndAt = null;
      state.timerState = 'done';
      if (ticker) clearInterval(ticker);
      ticker = null;
      saveCookingState();
      renderSteps();
      notify(t('notifyTimerTitle'), t('notifyTimerBody'));
      showToast(t('timerReady'));
    }
  }

  function advanceTo(index, message, notifyBody) {
    state.currentStep = index;
    state.timerEndAt = null;
    state.timerState = 'idle';
    state.timerRemaining = TIMED_MINUTES * 60;
    saveCookingState();
    renderSteps();
    updateProgress();
    showToast(message || t('toastStepComplete'));
    if (notifyBody) notify(t('notifyStepTitle'), notifyBody);
    const target = $(`#step-${index + 1}`);
    if (target && window.matchMedia('(max-width: 680px)').matches) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function startCooking() {
    state.started = true;
    state.currentStep = 0;
    state.finished = false;
    startTimer(TIMED_MINUTES * 60);
    showToast(t('toastCookingStarted'));
    updateProgress();
  }
  function confirmBoiling() {
    state.started = true;
    state.currentStep = 2;
    state.timerState = 'idle';
    startTimer(TIMED_MINUTES * 60);
    showToast(t('toastBoiling'));
    notify(t('notifyStepTitle'), t('step3Title'));
  }
  function startLateIngredientsTimer() {
    state.started = true;
    startTimer(TIMED_MINUTES * 60);
    showToast(t('toastLateTimerStarted'));
  }
  function finishCooking() {
    state.finished = true;
    state.currentStep = 4;
    state.timerState = 'done';
    state.timerRemaining = 0;
    state.timerEndAt = null;
    if (ticker) clearInterval(ticker);
    ticker = null;
    saveCookingState();
    renderSteps();
    updateProgress();
    showToast(t('toastFinished'));
    notify(t('notifyStepTitle'), t('notifyFinishBody'));
  }
  function restartCooking() {
    if (!window.confirm(t('resetConfirm'))) return;
    state.started = false;
    state.currentStep = 0;
    state.timerState = 'idle';
    state.timerRemaining = TIMED_MINUTES * 60;
    state.timerEndAt = null;
    state.finished = false;
    if (ticker) clearInterval(ticker);
    ticker = null;
    saveCookingState();
    renderSteps();
    updateProgress();
    showToast(t('toastReset'));
  }

  function handleAction(action) {
    switch (action) {
      case 'start': startCooking(); break;
      case 'pause': pauseTimer(); break;
      case 'resume': resumeTimer(); break;
      case 'next':
        if (state.currentStep === 0 && state.timerState === 'done') {
          advanceTo(1, t('toastStepComplete'), t('step2Title'));
        } else if (state.currentStep === 2 && state.timerState === 'done') {
          advanceTo(3, t('toastStepComplete'), t('step4Title'));
        } else if (state.currentStep === 3 && state.timerState === 'done') {
          advanceTo(4, t('toastStepComplete'), t('step5Title'));
        }
        break;
      case 'boiling': confirmBoiling(); break;
      case 'start-late': startLateIngredientsTimer(); break;
      case 'finish': finishCooking(); break;
      case 'restart': restartCooking(); break;
    }
  }

  function changeMode(mode) {
    if (mode === state.mode) return;
    if (mode === 'servings') {
      state.servings = Math.max(1, Math.round(state.fishKg / FISH_PER_PERSON_KG));
      state.fishKg = state.servings * FISH_PER_PERSON_KG;
    } else {
      state.fishKg = Number((state.servings * FISH_PER_PERSON_KG).toFixed(2));
    }
    state.mode = mode;
    updateModeUi();
    renderIngredients();
    renderSteps();
    saveCookingState();
  }
  function changeFishWeight() {
    const input = $('#fishWeight');
    const value = Number.parseFloat(input.value.replace(',', '.'));
    if (!Number.isFinite(value) || value < 0.1) {
      input.setCustomValidity(t('weightInvalid'));
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    state.fishKg = Math.min(100, value);
    renderIngredients();
    renderSteps();
    saveCookingState();
  }
  function changeServings() {
    const input = $('#servingsInput');
    const value = Number.parseInt(input.value, 10);
    if (!Number.isInteger(value) || value < 1) {
      input.setCustomValidity(t('servingsInvalid'));
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    state.servings = Math.min(100, value);
    state.fishKg = state.servings * FISH_PER_PERSON_KG;
    renderIngredients();
    renderSteps();
    saveCookingState();
  }

  function readCookieConsent() {
    try {
      const saved = JSON.parse(safeGet(CONSENT_STORAGE_KEY) || 'null');
      if (saved && saved.version === CONSENT_VERSION && typeof saved.analytics === 'boolean') return saved;
    } catch { /* Ignore invalid or unavailable storage. */ }
    return null;
  }

  function deleteAnalyticsCookies() {
    const measurementCookie = `_ga_${GOOGLE_ANALYTICS_ID.slice(2).replace(/-/g, '_')}`;
    const names = new Set(['_ga', measurementCookie, '_gid', '_gat']);
    const domains = new Set(['', location.hostname]);
    const hostnameParts = location.hostname.split('.');
    if (hostnameParts.length > 1 && !/^\d+$/.test(hostnameParts[hostnameParts.length - 1])) {
      domains.add(`.${hostnameParts.slice(-2).join('.')}`);
    }
    for (const name of names) {
      for (const domain of domains) {
        const domainAttribute = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domainAttribute}`;
      }
    }
  }

  function loadGoogleAnalytics() {
    if (analyticsLoaded) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GOOGLE_ANALYTICS_ID, { anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    script.dataset.googleAnalytics = 'true';
    document.head.appendChild(script);
    analyticsLoaded = true;
  }

  function applyCookieConsent(analyticsAllowed) {
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = !analyticsAllowed;
    if (analyticsAllowed) {
      if (analyticsLoaded) window.gtag('event', 'page_view');
      else loadGoogleAnalytics();
    } else {
      deleteAnalyticsCookies();
    }
  }

  function showCookieConsent() {
    const dialog = $('#cookieConsent');
    if (!dialog.open) dialog.show();
  }

  function saveCookieConsent(analytics) {
    const consent = { version: CONSENT_VERSION, analytics, savedAt: new Date().toISOString() };
    safeSet(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    applyCookieConsent(analytics);
    $('#cookieConsent').close();
    showToast(t(analytics ? 'cookieAccepted' : 'cookieRejected'));
  }

  function initCookieConsent() {
    const consent = readCookieConsent();
    window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = !consent?.analytics;
    if (consent) applyCookieConsent(consent.analytics);
    if (!consent || new URLSearchParams(window.location.search).get('cookies') === '1') showCookieConsent();

    $('#cookieAcceptButton').addEventListener('click', () => saveCookieConsent(true));
    $('#cookieRejectButton').addEventListener('click', () => saveCookieConsent(false));
    $('#cookieConsent').addEventListener('cancel', event => event.preventDefault());
    $('#cookieSettingsLink').addEventListener('click', showCookieConsent);
  }

  function init() {
    loadSavedState();
    applyTheme();
    updateModeUi();
    initCookieConsent();
    $('#themeButton').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyTheme();
      saveUiState();
    });
    $('#languageButton').addEventListener('click', () => {
      state.lang = state.lang === 'hu' ? 'en' : 'hu';
      saveUiState();
      applyLanguage();
    });
    $('#notificationButton').addEventListener('click', requestNotifications);
    $$('.mode-button').forEach(button => button.addEventListener('click', () => changeMode(button.dataset.mode)));
    $('#fishWeight').addEventListener('change', changeFishWeight);
    $('#fishWeight').addEventListener('keydown', event => { if (event.key === 'Enter') { changeFishWeight(); inputBlur(event); } });
    $('#servingsInput').addEventListener('change', changeServings);
    $('#servingsInput').addEventListener('keydown', event => { if (event.key === 'Enter') { changeServings(); inputBlur(event); } });
    $('#stepList').addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (button) handleAction(button.dataset.action);
    });
    updateNotificationButton();
    applyLanguage();
    if (state.timerState === 'running') beginTicker();
    else if (state.timerState === 'done') renderSteps();
    window.addEventListener('beforeunload', saveCookingState);
  }
  function inputBlur(event) { event.target.blur(); }

  init();
})();
