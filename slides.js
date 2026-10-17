import {TEAM_STORIES, FOOD_APP, SOUND_APP, resolveStory} from './story-data.js';

export function installSlidePlayer(document, window) {
const byId = id => document.getElementById(id);
let state = resolveStory(window.location.search);

const pad = n => String(n).padStart(2, '0');

function getSlidePaceHint(page, slide) {
  const sec = slide?.seconds || (page >= 7 && page <= 10 ? 50 : 30);
  if (page >= 7 && page <= 10) return `核心成果＋實機展示 · 建議約 ${sec} 秒`;
  if (page >= 4 && page <= 6) return `研究方法＋實機展示 · 建議約 ${sec} 秒`;
  if (page === 11) return `總結呼籲＋邀請掃碼 · 建議約 ${sec} 秒`;
  return `開場與問題動機 · 建議約 ${sec} 秒`;
}

function getSlideHandoffHint(page) {
  if (page === 3) return '🔔 講完本頁交棒 ➔ 隊員 B（P4–P6）';
  if (page === 6) return '🔔 講完本頁交棒 ➔ 隊員 C（P7–P10）';
  if (page === 10) return '🔔 講完本頁交棒 ➔ 全員合聲（P11）';
  if (page === 11) return '🎉 全員合聲總結 ➔ 邀請評審體驗與提問';
  return '';
}

function getSpeechRate() {
  const val = Number(byId('speech-rate-select')?.value);
  return Number.isFinite(val) && val >= 0.5 && val <= 2 ? val : 0.96;
}

let continuousReading = false;
let speechSessionId = 0;
let renderedTeam = null;
let activeRoleFilter = 'all';
let lastRandomQaIndex = -1;
let currentQuizItem = null;

const ROLE_CONFIG = {
  all: {pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], targetSeconds: 480},
  A: {pages: [1, 2, 3], targetSeconds: 90},
  B: {pages: [4, 5, 6], targetSeconds: 135},
  C: {pages: [7, 8, 9, 10], targetSeconds: 210},
  ALL11: {pages: [11], targetSeconds: 45},
};

function getRoleConfig() {
  return ROLE_CONFIG[activeRoleFilter] || ROLE_CONFIG.all;
}

function getContinuousReadIdleLabel() {
  return activeRoleFilter === 'all' ? '🔁 P1→P11 連續朗讀排練' : '🔁 連續朗讀本隊員段落';
}

function stopAllSpeech() {
  speechSessionId += 1;
  continuousReading = false;
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
  const speakBtn = byId('speak-slide-btn');
  if (speakBtn) speakBtn.textContent = '🔊 聽講稿示範朗讀';
  const contBtn = byId('continuous-read-btn');
  if (contBtn) {
    contBtn.textContent = getContinuousReadIdleLabel();
    contBtn.classList.remove('is-active');
  }
  const qaBtns = document.querySelectorAll?.('.qa-speak-btn') || [];
  for (const btn of qaBtns) {
    btn.textContent = '🔊 聽滿分回答';
    btn.dataset.speaking = 'false';
  }
}

function speakTextOnce(text) {
  const UtteranceCtor = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
  if (!window.speechSynthesis || !UtteranceCtor || !text) return;
  const session = ++speechSessionId;
  const utterance = new UtteranceCtor(text);
  utterance.lang = 'zh-TW';
  utterance.rate = getSpeechRate();
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    if (session === speechSessionId) stopAllSpeech();
  }
}

function speakCurrentSlideForContinuous() {
  const UtteranceCtor = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
  if (!window.speechSynthesis || !UtteranceCtor || !continuousReading) {
    stopAllSpeech();
    return;
  }
  const session = ++speechSessionId;
  const text = byId('speaker-text')?.textContent || '';
  const utterance = new UtteranceCtor(text);
  utterance.lang = 'zh-TW';
  utterance.rate = getSpeechRate();
  const contBtn = byId('continuous-read-btn');
  if (contBtn) {
    contBtn.textContent = '⏹ 停止連續排練';
    contBtn.classList.add('is-active');
  }
  let handled = false;
  const handleEnd = () => {
    if (handled || session !== speechSessionId) return;
    handled = true;
    if (!continuousReading) return;
    const rolePages = getRoleConfig().pages;
    const lastPage = Math.min(rolePages[rolePages.length - 1] || state.story.slides.length, state.story.slides.length);
    if (state.page < lastPage) {
      showPage(state.page + 1, true, true);
      speakCurrentSlideForContinuous();
    } else {
      stopAllSpeech();
    }
  };
  const handleError = () => {
    if (handled || session !== speechSessionId) return;
    handled = true;
    stopAllSpeech();
  };
  utterance.onend = handleEnd;
  utterance.onerror = handleError;
  utterance.addEventListener?.('end', handleEnd);
  utterance.addEventListener?.('error', handleError);
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } catch {
    if (session === speechSessionId) stopAllSpeech();
  }
}

