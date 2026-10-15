export const FOOD_APP = 'https://foodlens-school.vercel.app';
export const SOUND_APP = 'https://soundscape-ai-city-sound-detective.vercel.app';
export const LUNCH_SURVEY = 'https://taibei-student-explorers.ctctim14.chatgpt.site/foodlens-survey';
export const LUNCH_RESULTS = 'https://taibei-student-explorers.ctctim14.chatgpt.site/survey-admin';

export const TEAM_STORIES = {
  food: {
    name: '食光偵探', team: '食光追查隊', journey: 'food.html',
    pdf: 'slides/食光偵探_11頁學生簡報.pdf', pptx: 'slides/食光偵探_11頁學生簡報.pptx',
    slides: [
      {title:'讓午餐剛剛好', say:'大家好，我們是食光追查隊。我們想讓午餐剛剛好，吃得夠，也少一點浪費。食光偵探陪我們找一個下一餐能試的方法。', action:'開始我的午餐任務', href:'food.html'},
      {title:'午餐的兩種困擾', say:'有時吃不完，有時還沒吃夠。我們先問自己的感受，再想辦法。照片看得到食物，卻不知道我為什麼留下它。', action:'看看餐盤照片', href:FOOD_APP+'/discover'},
      {title:'午餐，我想問', say:'份量適合我嗎？時間夠嗎？還餓能不能再添？我們畫下問題，每次先挑一個。', action:'打開午餐心智圖', href:'brainstorm/food-mindmap.png'},
      {title:'學校的 9、10 月菜單', say:'這是學校給我們的九月和十月菜單。我看到十月十六日有香酥魚排和鐵板豬柳，先想要盛多少，再問 AI。吃飯前，也看看今天有沒有換菜。', action:'看學校 9 月公告菜單', href:FOOD_APP+'/menu-sources/taibei-lunch-115-09.pdf', extraActions:[{label:'看學校 10 月公告菜單', href:FOOD_APP+'/menu-sources/taibei-lunch-115-10.pdf'}]},
      {title:'這道菜，我想問 AI', say:'我點一道菜，問 AI 可以怎麼吃。看畫面中的菜圖，挑一個想試的方法，也能追問。把回答保存，再帶去拍自己的餐盤。', action:'選一道菜，問 AI', href:FOOD_APP+'/coach'},
      {title:'份量小遊戲', say:'我先選想盛多少，再想好還餓怎麼辦。玩完的小計畫可以帶去拍餐盤。每個人的食量不同，我們希望大家吃得夠。', action:'玩配餐，想想份量', href:FOOD_APP+'/game'},
      {title:'下一餐，我來試', say:'我想試先盛少一點，還餓再添。下一餐拍新照片，說自己有沒有吃飽，再把兩餐放一起看。這是接下來能試的方法。', action:'從我的餐盤接下一餐', href:FOOD_APP+'/scan?view=history'},
      {title:'兩餐湊齊，才算一次實驗', say:'我們的實測清單有四步：午餐前用 AI 配一份小計畫；同一餐拍餐前和餐後；帶著一個方法拍下一餐；同一個代號，兩天都拍齊前後照。四步都做到，App 會跳出「兩餐實驗湊齊了」，我們按「上台」，就能把兩餐放在一起請大家猜。', action:'看我們的實測清單', href:FOOD_APP+'/presentation?view=results'},
      {title:'猜猜看！哪一盤帶著新方法？', say:'請評審猜猜看！這兩盤照片，哪一盤是帶著新方法吃的？大家先投票，我們再一章一章揭曉：第一餐、我的方法、第二餐。猜錯也沒關係，猜錯正好讓我們想想，盛的量和菜色是不是也不一樣。', action:'開惜食實驗，請評審猜', href:FOOD_APP+'/presentation?view=case'},
      {title:'一張餐盤，也能想到全班', say:'AI 看照片估的是大約克數，真的重量要用秤量。選人數可以看看全班、全校的假設試算。情境故事幫我想方法，自己的餐盤另外記。', action:'看看份量和大家的感受', href:'food.html#clues'},
      {title:'換你來做實驗', say:'換你來做實驗！掃這個 QR code，選一道今天的菜問問 AI。餐後拍一下、記感受，下一餐帶著方法再拍一次，你也能湊齊一次兩餐實驗。分享頁有兩隊簡報、操作圖和問卷。', action:'點一道菜，問問 AI', href:FOOD_APP+'/coach', extraActions:[{label:'填午餐回饋（免登入）', href:LUNCH_SURVEY}]}
    ],
  },
  sound: {
    name: '聲景智探', team: '泰北聽路隊', journey: 'sound.html',
    pdf: 'slides/聲景智探_11頁學生簡報.pdf', pptx: 'slides/聲景智探_11頁學生簡報.pptx',
    slides: [
      {title:'跟著耳朵，發現城市', say:'大家好，我們是泰北聽路隊。我們想做一張聽得到的地圖。先用耳朵聽，再請 AI 一起找聲音，留下自己的發現。', action:'開始我的聽路任務', href:'sound.html'},
      {title:'同一條路，會聽到什麼？', say:'同一條路可能有鳥叫、車聲和人聲。換個地方或時間，會不會不同？我們想留下聲音，下次再來一起聽。', action:'先聽一段，找聲音', href:SOUND_APP+'/#sound-practice'},
      {title:'破案前，先列疑問', say:'聲音從哪裡來？早上和下午一樣嗎？我們先挑一個小問題，再到安全的地方聽。', action:'打開聲音心智圖', href:'brainstorm/sound-mindmap.png'},
      {title:'我想去這裡聽', say:'五十個政府地點幫我找起點，每個地點有八則編寫的情境故事，共四百則。我翻故事找問題，自己的照片和聲音再另外保存。', action:'選地點，翻一個故事', href:SOUND_APP+'/explore'},
      {title:'盲聽小遊戲', say:'先聽一題，猜猜聲音從哪裡來。選自己的答案後，再看 AI 的線索。九段公開原音讓我練習，自己的現場聲音要另外去錄。', action:'玩一題盲聽', href:SOUND_APP+'/#sound-practice'},
      {title:'AI 和我一起聽', say:'我先聽原音、猜聲音，再叫 AI 一起聽。畫面用圖和名稱提示它聽到什麼。AI 也會猜錯，我再重聽、說自己的理由。這段是公開原音，來源留在畫面上。', action:'和 AI 聽一段原音', href:SOUND_APP+'/#sound-practice'},
      {title:'同一個地方，我再聽', say:'我想知道同一個地方早上和下午有沒有不同。從自己的地圖開問題卡，再回來錄另一段。把兩段一起聽，也看看時間、天氣和站的位置。', action:'從我的地圖開始回訪', href:SOUND_APP+'/explore?view=mine'},
      {title:'破案三步：現場、回訪、接起來', say:'我們不是到處亂錄音。實測清單有三步：在校內 2 到 3 個地點各錄 15 秒；回到同一個地點再錄一次；最後用問題卡把兩次錄音接起來。存好以後，卡片會跳出「這張問題卡可以上台了」，按一下就進破案故事。', action:'看我們的實測清單', href:SOUND_APP+'/competition?view=results'},
      {title:'盲聽法庭：請評審當法官', say:'請評審當法官！先聽聲音甲和聲音乙，我們不說哪一段是第一次、哪一段是回訪。覺得哪一段比較舒服，就投一票。投完我們再一章一章揭曉，也說說我們聽到的改變和理由。', action:'開破案故事，當法官', href:SOUND_APP+'/competition?view=case'},
      {title:'地圖上的資料，怎麼幫到我？', say:'政府地點幫我找起點，情境故事幫我想問題，自己的照片和原音幫我記住現場。分享前，要避開別人的私人對話和住家位置。', action:'回看資料和我的聲音', href:'sound.html#clues'},
      {title:'換你來破案', say:'換你來破案！掃這個 QR code，先玩一題盲聽，再選一個學校附近的地點。安全地錄一段，下次回到同一個地方再錄一次，用問題卡接起來，你也有自己的破案故事。分享頁有操作圖和兩隊簡報。', action:'先聽一題，猜猜看', href:SOUND_APP+'/#sound-practice'}
    ],
  },
};

export function resolveStory(search) {
  const params = new URLSearchParams(search);
  const team = params.get('team') === 'sound' ? 'sound' : 'food';
  const raw = params.get('page');
  const page = raw && /^\d+$/.test(raw) && Number.isSafeInteger(Number(raw)) && Number(raw) >= 1 && Number(raw) <= TEAM_STORIES[team].slides.length ? Number(raw) : 1;
  return {team, page, story:TEAM_STORIES[team], slide:TEAM_STORIES[team].slides[page-1]};
}
