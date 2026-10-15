import { FOOD_APP, LUNCH_SURVEY, LUNCH_RESULTS } from './story-data.js';

export { FOOD_APP, LUNCH_SURVEY, LUNCH_RESULTS };
export const SCENARIO_KIND = 'authored_scenario';
export const SOURCE_LABEL = '120則設計情境，自己的午餐另外記。';

export const QUESTIONS = [
  ['portions', '份量適合嗎？'],
  ['taste', '味道喜歡嗎？'],
  ['ease', '吃起來方便嗎？'],
  ['temperature', '溫度適合嗎？'],
  ['time', '用餐時間夠嗎？'],
  ['satiety', '吃完有多飽？'],
  ['edibleLeftovers', '有留下還能吃的食物嗎？'],
  ['leftoverFoods', '留下哪些食物？'],
  ['leftoverReason', '為什麼留下來？'],
  ['satisfaction', '這餐喜歡多少？'],
  ['desiredAdjustment', '下一餐想先改什麼？'],
  ['nextMethod', '下一餐想試什麼方法？'],
];

export const SATIETY = ['還餓', '剛剛好', '有點飽', '太飽'];
export const ADJUSTMENTS = ['份量', '味道', '軟硬', '溫度', '時間', '先照這樣'];
export const FOOD_GROUPS = [
  { id: 'grains', label: '飯與麵' },
  { id: 'protein', label: '豆魚蛋肉' },
  { id: 'vegetables', label: '蔬菜' },
];

const METHODS = {
  portions: { id: 'portions', label: '先想份量，還餓再添', description: '在遊戲裡選第一份，想好還餓時怎麼添。', route: '/game' },
  dish: { id: 'dish', label: '挑一道菜，問問 AI', description: '到菜單選一道菜，問它的食材或吃法。', route: '/coach' },
  small: { id: 'small', label: '先試一小口，再想搭配', description: '到菜單選想試的菜，問問怎麼搭配。', route: '/coach' },
  easy: { id: 'easy', label: '先問怎麼吃，再請老師幫忙', description: '問一道菜的吃法；太硬、太燙或有骨頭，請老師幫忙。', route: '/coach' },
  time: { id: 'time', label: '先想好第一份，留時間慢慢吃', description: '用份量遊戲想第一份，再和老師說說排隊、取餐花的時間。', route: '/game' },
};

