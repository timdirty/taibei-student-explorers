import { PROFILES, FOOD_GROUPS, QUESTIONS, SATIETY, ADJUSTMENTS, EMPTY_FILTERS, SOURCE_LABEL, filterScenarios, chartCounts, answerText, scenariosCSV } from './feedback-stories-data.js';

const PAGE_SIZE = 12;
const node = (doc, tag, className, text) => {
  const element = doc.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

export function installFeedbackExplorer(doc, win) {
  if (!doc.getElementById('case-list')) return;
  const byId = id => doc.getElementById(id);
  const storySource = byId('story-source');
  if (storySource) {
    storySource.dataset.sourceLabel = SOURCE_LABEL;
    if (!storySource.textContent.trim()) storySource.textContent = SOURCE_LABEL;
  }
  const filters = { ...EMPTY_FILTERS };
  const params = new URLSearchParams(win.location.search);
  for (const [key, allowed] of Object.entries({ profile: PROFILES.map(p => p.id), food: FOOD_GROUPS.map(g => g.id), leftovers: ['yes', 'no'], satiety: SATIETY, adjustment: ADJUSTMENTS })) {
    if (allowed.includes(params.get(key))) filters[key] = params.get(key);
  }
  let page = 0, selectedId = params.get('story'), selectedMethod = '', currentStories = [];
  const listeners = [];
  const on = (target, type, callback) => { target.addEventListener(type, callback); listeners.push(() => target.removeEventListener(type, callback)); };

  for (const [id, options] of [['profile-filter', PROFILES], ['food-filter', FOOD_GROUPS]]) {
    for (const option of options) {
      const element = node(doc, 'option', '', option.label);
      element.value = option.id;
      byId(id).append(element);
    }
  }

  function foodArt(dishes) {
    const fragment = doc.createDocumentFragment();
    for (const dish of dishes) {
      const art = node(doc, 'span', `food-art art-${dish.art}`);
      art.setAttribute('aria-hidden', 'true');
      fragment.append(art);
    }
    return fragment;
  }

  function updateURL() {
    const next = new URL(win.location.href);
    next.search = '';
    for (const [key, value] of Object.entries(filters)) if (value) next.searchParams.set(key, value);
    if (selectedId) next.searchParams.set('story', selectedId);
    win.history.replaceState(null, '', next.href);
  }

  function renderMethod(story) {
    const method = story.methods.find(item => item.id === selectedMethod) ?? story.methods[0];
    selectedMethod = method.id;
    byId('method-description').textContent = method.description;
    byId('method-link').href = method.href;
    byId('method-link').textContent = method.route === '/game' ? '去玩份量，試這個方法' : '去選一道菜，問問 AI';
  }

  function renderDetail(story, focus = false) {
    byId('story-detail').hidden = !story;
    if (!story) return;
    byId('detail-art').replaceChildren(foodArt(story.dishes));
    byId('detail-number').textContent = `故事 ${story.id.slice(-3)} · 情境餐盤`;
    byId('detail-title').textContent = story.title;
    byId('detail-summary').textContent = story.summary;
    const highlights = doc.createDocumentFragment();
    for (const [key, label] of [['satiety', '吃完的感覺'], ['edibleLeftovers', '可吃剩食']]) {
      const group = node(doc, 'div');
      group.append(node(doc, 'dt', '', label), node(doc, 'dd', '', answerText(story, key)));
      highlights.append(group);
    }
    byId('detail-highlights').replaceChildren(highlights);
    const answers = doc.createDocumentFragment();
    QUESTIONS.forEach(([key, label], index) => {
      const group = node(doc, 'div');
      group.dataset.answer = key;
      group.append(node(doc, 'dt', '', `${index + 1}. ${label}`), node(doc, 'dd', '', answerText(story, key)));
      answers.append(group);
    });
    byId('detail-answers').replaceChildren(answers);
    const choices = doc.createDocumentFragment();
    if (!story.methods.some(method => method.id === selectedMethod)) selectedMethod = story.methods[0].id;
    for (const method of story.methods) {
      const label = node(doc, 'label', 'method-choice');
      const radio = node(doc, 'input');
      radio.type = 'radio'; radio.name = 'next-method'; radio.value = method.id; radio.checked = selectedMethod === method.id;
      label.append(radio, node(doc, 'span', '', method.label));
      choices.append(label);
    }
    byId('method-options').replaceChildren(choices);
    renderMethod(story);
    if (focus) byId('detail-title').focus();
  }

  function renderChart(id, field, categories, filterKey, noteId) {
    const bars = doc.createDocumentFragment();
    for (const { label, count, total } of chartCounts(currentStories, field, categories)) {
      const bar = node(doc, 'button', 'chart-bar');
      bar.type = 'button'; bar.dataset.chartFilter = filterKey; bar.dataset.value = label;
      bar.setAttribute('aria-pressed', String(filters[filterKey] === label));
      const percent = total ? Math.round(count / total * 100) : 0;
      bar.setAttribute('aria-label', `${label}：${count} 則，共 ${total} 則${total ? `，約 ${percent}%` : ''}。點選篩選，再點取消`);
      const track = node(doc, 'span', 'bar-track'); track.setAttribute('aria-hidden', 'true');
      const fill = node(doc, 'span', 'bar-fill'); fill.style.transform = `scaleX(${total ? count / total : 0})`;
      track.append(fill);
      bar.append(node(doc, 'span', 'bar-label', label), track, node(doc, 'span', 'bar-value', total ? `${count} 則 · ${percent}%` : '0 則'));
      bars.append(bar);
    }
    byId(id).replaceChildren(bars);
    byId(noteId).textContent = currentStories.length ? `目前 ${currentStories.length} 則故事；點一條看看。` : '目前沒有符合的故事；換個篩選再看看。';
    byId(id).dataset.total = String(currentStories.length);
  }

  function renderCards() {
    const cards = doc.createDocumentFragment();
    for (const story of currentStories.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)) {
      const li = node(doc, 'li'), button = node(doc, 'button', 'story-card');
      button.type = 'button'; button.dataset.story = story.id;
      button.setAttribute('aria-pressed', String(selectedId === story.id));
      button.setAttribute('aria-label', `故事 ${story.id.slice(-3)}，${story.meal}，${story.profileLabel}。看看回答與下一餐方法`);
      const art = node(doc, 'span', 'card-art'); art.setAttribute('aria-hidden', 'true'); art.append(foodArt(story.dishes));
      const copy = node(doc, 'span', 'card-copy');
      copy.append(node(doc, 'span', 'card-meal', story.meal), node(doc, 'strong', '', story.profileLabel), node(doc, 'span', 'card-context', story.context), node(doc, 'span', 'card-open', '看看回答與方法'));
      button.append(art, copy); li.append(button); cards.append(li);
    }
    byId('case-list').replaceChildren(cards);
    const totalPages = Math.ceil(currentStories.length / PAGE_SIZE);
    byId('page-count').textContent = totalPages ? `${page + 1} / ${totalPages} 頁` : '沒有符合的故事';
    byId('previous-stories').disabled = page === 0;
    byId('next-stories').disabled = page + 1 >= totalPages;
  }

  function render() {
    currentStories = filterScenarios(filters);
    page = Math.min(page, Math.max(0, Math.ceil(currentStories.length / PAGE_SIZE) - 1));
    if (!currentStories.some(story => story.id === selectedId)) { selectedId = currentStories[0]?.id ?? ''; selectedMethod = ''; }
    byId('profile-filter').value = filters.profile; byId('food-filter').value = filters.food; byId('leftovers-filter').value = filters.leftovers;
    byId('filter-status').textContent = `找到 ${currentStories.length} 則情境故事，共 120 則。`;
    byId('empty-stories').hidden = currentStories.length > 0;
    byId('export-stories').disabled = currentStories.length === 0;
    const chartLabels = [filters.satiety && `吃完：${filters.satiety}`, filters.adjustment && `想先改：${filters.adjustment}`].filter(Boolean);
    byId('chart-selection').hidden = !chartLabels.length;
    byId('chart-selection-text').textContent = chartLabels.join('；');
    renderChart('satiety-chart', 'satiety', SATIETY, 'satiety', 'satiety-note');
    renderChart('adjustment-chart', 'desiredAdjustment', ADJUSTMENTS, 'adjustment', 'adjustment-note');
    renderCards(); renderDetail(currentStories.find(story => story.id === selectedId)); updateURL();
  }

  function selectStory(id, focus = true) {
    const story = currentStories.find(item => item.id === id);
    if (!story) return;
    selectedId = id; selectedMethod = ''; renderCards(); renderDetail(story, focus); updateURL();
  }

  const reset = () => { Object.assign(filters, EMPTY_FILTERS); page = 0; selectedId = ''; byId('export-status').textContent = ''; render(); };
  for (const [id, key] of [['profile-filter', 'profile'], ['food-filter', 'food'], ['leftovers-filter', 'leftovers']]) on(byId(id), 'change', event => { filters[key] = event.target.value; page = 0; render(); });
  on(byId('reset-filters'), 'click', reset); on(byId('empty-reset'), 'click', reset);
  on(byId('clear-chart-filters'), 'click', () => { filters.satiety = ''; filters.adjustment = ''; page = 0; render(); byId('profile-filter').focus(); });
  for (const id of ['satiety-chart', 'adjustment-chart']) on(byId(id), 'click', event => {
    const button = event.target.closest('[data-chart-filter]');
    if (!button) return;
    const key = button.dataset.chartFilter, value = button.dataset.value;
    filters[key] = filters[key] === value ? '' : value; page = 0; render();
    byId(id).querySelector(`[data-value="${value}"]`)?.focus();
  });
  on(byId('case-list'), 'click', event => { const button = event.target.closest('[data-story]'); if (button) selectStory(button.dataset.story); });
  on(byId('case-list'), 'keydown', event => {
    const button = event.target.closest('[data-story]'); if (!button || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectStory(button.dataset.story); return; }
    const buttons = [...byId('case-list').querySelectorAll('[data-story]')], index = buttons.indexOf(button);
    const next = event.key === 'ArrowRight' ? index + 1 : event.key === 'ArrowLeft' ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : null;
    if (next !== null) { event.preventDefault(); buttons[Math.max(0, Math.min(next, buttons.length - 1))]?.focus(); }
  });
  on(byId('method-options'), 'change', event => { if (event.target.name !== 'next-method') return; selectedMethod = event.target.value; renderMethod(currentStories.find(story => story.id === selectedId)); });
  on(byId('back-to-stories'), 'click', () => { (byId('case-list').querySelector(`[data-story="${selectedId}"]`) ?? byId('case-list').querySelector('button'))?.focus(); });
  for (const [id, change] of [['previous-stories', -1], ['next-stories', 1]]) on(byId(id), 'click', () => {
    const next = page + change; if (next < 0 || next * PAGE_SIZE >= currentStories.length) return;
    page = next; renderCards(); byId('case-list').querySelector('button')?.focus();
  });
  on(byId('export-stories'), 'click', () => {
    if (!currentStories.length) return;
    let objectURL;
    try {
      const blob = new win.Blob([scenariosCSV(currentStories)], { type: 'text/csv;charset=utf-8' });
      objectURL = win.URL.createObjectURL(blob);
      const download = node(doc, 'a'); download.href = objectURL; download.download = `午餐回饋故事_設計情境_${currentStories.length}則.csv`;
      doc.body.append(download); download.click(); download.remove();
      byId('export-status').textContent = `已準備 ${currentStories.length} 則設計情境 CSV。`;
      win.setTimeout(() => win.URL.revokeObjectURL(objectURL), 1000);
    } catch {
      if (objectURL) win.URL.revokeObjectURL(objectURL);
      byId('export-status').textContent = '這個瀏覽器暫時無法下載。可以用另一個瀏覽器重開，再試一次。';
    }
  });
  render();
  const initialIndex = currentStories.findIndex(story => story.id === selectedId);
  if (initialIndex >= PAGE_SIZE) { page = Math.floor(initialIndex / PAGE_SIZE); renderCards(); }
  return { getState: () => ({ filters: { ...filters }, page, selectedId, selectedMethod, count: currentStories.length }), dispose: () => listeners.forEach(remove => remove()) };
}

if (typeof document !== 'undefined') installFeedbackExplorer(document, window);