function renderJudgeQa(story) {
  const container = byId('judge-qa-list');
  if (!container) return;
  const qaItems = story.qa || [];
  container.replaceChildren(...qaItems.map((item, idx) => {
    const card = document.createElement('article');
    card.className = 'judge-qa-card';
    const head = document.createElement('div');
    head.className = 'judge-qa-head';
    const tag = document.createElement('span');
    tag.className = 'judge-qa-tag';
    tag.textContent = item.tag || `必考題 ${idx + 1}`;
    head.append(tag);
    if (item.responder) {
      const resp = document.createElement('span');
      resp.className = 'judge-qa-responder';
      resp.textContent = item.responder;
      head.append(resp);
    }
    const q = document.createElement('strong');
    q.className = 'judge-qa-q';
    q.textContent = item.q;
    head.append(q);
    card.append(head);
    if (item.highlight) {
      const hl = document.createElement('p');
      hl.className = 'judge-qa-highlight';
      hl.textContent = item.highlight;
      card.append(hl);
    }
    const ans = document.createElement('p');
    ans.className = 'judge-qa-a';
    ans.textContent = item.a;
    card.append(ans);
    const actionsRow = document.createElement('div');
    actionsRow.className = 'judge-qa-actions';
    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'speaker-tool-btn qa-speak-btn';
    speakBtn.textContent = '🔊 聽滿分回答';
    speakBtn.dataset.speaking = 'false';
    speakBtn.addEventListener('click', () => {
      const UtteranceCtor = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
      if (!window.speechSynthesis || !UtteranceCtor) return;
      const wasSpeakingThis = speakBtn.dataset.speaking === 'true' && window.speechSynthesis.speaking;
      stopAllSpeech();
      if (wasSpeakingThis) return;
      const session = ++speechSessionId;
      const spokenText = item.highlight ? `${item.highlight} ${item.a}` : item.a;
      const utterance = new UtteranceCtor(spokenText);
      utterance.lang = 'zh-TW';
      utterance.rate = getSpeechRate();
      speakBtn.textContent = '⏹ 停止朗讀';
      speakBtn.dataset.speaking = 'true';
      const resetQaBtn = () => {
        if (session !== speechSessionId) return;
        speakBtn.textContent = '🔊 聽滿分回答';
        speakBtn.dataset.speaking = 'false';
      };
      utterance.onend = resetQaBtn;
      utterance.onerror = resetQaBtn;
      utterance.addEventListener?.('end', resetQaBtn);
      utterance.addEventListener?.('error', resetQaBtn);
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        resetQaBtn();
      }
    });
    actionsRow.append(speakBtn);
    if (item.evidencePage) {
      const jumpBtn = document.createElement('button');
      jumpBtn.type = 'button';
      jumpBtn.className = 'speaker-tool-btn qa-evidence-jump-btn';
      jumpBtn.textContent = `🔍 跳至 P${item.evidencePage} 簡報證據`;
      jumpBtn.addEventListener('click', () => {
        showPage(item.evidencePage);
        byId('slide-main')?.scrollIntoView?.({behavior: 'smooth', block: 'start'});
      });
      actionsRow.append(jumpBtn);
    }
    if (item.evidenceHref) {
      const evLink = document.createElement('a');
      evLink.className = 'speaker-tool-btn qa-evidence-link';
      evLink.href = item.evidenceHref;
      evLink.target = '_blank';
      evLink.rel = 'noopener noreferrer';
      evLink.textContent = item.evidenceLabel ? `${item.evidenceLabel} · 🚀 開啟實機證據畫面 ↗` : '🚀 開啟實機證據畫面 ↗';
      actionsRow.append(evLink);
    }
    card.append(actionsRow);
    return card;
  }));
}

function renderPrintableCueSheet(story) {
  const sheet = byId('printable-cue-sheet');
  if (!sheet) return;
  const heading = document.createElement('h2');
  heading.className = 'printable-cue-heading';
  heading.textContent = `🖨️ ${story.name}（${story.team}）｜8 分鐘報告＋實機展示 11 頁上台手卡總表`;
  const grid = document.createElement('div');
  grid.className = 'printable-cue-grid';
  for (let i = 0; i < story.slides.length; i += 1) {
    const item = story.slides[i];
    const card = document.createElement('article');
    card.className = 'printable-cue-card';
    const meta = document.createElement('div');
    meta.className = 'printable-cue-meta';
    const pBadge = document.createElement('span');
    pBadge.className = 'printable-cue-page';
    pBadge.textContent = `P${i + 1}`;
    const rBadge = document.createElement('span');
    rBadge.className = 'printable-cue-role';
    rBadge.textContent = item.role || '👥 隊員分工';
    const tBadge = document.createElement('span');
    tBadge.className = 'printable-cue-time';
    tBadge.textContent = `⏱️ 建議 ${item.seconds || 30} 秒`;
    meta.append(pBadge, rBadge, tBadge);
    const title = document.createElement('strong');
    title.className = 'printable-cue-title';
    title.textContent = item.title;
    card.append(meta, title);
    if (item.highlight) {
      const hl = document.createElement('p');
      hl.className = 'printable-cue-highlight';
      hl.textContent = item.highlight;
      card.append(hl);
    }
    const say = document.createElement('p');
    say.className = 'printable-cue-say';
    say.textContent = item.say;
    card.append(say);
    if (item.demo) {
      const demo = document.createElement('p');
      demo.className = 'printable-cue-demo';
      demo.textContent = item.demo;
      card.append(demo);
    }
    grid.append(card);
  }
  sheet.replaceChildren(heading, grid);
}