export const PROFILES = [
  { id: 'enough', label: '吃得剛剛好', opening: '這份吃得舒服，我想記住自己的份量。', portions: ['剛剛好', '剛剛好', '稍微少一點'], taste: ['喜歡', '很喜歡', '還可以'], ease: ['容易吃', '容易吃', '有一點要慢慢咬'], time: ['夠', '夠', '剛好用完'], satiety: ['剛剛好', '剛剛好', '有點飽'], leftover: false, satisfaction: ['很喜歡', '喜歡', '喜歡'], adjustments: ['先照這樣', '先照這樣', '份量', '味道'], methods: ['portions', 'dish'], contexts: ['先盛了自己想吃的第一份', '先試了一口配菜', '飯和菜交替慢慢吃', '吃完才決定要不要再添'] },
  { id: 'portion', label: '先盛得太多', opening: '餐盤先裝得有點滿，吃飽後還有一些。', portions: ['有點多', '太多', '有點多'], taste: ['喜歡', '還可以', '喜歡'], ease: ['容易吃', '容易吃', '有一點要慢慢咬'], time: ['夠', '剛好用完', '夠'], satiety: ['太飽', '有點飽', '剛剛好'], leftover: true, satisfaction: ['喜歡', '還可以', '喜歡'], adjustments: ['份量', '份量', '份量', '時間'], methods: ['portions', 'dish'], contexts: ['第一份盛得比平常多', '配菜也多盛了一勺', '看起來很想吃，就先裝滿', '還沒想好份量就開始盛'] },
  { id: 'taste', label: '味道還不習慣', opening: '這道菜的味道不太熟悉，我想先問問它。', portions: ['剛剛好', '有點多', '剛剛好'], taste: ['還不習慣', '覺得偏鹹', '覺得偏淡'], ease: ['容易吃', '容易吃', '有一點要慢慢咬'], time: ['夠', '剛好用完', '夠'], satiety: ['剛剛好', '還餓', '有點飽'], leftover: true, satisfaction: ['還可以', '不太喜歡', '還可以'], adjustments: ['味道', '味道', '味道', '溫度'], methods: ['small', 'portions'], contexts: ['第一次吃這種做法', '試了幾口，想知道用了什麼調味', '先吃了自己熟悉的菜', '想找一道熟悉的菜一起搭配'] },
  { id: 'ease', label: '咬起來有點難', opening: '有一道菜要慢慢咬，我想知道怎麼吃方便。', portions: ['剛剛好', '有點多', '剛剛好'], taste: ['喜歡', '還可以', '喜歡'], ease: ['有點硬', '有骨頭要小心', '太大塊不方便'], time: ['剛好用完', '不太夠', '夠'], satiety: ['剛剛好', '還餓', '有點飽'], leftover: true, satisfaction: ['還可以', '喜歡', '還可以'], adjustments: ['軟硬', '軟硬', '時間', '軟硬'], methods: ['easy', 'portions'], contexts: ['這一塊比平常大', '想找老師幫忙分小塊', '花了一些時間處理這道菜', '慢慢咬，還有幾塊沒吃完'] },
  { id: 'time', label: '時間有點趕', opening: '快到收餐時間了，我還想好好吃完這份。', portions: ['剛剛好', '有點多', '剛剛好'], taste: ['喜歡', '還可以', '喜歡'], ease: ['容易吃', '有一點要慢慢咬', '容易吃'], time: ['不太夠', '不夠', '不太夠'], satiety: ['還餓', '剛剛好', '有點飽'], leftover: true, satisfaction: ['還可以', '喜歡', '還可以'], adjustments: ['時間', '時間', '時間', '溫度'], methods: ['time', 'dish'], contexts: ['排隊取餐花了一點時間', '一開始花時間處理主菜', '飯菜先放了一會兒才開始吃', '收餐前還在慢慢咬'] },
  { id: 'hunger', label: '吃完還想添', opening: '這份吃完了，我還餓，想再添一些。', portions: ['有點少', '太少', '有點少'], taste: ['喜歡', '很喜歡', '還可以'], ease: ['容易吃', '容易吃', '有一點要慢慢咬'], time: ['夠', '剛好用完', '夠'], satiety: ['還餓', '還餓', '還餓'], leftover: false, satisfaction: ['喜歡', '很喜歡', '還可以'], adjustments: ['份量', '份量', '份量', '時間'], methods: ['portions', 'dish'], contexts: ['第一份先盛得比較少', '早上活動比較多', '吃完第一份，還想添一點', '先把每道菜都試了一些'] },
];

// Authored plates are examples; they do not represent the school's announced menu.
const MEALS = [
  { title: '白飯與青菜', foodGroup: 'vegetables', focus: '青菜', dishes: [{ label: '白飯', art: 'rice' }, { label: '青菜', art: 'greens' }] },
  { title: '麵與豆腐', foodGroup: 'protein', focus: '豆腐', dishes: [{ label: '麵', art: 'noodles' }, { label: '豆腐', art: 'beans' }] },
  { title: '飯與魚', foodGroup: 'protein', focus: '魚', dishes: [{ label: '白飯', art: 'rice' }, { label: '魚', art: 'fish' }] },
  { title: '飯與雞肉', foodGroup: 'protein', focus: '雞肉', dishes: [{ label: '白飯', art: 'rice' }, { label: '雞肉', art: 'protein' }] },
  { title: '麵與蛋', foodGroup: 'grains', focus: '麵', dishes: [{ label: '麵', art: 'noodles' }, { label: '蛋', art: 'egg' }] },
];

