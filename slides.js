import {TEAM_STORIES, FOOD_APP, SOUND_APP, resolveStory} from './story-data.js';

export function installSlidePlayer(document, window) {
const byId = id => document.getElementById(id);
let state = resolveStory(window.location.search);

const pad = n => String(n).padStart(2, '0');

function getSlidePaceHint(page) {
  if (page >= 7 && page <= 10) return '核心亮點頁 · 建議約 20 秒';
  if (page === 11) return '總結呼籲 · 建議約 15 秒';
  return '本頁建議約 15 秒';
}

function renderSlidePills(slides) {
  const pills = byId('slide-pills');
  if (!pills) return;
  const hadFocus = pills.contains(document.activeElement);
  pills.replaceChildren(...slides.map((item, index) => {
    const btn = document.createElement('button');
    const isCurrent = index + 1 === state.page;
    btn.type = 'button';
    btn.className = isCurrent ? 'slide-pill is-active' : 'slide-pill';
    btn.textContent = `P${index + 1}`;
    btn.title = item.title;
    btn.setAttribute('aria-label', `第 ${index + 1} 頁：${item.title}`);
    btn.setAttribute('aria-pressed', String(isCurrent));
    btn.addEventListener('click', () => showPage(index + 1));
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
  grid.replaceChildren(...slides.map((item, index) => {
    const btn = document.createElement('button');
    const isCurrent = index + 1 === state.page;
    btn.type = 'button';
    btn.className = isCurrent ? 'slide-thumb-card is-active' : 'slide-thumb-card';
    btn.setAttribute('aria-pressed', String(isCurrent));
    btn.setAttribute('aria-label', `第 ${index + 1} 頁：${item.title}`);
    const img = document.createElement('img');
    img.src = `slide-pages/${state.team}/${pad(index + 1)}.png`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = '';
    const meta = document.createElement('div');
    meta.className = 'slide-thumb-meta';
    const badge = document.createElement('span');
    badge.className = 'slide-thumb-badge';
    badge.textContent = `P${index + 1}`;
    const title = document.createElement('strong');
    title.className = 'slide-thumb-title';
    title.textContent = item.title;
    meta.append(badge, title);
    btn.append(img, meta);
    btn.addEventListener('click', () => {
      showPage(index + 1);
      byId('slide-main')?.scrollIntoView?.({behavior: 'smooth', block: 'start'});
    });
    return btn;
  }));
  if (hadFocus) {
    grid.querySelector('[aria-pressed="true"]')?.focus();
  }
}

function showPage(page, remember = true) {
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
  byId('page-status').textContent = `${story.name}第 ${state.page} 頁，共 ${story.slides.length} 頁`;
  byId('short-count').textContent = `${state.page} / ${story.slides.length}`;
  if (byId('page-number')) byId('page-number').textContent = `第 ${state.page} / ${story.slides.length} 頁`;
  if (byId('slide-pace-hint')) byId('slide-pace-hint').textContent = getSlidePaceHint(state.page);
  byId('previous-slide').disabled = state.page === 1;
  byId('next-slide').disabled = state.page === story.slides.length;
  byId('records-link').href = team === 'food' ? FOOD_APP+'/presentation?view=mine' : SOUND_APP+'/competition';
  byId('pdf-link').href = `${story.pdf}#page=${state.page}`;
  if (byId('error-pdf-link')) byId('error-pdf-link').href = `${story.pdf}#page=${state.page}`;
  byId('ppt-link').href = story.pptx;
  byId('guide-link').href = `student-guide.html#${team}`;
  const switchTeam = byId('switch-team');
  if (switchTeam) {
    switchTeam.href = team === 'food' ? 'slides.html?team=sound&page=1' : 'slides.html?team=food&page=1';
    switchTeam.textContent = team === 'food' ? '切換至：聲景智探 ⇄' : '切換至：食光偵探 ⇄';
  }
  if (window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch {}
  }
  const speakBtn = byId('speak-slide-btn');
  if (speakBtn) speakBtn.textContent = '🔊 聽講稿示範朗讀';
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
    const url = new URL(window.location.href); url.searchParams.set('team', team); url.searchParams.set('page', String(state.page));
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
const speakSlideBtn = byId('speak-slide-btn');
if (speakSlideBtn) {
  on(speakSlideBtn, 'click', () => {
    const UtteranceCtor = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
    if (window.speechSynthesis && UtteranceCtor) {
      if (window.speechSynthesis.speaking) {
        try { window.speechSynthesis.cancel(); } catch {}
        speakSlideBtn.textContent = '🔊 聽講稿示範朗讀';
        return;
      }
      const utterance = new UtteranceCtor(byId('speaker-text').textContent);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.96;
      speakSlideBtn.textContent = '⏹ 停止朗讀';
      const resetLabel = () => { speakSlideBtn.textContent = '🔊 聽講稿示範朗讀'; };
      utterance.onend = resetLabel;
      utterance.onerror = resetLabel;
      utterance.addEventListener?.('end', resetLabel);
      utterance.addEventListener?.('error', resetLabel);
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      } catch {
        resetLabel();
      }
    }
  });
}
const copyScriptBtn = byId('copy-script-btn');
let copyResetTimer = null;
if (copyScriptBtn) {
  on(copyScriptBtn, 'click', async () => {
    const text = byId('speaker-text')?.textContent || '';
    const clipboard = window.navigator?.clipboard ?? (typeof navigator !== 'undefined' ? navigator.clipboard : null);
    if (!clipboard || typeof clipboard.writeText !== 'function') return;
    try {
      await clipboard.writeText(text);
      copyScriptBtn.textContent = '✓ 已複製講稿';
      if (copyResetTimer) clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        copyScriptBtn.textContent = '📋 複製本頁講稿';
      }, 1800);
    } catch {
      // Do not falsely report copied if clipboard write fails.
    }
  });
}
const fullscreenBtn = byId('fullscreen-slide');
if (fullscreenBtn) {
  on(fullscreenBtn, 'click', () => {
    const target = document.querySelector?.('.slide-figure') || byId('slide-main');
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
const timerDisplay = byId('timer-display');
const timerToggleBtn = byId('timer-toggle-btn');
const timerResetBtn = byId('timer-reset-btn');
const timerBar = byId('rehearsal-timer-bar');

function currentElapsedMs() {
  if (timerStartedAt === null) return accumulatedMs;
  const wallMs = Math.max(0, Date.now() - timerStartedAt);
  const effectiveRunMs = Math.max(wallMs, tickFallbackCount * 1000);
  return accumulatedMs + effectiveRunMs;
}

function formatClock(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s} / 03:00`;
}

function updateTimerDisplay() {
  const sec = Math.floor(currentElapsedMs() / 1000);
  if (timerDisplay) timerDisplay.textContent = formatClock(sec);
  if (timerBar) timerBar.classList.toggle('is-overtime', sec > 180);
}

if (timerToggleBtn) {
  on(timerToggleBtn, 'click', () => {
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
    updateTimerDisplay();
    if (timerToggleBtn) timerToggleBtn.textContent = '▶ 開始計時';
    if (timerBar) timerBar.classList.remove('is-running', 'is-overtime');
  });
}

on(window, 'popstate', () => {state=resolveStory(window.location.search); showPage(state.page, false);});
on(window, 'keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented || event.target?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' && state.page < TEAM_STORIES[state.team].slides.length) {event.preventDefault(); showPage(state.page+1);}
  if (event.key === 'ArrowLeft' && state.page > 1) {event.preventDefault(); showPage(state.page-1);}
  if (event.key === 'Home' && state.page > 1) {event.preventDefault(); showPage(1);}
  if (event.key === 'End' && state.page < TEAM_STORIES[state.team].slides.length) {event.preventDefault(); showPage(TEAM_STORIES[state.team].slides.length);}
});
showPage(state.page, false);
function dispose() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
  timerStartedAt = null;
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