function renderSlidePills(slides) {
  const pills = byId('slide-pills');
  if (!pills) return;
  const hadFocus = pills.contains(document.activeElement);
  const rolePages = getRoleConfig().pages;
  pills.replaceChildren(...slides.map((item, index) => {
    const pageNum = index + 1;
    const btn = document.createElement('button');
    const isCurrent = pageNum === state.page;
    const classes = ['slide-pill'];
    if (isCurrent) classes.push('is-active');
    if (activeRoleFilter !== 'all') {
      classes.push(rolePages.includes(pageNum) ? 'is-role-target' : 'is-role-dimmed');
    }
    btn.type = 'button';
    btn.className = classes.join(' ');
    btn.textContent = `P${pageNum}`;
    btn.title = item.title;
    btn.setAttribute('aria-label', `第 ${pageNum} 頁：${item.title}`);
    btn.setAttribute('aria-pressed', String(isCurrent));
    btn.addEventListener('click', () => showPage(pageNum));
    return btn;
  }));
  if (hadFocus) {
    pills.querySelector('[aria-pressed="true"]')?.focus();
  }
}

function renderSlideThumbnails(slides) {
  const grid = byId('slide-thumb-grid');
  if (!grid) return;
  const hadFocus = grid.contains(document.activeElement);
  const rolePages = getRoleConfig().pages;
  grid.replaceChildren(...slides.map((item, index) => {
    const pageNum = index + 1;
    const btn = document.createElement('button');
    const isCurrent = pageNum === state.page;
    const classes = ['slide-thumb-card'];
    if (isCurrent) classes.push('is-active');
    if (activeRoleFilter !== 'all') {
      classes.push(rolePages.includes(pageNum) ? 'is-role-target' : 'is-role-dimmed');
    }
    btn.type = 'button';
    btn.className = classes.join(' ');
    btn.setAttribute('aria-pressed', String(isCurrent));
    btn.setAttribute('aria-label', `第 ${pageNum} 頁：${item.title}`);
    const img = document.createElement('img');
    img.src = `slide-pages/${state.team}/${pad(pageNum)}.png`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = '';
    const meta = document.createElement('div');
    meta.className = 'slide-thumb-meta';
    const badge = document.createElement('span');
    badge.className = 'slide-thumb-badge';
    badge.textContent = `P${pageNum}`;
    const title = document.createElement('strong');
    title.className = 'slide-thumb-title';
    title.textContent = item.title;
    meta.append(badge, title);
    btn.append(img, meta);
    btn.addEventListener('click', () => {
      showPage(pageNum);
      byId('slide-main')?.scrollIntoView?.({behavior: 'smooth', block: 'start'});
    });
    return btn;
  }));
  if (hadFocus) {
    grid.querySelector('[aria-pressed="true"]')?.focus();
  }
}

