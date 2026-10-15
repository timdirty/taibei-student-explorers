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
      {title:'AI 智慧判斷剩食 × 自動推薦吃飯策略', say:'吃完午餐後，我們拍下餐盤，AI 會智慧辨識每一格剩下的克數，像這盤青菜剩 80 克、排骨剩 72 克，合計 162 克。AI 發現是因為先吃白飯太快飽，就會自動推薦下一餐的吃飯策略：白飯先盛四分之三碗、趁熱先吃三口青菜配排骨，還餓再去添飯。', action:'看 AI 餐盤辨識與吃飯策略', href:FOOD_APP+'/scan?view=history'},
      {title:'真實兩餐對照：AI 策略讓剩食減少 91%', say:'我們實際追蹤兩餐來驗證 AI 推薦的吃飯策略！第一餐還沒用策略時，餐後剩下 162 克；第二餐採用 AI 推薦的方法，白飯先盛剛好、先吃青菜配主菜，結果餐後只剩 14 克，剩食減少了 91%，而且肚子吃得剛剛好飽！', action:'看真實兩餐前後對照', href:FOOD_APP+'/presentation?view=results'},
      {title:'個人 → 班級 → 全校：預測喜好預防剩食', say:'食光偵探不只幫個人，還能擴展到班級和全校！第一層幫個人推薦每餐盛飯比例與吃菜策略；第二層統計全班各道菜平均剩食量，找出班上最愛與常剩的菜色；第三層結合全校 23 天教育部食材登錄平臺每餐 707 到 905 大卡資料，預測全校對不同口味的喜好度，提前調整菜單、從源頭預防剩食！', action:'看個人到全校口味預測', href:FOOD_APP+'/insights'},
      {title:'累積校園午餐大數據：長期營養與惜食參照庫', say:'當我們累積越多筆紀錄，就會成為超有價值的校園午餐大數據參照庫！我們整合了 40 天公告菜單、23 天教育部實登熱量與進貨重量、17 張實拍餐盤 AI 克數辨識與 120 則配餐情境，不只幫同學吃得剛好，更能提供給導師、學校營養師與廚房作為長期開菜單與精準備餐的依據！', action:'看校園午餐大數據參照庫', href:'food.html#clues'},
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
      {title:'同地跨時段回訪：現場照片與原音雙重比對', say:'我們在同一個通學生活圈拍下現場照片、錄下 15 秒原音做跨時段與位置比對。貼近大馬路尖峰時，平均音量達負 17.8 dBFS，AI 辨識出公車氣壓煞車與車流聲；轉進退縮綠蔭與志成公園後，音量降到負 25.9 dBFS，減弱超過 8 分貝，白頭翁鳥鳴與微風聲都清楚浮現！', action:'看同地跨時段照片與原音比對', href:SOUND_APP+'/explore?view=mine'},
      {title:'擴充聲音地圖：結合現場照片與 17 處實測原音', say:'我們大幅擴充了互動聲音地圖，結合 50 個政府公開據點與 17 處現場實拍照片和原音！包含道路施工負 21.5 dBFS、教室上課鐘聲與朗讀負 21.9 dBFS、下課操場負 20.4 dBFS、捷運芝山站負 20.2 dBFS、公園鳥鳴負 25.9 dBFS，以及最安靜的住家山景陽台負 52.6 dBFS，點開地圖就能看照片聽聲音！', action:'打開擴充聲音地圖看照片聽原音', href:SOUND_APP+'/?view=map#my-sound-map'},
      {title:'城市聲音時光機：累積大數據紀錄環境演變', say:'當我們累積越來越多跨時段、跨月份的聲音與照片大數據，聲音地圖就變成了「城市聲音時光機」！從早晨七點半的通學與鳥鳴、十點半的上課與施工、下午四點半的放學公車與垃圾車祈禱琴聲，到夜晚九點的山景陽台，隨時拉動時間軸，就能回溯施工前後與四季的環境演變！', action:'體驗城市聲音時光機', href:SOUND_APP+'/competition?view=results'},
      {title:'聲音大數據 × 智慧通學與探索路線規劃', say:'累積聲音大數據還能幫我們規劃「智慧通學與探索路線」！比較路線 A 大馬路與施工側（負 17.8 dBFS）和路線 B 退縮人行道與公園河濱路線（負 26.5 dBFS），音量明顯降低超過 8 分貝。透過聲音地圖、城市時光機與路線比較，我們能幫同學和社區居民找出最安靜、最安全舒適的步行路線！', action:'看智慧通學與探索路線比較', href:SOUND_APP+'/routes'},
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
