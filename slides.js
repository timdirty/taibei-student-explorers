import {TEAM_STORIES, FOOD_APP, SOUND_APP, resolveStory} from './story-data.js';

export function installSlidePlayer(document, window) {
const byId = id => document.getElementById(id);
let state = resolveStory(window.location.search);

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
  byId('slide-image').src = `slide-pages/${team}/${String(state.page).padStart(2,'0')}.png`;
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
  const pillsContainer = byId('slide-pills');
  if (pillsContainer) {
    pillsContainer.replaceChildren(...story.slides.map((item, index) => {
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
  }
  const ImageCtor = window?.Image || (typeof Image !== 'undefined' ? Image : null);
  if (ImageCtor) {
    for (const adj of [state.page - 1, state.page + 1]) {
      if (adj >= 1 && adj <= story.slides.length) {
        const preload = new ImageCtor();
        preload.src = `slide-pages/${team}/${String(adj).padStart(2, '0')}.png`;
      }
    }
  }
  if (remember) {
    const url = new URL(window.location.href); url.searchParams.set('team', team); url.searchParams.set('page', String(state.page));
    try {window.history.replaceState(window.history.state, '', url);} catch { /* The controls still work when the browser cannot remember the page. */ }
  }
}

const slideImg = byId('slide-image');
slideImg.addEventListener('error', () => {byId('image-error').hidden = false;});
let touchStartX = null;
let touchStartY = null;
slideImg.addEventListener('touchstart', event => {
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, {passive: true});
slideImg.addEventListener('touchend', event => {
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
byId('slide-picker').addEventListener('change', event => showPage(Number(event.target.value)));
byId('previous-slide').addEventListener('click', () => showPage(state.page-1));
byId('next-slide').addEventListener('click', () => showPage(state.page+1));
const speakSlideBtn = byId('speak-slide-btn');
if (speakSlideBtn) {
  speakSlideBtn.addEventListener('click', () => {
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
  copyScriptBtn.addEventListener('click', () => {
    const text = byId('speaker-text')?.textContent || '';
    const clipboard = window.navigator?.clipboard ?? (typeof navigator !== 'undefined' ? navigator.clipboard : null);
    try { clipboard?.writeText?.(text)?.catch?.(() => {}); } catch {}
    copyScriptBtn.textContent = '✓ 已複製講稿';
    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyScriptBtn.textContent = '📋 複製本頁講稿';
    }, 1800);
  });
}
const fullscreenBtn = byId('fullscreen-slide');
if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', () => {
    const target = document.querySelector?.('.slide-figure') || byId('slide-main');
    if (!target) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.()?.catch?.(() => {});
    } else {
      target.requestFullscreen?.()?.catch?.(() => {});
    }
  });
}
window.addEventListener('popstate', () => {state=resolveStory(window.location.search); showPage(state.page, false);});
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented || event.target?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' && state.page < TEAM_STORIES[state.team].slides.length) {event.preventDefault(); showPage(state.page+1);}
  if (event.key === 'ArrowLeft' && state.page > 1) {event.preventDefault(); showPage(state.page-1);}
  if (event.key === 'Home' && state.page > 1) {event.preventDefault(); showPage(1);}
  if (event.key === 'End' && state.page < TEAM_STORIES[state.team].slides.length) {event.preventDefault(); showPage(TEAM_STORIES[state.team].slides.length);}
});
showPage(state.page, false);
return {showPage};
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') installSlidePlayer(document, window);