function showPage(page, remember = true, keepContinuous = false) {
  state = resolveStory(`?team=${state.team}&page=${page}`);
  const {team, story, slide} = state;
  document.body.dataset.team = team;
  document.title = `${story.name}第${state.page}頁｜邊看簡報，邊玩作品`;
  byId('deck-name').textContent = story.name;
  byId('journey-return').href = story.journey;
  byId('journey-return').textContent = team === 'food' ? '回我的午餐任務' : '回我的聽路任務';
  byId('slide-picker').replaceChildren(...story.slides.map((item, index) => {
    const option = document.createElement('option'); option.value = String(index+1); option.textContent = `${index+1} ${item.title}`; return option;
  }));
  byId('slide-picker').value = String(state.page);
  byId('slide-image').src = `slide-pages/${team}/${pad(state.page)}.png`;
  byId('slide-image').alt = `${story.name}第${state.page}頁，${slide.title}`;
  byId('image-error').hidden = true;
  byId('page-title').textContent = slide.title;
  byId('try-action').textContent = slide.action;
  byId('try-action').href = slide.href;
  byId('page-extra-actions').replaceChildren(...(slide.extraActions ?? []).map(action => {
    const link = document.createElement('a'); link.textContent = action.label; link.href = action.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
  }));
  byId('page-extra-actions').hidden = !(slide.extraActions?.length);
  byId('speaker-text').textContent = slide.say;
  const highlightTextEl = byId('slide-highlight-text');
  if (highlightTextEl) {
    highlightTextEl.textContent = slide.highlight || '';
    highlightTextEl.hidden = !slide.highlight;
  }
  const demoTextEl = byId('slide-demo-text');
  if (demoTextEl) {
    demoTextEl.textContent = slide.demo || '';
    demoTextEl.hidden = !slide.demo;
  }
  const demoLinkEl = byId('slide-demo-link');
  if (demoLinkEl) {
    demoLinkEl.href = slide.href || story.journey;
    demoLinkEl.textContent = `🚀 一鍵開啟本頁實機展示（${slide.action}）↗`;
  }
  const demoBoxEl = byId('slide-demo-box');
  if (demoBoxEl) {
    demoBoxEl.hidden = !slide.demo && !slide.href;
  }
  const roleBadge = byId('slide-role-badge');
  if (roleBadge) roleBadge.textContent = slide.role || '👥 隊員分工';
  const timeBadge = byId('slide-time-badge');
  if (timeBadge) timeBadge.textContent = `⏱️ 建議 ${slide.seconds || 30} 秒`;
  const handoffBadge = byId('slide-handoff-badge');
  if (handoffBadge) {
    const handoffText = getSlideHandoffHint(state.page);
    handoffBadge.textContent = handoffText;
    handoffBadge.hidden = !handoffText;
  }
  byId('page-status').textContent = `${story.name}第 ${state.page} 頁，共 ${story.slides.length} 頁`;
  byId('short-count').textContent = `${state.page} / ${story.slides.length}`;
  if (byId('page-number')) byId('page-number').textContent = `第 ${state.page} / ${story.slides.length} 頁`;
  if (byId('slide-pace-hint')) byId('slide-pace-hint').textContent = getSlidePaceHint(state.page, slide);
  byId('previous-slide').disabled = state.page === 1;
  byId('next-slide').disabled = state.page === story.slides.length;
  const prevTapEl = byId('slide-prev-tap');
  if (prevTapEl) prevTapEl.disabled = state.page === 1;
  const nextTapEl = byId('slide-next-tap');
  if (nextTapEl) nextTapEl.disabled = state.page === story.slides.length;
  byId('records-link').href = team === 'food' ? FOOD_APP+'/presentation?view=mine' : SOUND_APP+'/competition';
  byId('pdf-link').href = `${story.pdf}#page=${state.page}`;
  if (byId('error-pdf-link')) byId('error-pdf-link').href = `${story.pdf}#page=${state.page}`;
  const downloadDeckBundle = byId('download-deck-bundle');
  if (downloadDeckBundle) {
    downloadDeckBundle.href = story.pdf;
  }
  byId('ppt-link').href = story.pptx;
  byId('guide-link').href = `student-guide.html#${team}`;
  const switchTeam = byId('switch-team');
  if (switchTeam) {
    switchTeam.href = team === 'food' ? 'slides.html?team=sound&page=1' : 'slides.html?team=food&page=1';
    switchTeam.textContent = team === 'food' ? '切換至：聲景智探 ⇄' : '切換至：食光偵探 ⇄';
  }
  if (!keepContinuous) {
    stopAllSpeech();
  }
  const copyBtn = byId('copy-script-btn');
  if (copyBtn) copyBtn.textContent = '📋 複製本頁講稿';
  const qrApp = byId('slide-qr-app');
  const qrAppImg = byId('slide-qr-app-img');
  const qrAppTitle = byId('slide-qr-app-title');
  const qrFeature = byId('slide-qr-feature');
  const qrFeatureImg = byId('slide-qr-feature-img');
  const qrFeatureTitle = byId('slide-qr-feature-title');
  if (team === 'food') {
    if (qrApp) qrApp.href = FOOD_APP + '/';
    if (qrAppImg) qrAppImg.src = 'img/qr-foodlens.svg';
    if (qrAppTitle) qrAppTitle.textContent = '開啟食光偵探 App';
    if (qrFeature) qrFeature.href = FOOD_APP + '/scan?view=history';
    if (qrFeatureImg) qrFeatureImg.src = 'img/qr-food-history.svg';
    if (qrFeatureTitle) qrFeatureTitle.textContent = '餐盤實測與大數據庫';
  } else {
    if (qrApp) qrApp.href = SOUND_APP + '/';
    if (qrAppImg) qrAppImg.src = 'img/qr-soundscape.svg';
    if (qrAppTitle) qrAppTitle.textContent = '開啟聲景智探 App';
    if (qrFeature) qrFeature.href = SOUND_APP + '/?view=map#my-sound-map';
    if (qrFeatureImg) qrFeatureImg.src = 'img/qr-sound-map.svg';
    if (qrFeatureTitle) qrFeatureTitle.textContent = '擴充聲音地圖與時光機';
  }
  renderSlidePills(story.slides);
  renderSlideThumbnails(story.slides);
  if (renderedTeam !== team) {
    renderedTeam = team;
    lastRandomQaIndex = -1;
    currentQuizItem = null;
    const quizBox = byId('qa-quiz-box');
    const revealBtn = byId('reveal-qa-btn');
    const quizEvActions = byId('qa-quiz-evidence-actions');
    if (quizBox) quizBox.hidden = true;
    if (revealBtn) revealBtn.hidden = true;
    if (quizEvActions) quizEvActions.hidden = true;
    renderJudgeQa(story);
    renderPrintableCueSheet(story);
  }
  const ImageCtor = window?.Image || (typeof Image !== 'undefined' ? Image : null);
  if (ImageCtor) {
    for (const adj of [state.page - 1, state.page + 1]) {
      if (adj >= 1 && adj <= story.slides.length) {
        const preload = new ImageCtor();
        preload.src = `slide-pages/${team}/${pad(adj)}.png`;
      }
    }
  }
  if (remember) {
    const url = new URL(window.location.href);
    url.searchParams.set('team', team);
    url.searchParams.set('page', String(state.page));
    if (activeRoleFilter !== 'all') url.searchParams.set('role', activeRoleFilter);
    else url.searchParams.delete('role');
    try {window.history.replaceState(window.history.state, '', url);} catch { /* The controls still work when the browser cannot remember the page. */ }
  }
}

