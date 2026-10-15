export const FOOD_APP = 'https://foodlens-school.vercel.app';
export const SOUND_APP = 'https://soundscape-ai-city-sound-detective.vercel.app';
export const LUNCH_SURVEY = 'https://taibei-student-explorers.ctctim14.chatgpt.site/foodlens-survey';
export const LUNCH_RESULTS = 'https://taibei-student-explorers.ctctim14.chatgpt.site/survey-admin';

export const TEAM_STORIES = {
  food: {
    name: '食光偵探', team: '食光追查隊', journey: 'food.html',
    pdf: 'slides/食光偵探_11頁學生簡報.pdf', pptx: 'slides/食光偵探_11頁學生簡報.pptx',
    slides: [
      {title:'讓午餐剛剛好', say:'大家好，我們是泰北國際雙語學校國小部的食光追查隊！我們結合 AI 餐盤辨識、個人化吃飯策略推薦與校園午餐大數據，讓每一餐都吃得剛剛好飽，同時從源頭減少校園剩食！', action:'開始我的午餐任務', href:'food.html'},
      {title:'校園午餐的真實困擾：為什麼每天都有廚餘？', say:'我們在學校觀察到三個真實困擾：第一，打菜盛飯憑感覺，白飯盛太滿太快吃飽，結果青菜和排骨吃不下；第二，遇到陌生菜色不敢試，留到最後冷掉更不想吃；第三，過去缺乏 AI 數據追蹤與個人化吃飯策略，導致班級回收桶每天都有好幾公斤廚餘。', action:'看看實拍餐盤與回收桶', href:FOOD_APP+'/discover'},
      {title:'我們的 AI 惜食研究四問：從個人到全校', say:'因此我們提出四階段研究閉環：第一，餐前怎麼配才剛好？第二，餐後各格剩多少公克？第三，下一餐怎麼吃能減少剩食？第四，累積全班與全校大數據後，如何預測口味喜好、幫學校提前調整菜單預防剩食？', action:'打開午餐研究心智圖', href:'brainstorm/food-mindmap.png'},
      {title:'學校 9–10 月菜單 × 教育部食材登錄平臺串接', say:'我們完整建檔學校 9 月、10 月共 40 天公告菜單，並串接教育部校園食材登錄平臺 23 天官方實登數據，包含每餐 707 到 905 大卡熱量、135 道真實供餐菜色照與 638 筆食材進貨重量，作為 AI 配餐與大數據參照基準！', action:'看學校 9 月公告菜單', href:FOOD_APP+'/menu-sources/taibei-lunch-115-09.pdf', extraActions:[{label:'看學校 10 月公告菜單', href:FOOD_APP+'/menu-sources/taibei-lunch-115-10.pdf'}]},
      {title:'餐前問 AI：先看菜色組成與第一口搭配策略', say:'吃飯前打開平板點選今日菜色，針對不熟悉或平常較少吃的菜，AI 會自動推薦「第一口嚐鮮搭配法」，例如先夾一小塊香酥魚排配一口香菇高麗菜，並把專屬配餐計畫帶去拍餐盤！', action:'選一道菜，問 AI', href:FOOD_APP+'/coach'},
      {title:'餐前份量策略：依食慾選份量，保留添飯彈性', say:'打菜前先依當天飢餓程度選擇「小份（3/4 碗）、剛好、或多些」，搭配「趁熱先吃三口青菜與主菜、吃完還餓再去添飯」的策略，找到吃得飽又不剩食的黃金比例！', action:'玩配餐，設定今日份量', href:FOOD_APP+'/game'},
      {title:'AI 智慧判斷剩食 × 自動推薦吃飯策略', say:'吃完午餐後，我們拍下餐盤，AI 會智慧辨識每一格剩下的克數，像這盤青菜剩 80 克、排骨剩 72 克，合計 162 克。AI 發現是因為先吃白飯太快飽，就會自動推薦下一餐的吃飯策略：白飯先盛四分之三碗、趁熱先吃三口青菜配排骨，還餓再去添飯。', action:'看 AI 餐盤辨識與吃飯策略', href:FOOD_APP+'/scan?view=history'},
      {title:'真實兩餐對照：AI 策略讓剩食減少 91%', say:'我們實際追蹤兩餐來驗證 AI 推薦的吃飯策略！第一餐還沒用策略時，餐後剩下 162 克；第二餐採用 AI 推薦的方法，白飯先盛剛好、先吃青菜配主菜，結果餐後只剩 14 克，剩食減少了 91%，而且肚子吃得剛剛好飽！', action:'看真實兩餐前後對照', href:FOOD_APP+'/presentation?view=results'},
      {title:'個人 → 班級 → 全校：預測喜好預防剩食', say:'食光偵探不只幫個人，還能擴展到班級和全校！第一層幫個人推薦每餐盛飯比例與吃菜策略；第二層統計全班各道菜平均剩食量，找出班上最愛與常剩的菜色；第三層結合全校 23 天教育部食材登錄平臺每餐 707 到 905 大卡資料，預測全校對不同口味的喜好度，提前調整菜單、從源頭預防剩食！', action:'看個人到全校口味預測', href:FOOD_APP+'/insights'},
      {title:'累積校園午餐大數據：長期營養與惜食參照庫', say:'當我們累積越多筆紀錄，就會成為超有價值的校園午餐大數據參照庫！我們整合了 40 天公告菜單、23 天教育部實登熱量與進貨重量、17 張實拍餐盤 AI 克數辨識與 120 則配餐情境，不只幫同學吃得剛好，更能提供給導師、學校營養師與廚房作為長期開菜單與精準備餐的依據！', action:'看校園午餐大數據參照庫', href:'food.html#clues'},
      {title:'總結與立即體驗：用 AI 與大數據讓午餐剛剛好', say:'總結食光偵探三大成果：AI 智慧判斷剩食並推薦吃飯策略讓剩食減少 91%、個人到班級到全校三層預測預防剩食、以及校園午餐大數據長期參照庫！現在就請評審與同學掃描畫面上的 QR Code，立即體驗食光偵探與填寫午餐問卷！', action:'點一道菜，問問 AI', href:FOOD_APP+'/coach', extraActions:[{label:'填午餐回饋（免登入）', href:LUNCH_SURVEY}]}
    ],
  },
  sound: {
    name: '聲景智探', team: '泰北聽路隊', journey: 'sound.html',
    pdf: 'slides/聲景智探_11頁學生簡報.pdf', pptx: 'slides/聲景智探_11頁學生簡報.pptx',
    slides: [
      {title:'跟著耳朵，發現城市', say:'大家好，我們是泰北國際雙語學校國小部的泰北聽路隊！我們結合現場實拍照片、15 秒環境原音與 AI 聲學模型，打造看得見也聽得到的「擴充聲音地圖、城市聲音時光機與智慧通學路線」！', action:'開始我的聽路任務', href:'sound.html'},
      {title:'通學路上的聲音秘密：同一條路聽起來不一樣？', say:'我們在士林福林生活圈實測發現，尖峰時段大馬路車流與煞車聲高達負 17.8 dBFS，讓人緊張又聽不見鳥鳴；但只要換個時段或轉進退縮綠蔭與志成公園，音量就降到負 25.9 dBFS！因此我們決定拍下現場照片、錄下原音，打造結合照片與原音的擴充聲音地圖！', action:'先聽一段環境原音', href:SOUND_APP+'/#sound-practice'},
      {title:'我們的聲景偵探四問：從單點錄音到時光機', say:'我們提出四階段研究閉環：第一，現場有哪些聲音與分貝變化？第二，如何把 50 個公開據點與 17 處實拍照片、原音放進擴充地圖？第三，累積大數據後如何變成「城市聲音時光機」記錄環境演變？第四，如何用大數據規劃最安靜安全的「智慧通學與探索路線」？', action:'打開聲音研究心智圖', href:'brainstorm/sound-mindmap.png'},
      {title:'擴充聲音地圖基底：50 個政府據點 × 17 處實測點', say:'我們的擴充聲音地圖整合了士林區 50 個政府公開環境據點（24 座公園綠地、26 個交通站點），並由我們實地採集 17 處道路施工、教室上課、下課操場、音樂課、垃圾車、捷運芝山站與河濱步道的現場照片與 15 秒原音，點開地圖座標就能看照片聽聲音！', action:'打開擴充聲音地圖', href:SOUND_APP+'/explore'},
      {title:'盲聽暖身挑戰：先用耳朵分辨環境聲源', say:'出發採集前，我們先透過「盲聽暖身挑戰」訓練耳朵的敏銳度：先不看畫面專心聽 10 到 15 秒原音，分辨是自然聲、機械鈴聲、人聲還是交通聲，記錄主觀舒適度後，再呼叫 AI 聲學模型一起比對！', action:'玩一題盲聽挑戰', href:SOUND_APP+'/#sound-practice'},
      {title:'AI 聲學偵探協作：YAMNet 辨識 × 分貝量化', say:'系統內建 Google YAMNet 521 類聲音 AI 模型，能自動分析頻譜辨識鳥鳴、車流、施工鑽地與上課鐘聲，並客觀計算每段錄音的平均與峰值 dBFS 分貝數。結合人耳感受、現場照片與 AI 數據，就能合成完整的聲景破案卷宗！', action:'和 AI 一起分析原音', href:SOUND_APP+'/#sound-practice'},
      {title:'同地跨時段回訪：現場照片與原音雙重比對', say:'我們在同一個通學生活圈拍下現場照片、錄下 15 秒原音做跨時段與位置比對。貼近大馬路尖峰時，平均音量達負 17.8 dBFS，AI 辨識出公車氣壓煞車與車流聲；轉進退縮綠蔭與志成公園後，音量降到負 25.9 dBFS，減弱超過 8 分貝，白頭翁鳥鳴與微風聲都清楚浮現！', action:'看同地跨時段照片與原音比對', href:SOUND_APP+'/explore?view=mine'},
      {title:'擴充聲音地圖：結合現場照片與 17 處實測原音', say:'我們大幅擴充了互動聲音地圖，結合 50 個政府公開據點與 17 處現場實拍照片和原音！包含道路施工負 21.5 dBFS、教室上課鐘聲與朗讀負 21.9 dBFS、下課操場負 20.4 dBFS、捷運芝山站負 20.2 dBFS、公園鳥鳴負 25.9 dBFS，以及最安靜的住家山景陽台負 52.6 dBFS，點開地圖就能看照片聽聲音！', action:'打開擴充聲音地圖看照片聽原音', href:SOUND_APP+'/?view=map#my-sound-map'},
      {title:'城市聲音時光機：累積大數據紀錄環境演變', say:'當我們累積越來越多跨時段、跨月份的聲音與照片大數據，聲音地圖就變成了「城市聲音時光機」！從早晨七點半的通學與鳥鳴、十點半的上課與施工、下午四點半的放學公車與垃圾車祈禱琴聲，到夜晚九點的山景陽台，隨時拉動時間軸，就能回溯施工前後與四季的環境演變！', action:'體驗城市聲音時光機', href:SOUND_APP+'/competition?view=results'},
      {title:'聲音大數據 × 智慧通學與探索路線規劃', say:'累積聲音大數據還能幫我們規劃「智慧通學與探索路線」！比較路線 A 大馬路與施工側（負 17.8 dBFS）和路線 B 退縮人行道與公園河濱路線（負 26.5 dBFS），音量明顯降低超過 8 分貝。透過聲音地圖、城市時光機與路線比較，我們能幫同學和社區居民找出最安靜、最安全舒適的步行路線！', action:'看智慧通學與探索路線比較', href:SOUND_APP+'/routes'},
      {title:'總結與立即體驗：聲音地圖 × 時光機 × 智慧路線', say:'總結聲景智探三大成果：結合 50 個據點與 17 處實拍照片原音的擴充聲音地圖、跨時段跨月份的城市聲音時光機、以及避開噪音推薦好路的智慧通學路線規劃！現在就請評審與同學掃描畫面上的 QR Code，立即體驗聲景智探！', action:'打開聲景智探體驗', href:SOUND_APP+'/?view=map#my-sound-map'}
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
