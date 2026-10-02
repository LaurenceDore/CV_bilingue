(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const T = {
    fr: { title: 'Laurence Doremus – Innovation pédagogique | IA | Project Manager', alt: 'Photo de Laurence Doremus', nav: 'Chapitres du parcours',
      open: 'Tout ouvrir', close: 'Tout fermer', show: 'Voir les coulisses', hide: 'Masquer les coulisses',
      skills: (n, t) => `${n} / ${t} compétences vues`, qn: (i, t) => `Question ${i} / ${t}`, ok: 'Bonne réponse !',
      ko: 'Pas tout à fait : la bonne réponse est en vert.', next: 'Question suivante', res: 'Voir mon résultat', score: 'Score', retry: 'Recommencer le quiz',
      certT: '🏅 Parcours terminé', certP: 'Vous avez parcouru le CV de Laurence Doremus.<br>Pour échanger :',
      quiz: [
        { q: "Dans quel établissement Laurence a-t-elle été ingénieure pédagogique de fév. 2022 à juil. 2023 ?", o: ["INALCO", "Université de Lille", "HEI"], a: 0 },
        { q: "Quelle suite utilise-t-elle pour développer des modules e-learning interactifs ?", o: ["Suite Articulate (Storyline, Rise)", "Camtasia", "Genially"], a: 0 },
        { q: "Sur quelle plateforme LMS a-t-elle un niveau d'administration expert ?", o: ["Fun EDX", "Moodle", "BigBlueButton"], a: 1 }] },
    en: { title: 'Laurence Doremus – Educational Innovation | AI | Project Manager', alt: 'Photo of Laurence Doremus', nav: 'Course chapters',
      open: 'Open all', close: 'Close all', show: 'Show behind the scenes', hide: 'Hide behind the scenes',
      skills: (n, t) => `${n} / ${t} skills seen`, qn: (i, t) => `Question ${i} / ${t}`, ok: 'Correct!',
      ko: 'Not quite: the right answer is in green.', next: 'Next question', res: 'See my result', score: 'Score', retry: 'Restart the quiz',
      certT: '🏅 Course completed', certP: 'You have gone through Laurence Doremus\'s CV.<br>To get in touch:',
      quiz: [
        { q: "In which institution was Laurence an instructional designer from Feb. 2022 to Jul. 2023?", o: ["INALCO", "University of Lille", "HEI"], a: 0 },
        { q: "Which suite does she use to develop interactive e-learning modules?", o: ["Articulate Suite (Storyline, Rise)", "Camtasia", "Genially"], a: 0 },
        { q: "On which LMS platform does she have expert-level administration skills?", o: ["Fun EDX", "Moodle", "BigBlueButton"], a: 1 }] }
  };
  let lang = 'fr', i = 0, score = 0, allOpen = false;
  const t = () => T[lang];
  const chapters = $$('.chap'), done = new Set();

  // Progression
  function markDone(id) {
    if (done.has(id)) return;
    done.add(id);
    const link = $(`#nav a[data-ch="${id}"]`);
    if (link) link.classList.add('done');
    const pct = Math.round((done.size / chapters.length) * 100);
    $('#bar').style.width = pct + '%';
    $('.progress').setAttribute('aria-valuenow', pct);
    if (id === 'langues') $('.langs').classList.add('on');
  }
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.id !== 'quiz' && markDone(e.target.id)), { threshold: 0.35 });
  chapters.forEach(c => io.observe(c));

  // Coulisses
  const btn = $('#backstageBtn');
  const labelBackstage = () => (btn.textContent = document.body.classList.contains('backstage') ? t().hide : t().show);
  btn.addEventListener('click', () => {
    const on = document.body.classList.toggle('backstage');
    btn.setAttribute('aria-pressed', on);
    labelBackstage();
  });

  // Accordéon
  const toggleAll = $('#toggleAll');
  toggleAll.addEventListener('click', () => {
    allOpen = !allOpen;
    $$('.exp').forEach(d => (d.open = allOpen));
    toggleAll.textContent = allOpen ? t().close : t().open;
  });

  // Compétences
  const countSkills = () => ($('#skillCount').textContent = t().skills($$('.chips .seen').length, $$('.chips button').length));
  $$('.chips button').forEach(b => b.addEventListener('click', () => { b.classList.toggle('seen'); countSkills(); }));

  // Quiz
  const box = $('#quizBox');
  function showQ() {
    $('#cert').hidden = true;
    const { q, o, a } = t().quiz[i], n = t().quiz.length;
    box.innerHTML = `<p class="hint">${t().qn(i + 1, n)}</p><p class="q-title">${q}</p>` +
      o.map((x, k) => `<button class="opt" data-k="${k}">${x}</button>`).join('') + `<p class="fb" aria-live="polite"></p>`;
    $$('.opt', box).forEach(b => b.addEventListener('click', () => {
      const k = +b.dataset.k;
      $$('.opt', box).forEach(x => (x.disabled = true));
      $$('.opt', box)[a].classList.add('ok');
      if (k === a) { score++; $('.fb', box).textContent = t().ok; }
      else { b.classList.add('ko'); $('.fb', box).textContent = t().ko; }
      const nx = document.createElement('button');
      nx.className = 'next';
      nx.textContent = i < n - 1 ? t().next : t().res;
      nx.addEventListener('click', () => { i++; i < n ? showQ() : end(); });
      box.appendChild(nx);
      nx.focus();
    }));
  }
  function end() {
    box.innerHTML = `<p class="q-title">${t().score} : ${score} / ${t().quiz.length}</p><button class="next" id="retry">${t().retry}</button>`;
    $('#retry').addEventListener('click', () => { i = 0; score = 0; showQ(); });
    markDone('quiz');
    const c = $('#cert');
    c.hidden = false;
    c.innerHTML = `<h3>${t().certT}</h3><p>${t().certP} <a href="mailto:laurence.doremus84@gmail.com">laurence.doremus84@gmail.com</a> · <a href="tel:0648151559">06 48 15 15 59</a></p>`;
  }

  // Langue FR / EN
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.l === l));
    document.title = t().title;
    $('.hero img').alt = t().alt;
    $('#nav').setAttribute('aria-label', t().nav);
    toggleAll.textContent = allOpen ? t().close : t().open;
    labelBackstage();
    countSkills();
    i = 0; score = 0; showQ();
    try { localStorage.setItem('cvLang', l); } catch (e) {}
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  let start = new URLSearchParams(location.search).get('lang');
  try { start = start || localStorage.getItem('cvLang'); } catch (e) {}
  setLang(start === 'en' ? 'en' : 'fr');
})();