const listeners = [];
const on = (target, type, callback, options) => {
  if (!target) return;
  target.addEventListener(type, callback, options);
  listeners.push(() => target.removeEventListener?.(type, callback, options));
};

const slideImg = byId('slide-image');
on(slideImg, 'error', () => {byId('image-error').hidden = false;});
let touchStartX = null;
let touchStartY = null;
on(slideImg, 'touchstart', event => {
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, {passive: true});
on(slideImg, 'touchend', event => {
  const touch = event.changedTouches?.[0];
  if (!touch || touchStartX === null || touchStartY === null) return;
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  touchStartX = null;
  touchStartY = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0 && state.page < TEAM_STORIES[state.team].slides.length) showPage(state.page + 1);
    else if (dx > 0 && state.page > 1) showPage(state.page - 1);
  }
}, {passive: true});
on(byId('slide-picker'), 'change', event => showPage(Number(event.target.value)));
on(byId('previous-slide'), 'click', () => showPage(state.page-1));
on(byId('next-slide'), 'click', () => showPage(state.page+1));
const slidePrevTap = byId('slide-prev-tap');
const slideNextTap = byId('slide-next-tap');
if (slidePrevTap) on(slidePrevTap, 'click', () => { if (state.page > 1) showPage(state.page - 1); });
if (slideNextTap) on(slideNextTap, 'click', () => { if (state.page < TEAM_STORIES[state.team].slides.length) showPage(state.page + 1); });
const speakSlideBtn = byId('speak-slide-btn');
if (speakSlideBtn) {
  on(speakSlideBtn, 'click', () => {
    const UtteranceCtor = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
    if (window.speechSynthesis && UtteranceCtor) {
      const anyQaSpeaking = Array.from(document.querySelectorAll?.('.qa-speak-btn') || []).some(b => b.dataset.speaking === 'true');
      const wasSpeakingSingle = !continuousReading && !anyQaSpeaking && (window.speechSynthesis.speaking || speakSlideBtn.textContent === '⏹ 停止朗讀');
      stopAllSpeech();
      if (wasSpeakingSingle) return;
      const session = ++speechSessionId;
      const utterance = new UtteranceCtor(byId('speaker-text').textContent);
      utterance.lang = 'zh-TW';
      utterance.rate = getSpeechRate();
      speakSlideBtn.textContent = '⏹ 停止朗讀';
      const resetLabel = () => {
        if (session !== speechSessionId) return;
        speakSlideBtn.textContent = '🔊 聽講稿示範朗讀';
      };
      utterance.onend = resetLabel;
      utterance.onerror = resetLabel;
      utterance.addEventListener?.('end', resetLabel);
      utterance.addEventListener?.('error', resetLabel);
      try {
        window.speechSynthesis.speak(utterance);
      } catch {
        resetLabel();
      }
    }
  });
}
const continuousReadBtn = byId('continuous-read-btn');
if (continuousReadBtn) {
  on(continuousReadBtn, 'click', () => {
    if (continuousReading) {
      stopAllSpeech();
      return;
    }
    stopAllSpeech();
    continuousReading = true;
    const firstPage = getRoleConfig().pages[0] || 1;
    if (state.page !== firstPage) {
      showPage(firstPage, true, true);
    }
    speakCurrentSlideForContinuous();
  });
}
const roleFilterBtns = Array.from(document.querySelectorAll?.('.role-filter-btn') || []);
function syncRoleFilterButtons() {
  for (const b of roleFilterBtns) {
    const active = (b.dataset.role || 'all') === activeRoleFilter;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', String(active));
  }
}
for (const btn of roleFilterBtns) {
  on(btn, 'click', () => {
    const nextRole = btn.dataset.role || 'all';
    activeRoleFilter = ROLE_CONFIG[nextRole] ? nextRole : 'all';
    chime7mTriggered = false;
    chime8mTriggered = false;
    syncRoleFilterButtons();
    const firstPage = getRoleConfig().pages[0] || 1;
    showPage(firstPage);
    updateTimerDisplay();
  });
}
const teleprompterSizeBtn = byId('teleprompter-size-btn');
if (teleprompterSizeBtn) {
  on(teleprompterSizeBtn, 'click', () => {
    const speakerBox = document.querySelector?.('.speaker');
    if (!speakerBox) return;
    const isLarge = speakerBox.classList.toggle('is-large-teleprompter');
    teleprompterSizeBtn.classList.toggle('is-active', isLarge);
    teleprompterSizeBtn.setAttribute('aria-pressed', String(isLarge));
  });
}
const randomQaBtn = byId('random-qa-btn');
const revealQaBtn = byId('reveal-qa-btn');
const qaQuizJumpBtn = byId('qa-quiz-jump-btn');
const qaTimerBtn = byId('qa-timer-btn');
const qaTimerStatus = byId('qa-timer-status');
let qaCountdownInterval = null;
let qaRemainingSec = 0;

