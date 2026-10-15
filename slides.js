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
  byId('ppt-link').href = story.pptx;
  byId('guide-link').href = `student-guide.html#${team}`;
  if (remember) {
    const url = new URL(window.location.href); url.searchParams.set('team', team); url.searchParams.set('page', String(state.page));
    try {window.history.replaceState(window.history.state, '', url);} catch { /* The controls still work when the browser cannot remember the page. */ }
  }
}

byId('slide-image').addEventListener('error', () => {byId('image-error').hidden = false;});
byId('slide-picker').addEventListener('change', event => showPage(Number(event.target.value)));
byId('previous-slide').addEventListener('click', () => showPage(state.page-1));
byId('next-slide').addEventListener('click', () => showPage(state.page+1));
window.addEventListener('popstate', () => {state=resolveStory(window.location.search); showPage(state.page, false);});
window.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented || event.target?.closest?.('input,textarea,select,[contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' && state.page < TEAM_STORIES[state.team].slides.length) {event.preventDefault(); showPage(state.page+1);}
  if (event.key === 'ArrowLeft' && state.page > 1) {event.preventDefault(); showPage(state.page-1);}
});
showPage(state.page, false);
return {showPage};
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') installSlidePlayer(document, window);