const pick = (items, variation) => items[variation % items.length];
export const SCENARIOS = PROFILES.flatMap((profile, profileIndex) =>
  MEALS.flatMap((meal, mealIndex) => profile.contexts.map((context, contextIndex) => {
    const variation = mealIndex * 4 + contextIndex;
    const adjustment = pick(profile.adjustments, variation);
    const nextMethods = profile.methods.map(id => ({ ...METHODS[id], href: FOOD_APP + METHODS[id].route }));
    const hasLeftovers = profile.leftover;
    const reasons = {
      portion: '已經吃飽，第一份盛得太多',
      taste: `還不習慣${meal.focus}的味道`,
      ease: `處理${meal.focus}花了一些時間`,
      time: '取餐和吃飯的時間不太夠',
    };
    return {
      kind: SCENARIO_KIND,
      id: `story-${String(profileIndex * 20 + variation + 1).padStart(3, '0')}`,
      profileId: profile.id,
      profileLabel: profile.label,
      foodGroup: meal.foodGroup,
      meal: meal.title,
      context,
      title: `${meal.title}：${profile.label}`,
      summary: `${context}。${profile.opening}`,
      dishes: meal.dishes,
      hasLeftovers,
      methods: nextMethods,
      answers: {
        portions: pick(profile.portions, variation),
        taste: pick(profile.taste, variation),
        ease: profile.id === 'ease' && meal.focus === '麵' ? '不容易夾起來' : profile.id === 'ease' && meal.focus !== '魚' && variation % 3 === 1 ? '有點硬' : pick(profile.ease, variation),
        temperature: adjustment === '溫度' ? '有點涼了' : pick(['剛剛好', '剛剛好', '有點燙，先等一等', '剛剛好'], variation),
        time: pick(profile.time, variation),
        satiety: pick(profile.satiety, variation),
        edibleLeftovers: hasLeftovers ? pick(['一點點', '約四分之一', '約一半'], variation) : '沒有',
        leftoverFoods: hasLeftovers ? (profile.id === 'portion' && variation % 2 === 0 ? meal.dishes.map(dish => dish.label) : [meal.focus]) : null,
        leftoverReason: hasLeftovers ? reasons[profile.id] : null,
        satisfaction: pick(profile.satisfaction, variation),
        desiredAdjustment: adjustment,
        nextMethod: nextMethods[variation % nextMethods.length].label,
      },
    };
  }))
);

export const EMPTY_FILTERS = Object.freeze({ profile: '', food: '', leftovers: '', satiety: '', adjustment: '' });

export function filterScenarios(filters = EMPTY_FILTERS) {
  return SCENARIOS.filter(story =>
    (!filters.profile || story.profileId === filters.profile) &&
    (!filters.food || story.foodGroup === filters.food) &&
    (!filters.leftovers || story.hasLeftovers === (filters.leftovers === 'yes')) &&
    (!filters.satiety || story.answers.satiety === filters.satiety) &&
    (!filters.adjustment || story.answers.desiredAdjustment === filters.adjustment)
  );
}

export function chartCounts(stories, field, categories) {
  return categories.map(label => ({ label, count: stories.filter(story => story.answers[field] === label).length, total: stories.length }));
}

export function answerText(story, key) {
  const answer = story.answers[key];
  return answer === null ? '不適用（沒有可吃剩食）' : Array.isArray(answer) ? answer.join('、') : answer;
}

const csvCell = value => `"${String(value).replaceAll('"', '""')}"`;
export function scenariosCSV(stories) {
  const columns = ['kind', 'story_id', '感受', '情境餐盤', '情境', ...QUESTIONS.map(([, label]) => label)];
  const rows = stories.map(story => [story.kind, story.id, story.profileLabel, story.meal, story.context, ...QUESTIONS.map(([key]) => answerText(story, key))]);
  return '\uFEFF' + [columns, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
}