function stopQaCountdown() {
  if (qaCountdownInterval !== null) {
    window.clearInterval(qaCountdownInterval);
    qaCountdownInterval = null;
  }
  if (qaTimerBtn) {
    qaTimerBtn.textContent = '⏱️ 20秒答題倒數';
    qaTimerBtn.classList.remove('is-active');
  }
}

if (qaTimerBtn) {
  on(qaTimerBtn, 'click', () => {
    if (qaCountdownInterval !== null) {
      stopQaCountdown();
      if (qaTimerStatus) qaTimerStatus.textContent = '';
      return;
    }
    qaRemainingSec = 20;
    qaTimerBtn.textContent = '⏹ 停止倒數';
    qaTimerBtn.classList.add('is-active');
    if (qaTimerStatus) qaTimerStatus.textContent = `⏱️ 剩餘 ${qaRemainingSec} 秒...`;
    qaCountdownInterval = window.setInterval(() => {
      qaRemainingSec -= 1;
      if (qaRemainingSec > 0) {
        if (qaTimerStatus) qaTimerStatus.textContent = `⏱️ 剩餘 ${qaRemainingSec} 秒...`;
      } else {
        stopQaCountdown();
        if (qaTimerStatus) qaTimerStatus.textContent = '⏰ 20 秒到！請看滿分示範';
      }
    }, 1000);
  });
}

if (randomQaBtn) {
  on(randomQaBtn, 'click', () => {
    const qaList = state.story.qa || [];
    if (!qaList.length) return;
    let idx = Math.floor(Math.random() * qaList.length);
    if (qaList.length > 1 && idx === lastRandomQaIndex) {
      idx = (idx + 1) % qaList.length;
    }
    lastRandomQaIndex = idx;
    currentQuizItem = qaList[idx];
    const quizBox = byId('qa-quiz-box');
    const quizQ = byId('qa-quiz-question');
    const quizA = byId('qa-quiz-answer');
    const quizEvActions = byId('qa-quiz-evidence-actions');
    if (quizBox) quizBox.hidden = false;
    const responderHint = currentQuizItem.responder ? `（${currentQuizItem.responder}）` : '';
    if (quizQ) quizQ.textContent = `🎤 評審提問：${currentQuizItem.q}${responderHint}（請先試著回答 15–20 秒，再按「揭曉滿分回答」！）`;
    if (quizA) {
      quizA.hidden = true;
      quizA.textContent = currentQuizItem.highlight ? `${currentQuizItem.highlight}\n💡 滿分回答：${currentQuizItem.a}` : `💡 滿分回答：${currentQuizItem.a}`;
    }
    if (quizEvActions) quizEvActions.hidden = true;
    if (qaQuizJumpBtn && currentQuizItem.evidencePage) {
      qaQuizJumpBtn.textContent = `🔍 跳至 P${currentQuizItem.evidencePage} 簡報證據`;
    }
    if (revealQaBtn) revealQaBtn.hidden = false;
    stopAllSpeech();
    speakTextOnce(currentQuizItem.q);
  });
}
if (revealQaBtn) {
  on(revealQaBtn, 'click', () => {
    const quizA = byId('qa-quiz-answer');
    const quizEvActions = byId('qa-quiz-evidence-actions');
    if (quizA) quizA.hidden = false;
    if (quizEvActions) quizEvActions.hidden = !currentQuizItem?.evidencePage;
    if (currentQuizItem?.a) {
      stopAllSpeech();
      const spoken = currentQuizItem.highlight ? `${currentQuizItem.highlight} ${currentQuizItem.a}` : currentQuizItem.a;
      speakTextOnce(spoken);
    }
  });
}
if (qaQuizJumpBtn) {
  on(qaQuizJumpBtn, 'click', () => {
    if (currentQuizItem?.evidencePage) {
      showPage(currentQuizItem.evidencePage);
      byId('slide-main')?.scrollIntoView?.({behavior: 'smooth', block: 'start'});
    }
  });
}
let restoreQaCloseAfterPrint = false;
const printCueCardsBtn = byId('print-cue-cards-btn');
if (printCueCardsBtn) {
  on(printCueCardsBtn, 'click', () => {
    const qaSection = byId('judge-qa-section');
    if (qaSection && !qaSection.open) {
      restoreQaCloseAfterPrint = true;
      qaSection.open = true;
    }
    window.print?.();
  });
}
on(window, 'beforeprint', () => {
  const qaSection = byId('judge-qa-section');
  if (qaSection && !qaSection.open) {
    restoreQaCloseAfterPrint = true;
    qaSection.open = true;
  }
});
on(window, 'afterprint', () => {
  const qaSection = byId('judge-qa-section');
  if (restoreQaCloseAfterPrint && qaSection) {
    qaSection.open = false;
    restoreQaCloseAfterPrint = false;
  }
});
const copyScriptBtn = byId('copy-script-btn');
let copyResetTimer = null;
if (copyScriptBtn) {
  on(copyScriptBtn, 'click', async () => {
    const speakerText = byId('speaker-text')?.textContent || '';
    const slide = state.slide;
    const parts = [slide?.highlight, speakerText, slide?.demo].filter(Boolean);
    const text = parts.join('\n');
    const clipboard = window.navigator?.clipboard ?? (typeof navigator !== 'undefined' ? navigator.clipboard : null);
    const scheduleReset = (ms) => {
      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        copyScriptBtn.textContent = '📋 複製本頁講稿';
      }, ms);
    };
    if (!clipboard || typeof clipboard.writeText !== 'function') {
      copyScriptBtn.textContent = '請長按講稿文字複製';
      scheduleReset(2200);
      return;
    }
    try {
      await clipboard.writeText(text);
      copyScriptBtn.textContent = '✓ 已複製講稿';
      scheduleReset(1800);
    } catch {
      copyScriptBtn.textContent = '請長按講稿文字複製';
      scheduleReset(2200);
    }
  });
}
const fullscreenBtn = byId('fullscreen-slide');
if (fullscreenBtn) {
  on(fullscreenBtn, 'click', () => {
    const target = document.querySelector?.('.slide-card') || document.querySelector?.('.slide-figure') || byId('slide-main');
    if (!target) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.()?.catch?.(() => {});
    } else {
      target.requestFullscreen?.()?.catch?.(() => {});
    }
  });
}
let timerInterval = null;
let accumulatedMs = 0;
let timerStartedAt = null;
let tickFallbackCount = 0;
let chime7mTriggered = false;
let chime8mTriggered = false;

let sharedAudioCtx = null;
function getSharedAudioContext() {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      try {
        sharedAudioCtx = new AudioCtx();
      } catch {}
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

window.addEventListener('pointerdown', () => getSharedAudioContext(), { once: true, passive: true });
window.addEventListener('keydown', () => getSharedAudioContext(), { once: true, passive: true });

function playStageChime(count = 1) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const startAt = ctx.currentTime + i * 0.38;
      osc.frequency.setValueAtTime(880, startAt); // A5 chime bell
      gain.gain.setValueAtTime(0.28, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.65);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.65);
    }
  } catch {}
}

const timerDisplay = byId('timer-display');
const timerToggleBtn = byId('timer-toggle-btn');
const timerResetBtn = byId('timer-reset-btn');
const timerBar = byId('rehearsal-timer-bar');
const timerProgressFill = byId('timer-progress-fill');

function currentElapsedMs() {
  if (timerStartedAt === null) return accumulatedMs;
  const wallMs = Math.max(0, Date.now() - timerStartedAt);
  const effectiveRunMs = Math.max(wallMs, tickFallbackCount * 1000);
  return accumulatedMs + effectiveRunMs;
}

function formatClock(sec) {
  const target = getRoleConfig().targetSeconds;
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  const tm = String(Math.floor(target / 60)).padStart(2, '0');
  const ts = String(target % 60).padStart(2, '0');
  return `${m}:${s} / ${tm}:${ts}`;
}

function updateTimerDisplay() {
  const sec = Math.floor(currentElapsedMs() / 1000);
  const target = getRoleConfig().targetSeconds;
  if (timerDisplay) timerDisplay.textContent = formatClock(sec);
  if (timerBar) timerBar.classList.toggle('is-overtime', sec > target);
  if (timerProgressFill) {
    timerProgressFill.style.width = `${Math.min(100, Math.round((sec / target) * 100))}%`;
  }
  if (activeRoleFilter === 'all' && timerInterval !== null) {
    if (sec >= 420 && !chime7mTriggered) {
      chime7mTriggered = true;
      playStageChime(1);
    }
    if (sec >= 480 && !chime8mTriggered) {
      chime8mTriggered = true;
      playStageChime(2);
    }
  }
}

if (timerToggleBtn) {
  on(timerToggleBtn, 'click', () => {
    getSharedAudioContext();
    if (timerInterval !== null) {
      accumulatedMs = currentElapsedMs();
      timerStartedAt = null;
      tickFallbackCount = 0;
      window.clearInterval(timerInterval);
      timerInterval = null;
      updateTimerDisplay();
      timerToggleBtn.textContent = '▶ 繼續計時';
      if (timerBar) timerBar.classList.remove('is-running');
    } else {
      timerStartedAt = Date.now();
      tickFallbackCount = 0;
      timerToggleBtn.textContent = '⏸ 暫停計時';
      if (timerBar) timerBar.classList.add('is-running');
      timerInterval = window.setInterval(() => {
        tickFallbackCount += 1;
        updateTimerDisplay();
      }, 1000);
    }
  });
}

if (timerResetBtn) {
  on(timerResetBtn, 'click', () => {
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      timerInterval = null;
    }
    accumulatedMs = 0;
    timerStartedAt = null;
    tickFallbackCount = 0;
    chime7mTriggered = false;
    chime8mTriggered = false;
    updateTimerDisplay();
    if (timerToggleBtn) timerToggleBtn.textContent = '▶ 開始計時';
    if (timerBar) timerBar.classList.remove('is-running', 'is-overtime');
  });
}

function applyUrlRoleAndPage(searchStr) {
  state = resolveStory(searchStr);
  const params = new URLSearchParams(searchStr);
  const roleParam = params.get('role');
  if (roleParam && ROLE_CONFIG[roleParam]) {
    activeRoleFilter = roleParam;
    if (!params.get('page')) {
      state = resolveStory(`?team=${state.team}&page=${ROLE_CONFIG[roleParam].pages[0]}`);
    }
  } else {
    activeRoleFilter = 'all';
  }
  chime7mTriggered = false;
  chime8mTriggered = false;
  syncRoleFilterButtons();
  updateTimerDisplay();
}

on(window, 'popstate', () => {
  applyUrlRoleAndPage(window.location.search);
  showPage(state.page, false);
});
on(window, 'pagehide', stopAllSpeech);
on(window, 'keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
  const inFormField = Boolean(event.target?.closest?.('input,textarea,select,[contenteditable="true"]'));
  if (inFormField) return;
  const inInteractive = Boolean(event.target?.closest?.('button,a,input,textarea,select,summary,[contenteditable="true"]'));
  if ((event.key === 'ArrowRight' || event.key === 'PageDown') && state.page < TEAM_STORIES[state.team].slides.length) {
    event.preventDefault();
    showPage(state.page + 1);
    return;
  }
  if ((event.key === 'ArrowLeft' || event.key === 'PageUp') && state.page > 1) {
    event.preventDefault();
    showPage(state.page - 1);
    return;
  }
  if (event.key === 'Home' && state.page > 1) {
    event.preventDefault();
    showPage(1);
    return;
  }
  if (event.key === 'End' && state.page < TEAM_STORIES[state.team].slides.length) {
    event.preventDefault();
    showPage(TEAM_STORIES[state.team].slides.length);
    return;
  }
  if (event.key === ' ' && !inInteractive) {
    event.preventDefault();
    if (state.page < TEAM_STORIES[state.team].slides.length) {
      showPage(state.page + 1);
    }
    return;
  }
  if ((event.key === 's' || event.key === 'S') && !inInteractive && speakSlideBtn) {
    event.preventDefault();
    speakSlideBtn.click();
    return;
  }
  if ((event.key === 'f' || event.key === 'F') && !inInteractive && fullscreenBtn) {
    event.preventDefault();
    fullscreenBtn.click();
    return;
  }
  if ((event.key === 'r' || event.key === 'R') && !inInteractive && randomQaBtn) {
    event.preventDefault();
    randomQaBtn.click();
  }
});
applyUrlRoleAndPage(window.location.search);
showPage(state.page, false);
function dispose() {
  stopAllSpeech();
  stopQaCountdown();
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  timerStartedAt = null;
  chime7mTriggered = false;
  chime8mTriggered = false;
  if (copyResetTimer) {
    clearTimeout(copyResetTimer);
    copyResetTimer = null;
  }
  while (listeners.length) {
    const off = listeners.pop();
    try { off(); } catch {}
  }
}
return {showPage, dispose};
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') installSlidePlayer(document, window);
