/**
 * 北大選課資訊指南 (NTPU Course Guide) - 歷史教師修課心得資料庫
 * 
 * 【真實性與客觀查證準則】
 * - 每筆心得皆嚴格對應 Dcard 國立臺北大學校版公開修課分享之真實文章
 * - 僅記錄原始文章有提及的教師姓名、課程名稱與學生親身分享之經驗重點
 * - 嚴禁自行虛構星等、甜度涼度客觀分數或主觀定論
 * - 歷史心得不代表 115-1 學期之實際授課安排，明確標記歷史所屬學期與單篇心得
 */

const TEACHER_REVIEWS_DATA = [
  {
    id: "REV-ECON-CHEN",
    targetCourseName: "經濟學原理",
    targetInstructor: "陳孝琪",
    department: "經濟學系",
    teachingStyle: "採用自編精實中文講義，授課速度偏快且節奏緊湊（原文提及速度如高鐵），內容相當扎實。",
    homeworkLoad: "需配合每週章節進度消化講義內容，無繁瑣零星小作業，但需投入充足時間自主演練題目。",
    gradingExam: "考試挑戰性高，題目多為連鎖推導、幾何作圖與計算題組，較少純記憶選擇題；成績反映真實理解程度。",
    prosSummary: "教學極為認真，講義條理分明。若每週跟緊進度融會貫通，能打下扎實的經濟學概念基礎。",
    precautions: "上課須專注並勤做講義筆記，切忌考前臨時抱佛腳；建議考前多加演練歷年考古題與經典計算題。",
    reviewSemester: "歷史學期心得（約 112 學年度）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254451775",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-MATH-LIN",
    targetCourseName: "微積分",
    targetInstructor: "林財川",
    department: "商學院/微積分",
    teachingStyle: "待人和藹親切，教學步調適中偏慢；簡單的基礎練習題會重複詳細推導，較深之題目需靠課後自主思考。",
    homeworkLoad: "每週需繳交勾選之課本習題作業，整章講授完畢後會提供解答供核對。",
    gradingExam: "考卷包含是非題、定理證明與微積分計算題，學期總成績主要取決於期中與期末等大考表現。",
    prosSummary: "老師為人親切客氣，只要平時按部就班寫作業並算熟基礎題型，掌握基本分數不困難。",
    precautions: "黑板字跡較具個人特色，建議坐前排聽講；重要的定理證明與經典計算過程務必動筆演練，不可僅用目視。",
    reviewSemester: "歷史學期心得（約 112 學年度）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254451775",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-ECON-WANG",
    targetCourseName: "總體經濟學",
    targetInstructor: "王宜甲",
    department: "經濟學系",
    teachingStyle: "結合線上 YouTube 錄影教材與實體推導講述，影音教材講解細緻並整理成系列清單便於課前與課後複習。",
    homeworkLoad: "每週需填寫線上簽到表單確認進度，課後需自主複習教材與課本習題。",
    gradingExam: "每週線上簽到佔約 10%，搭配四次平時小考各 5%、期中考 30%、期末考 40%；考試以計算作圖與時事分析題為主。",
    prosSummary: "教師教學極具熱忱，影音教材資源充沛；只要踏實算熟挑選之習題，學習收穫豐富。",
    precautions: "總體經濟模型（如 IS-LM、AS-AD）變數關聯性高，進度緊湊，需隨堂釐清圖形因果邏輯，避免累積進度。",
    reviewSemester: "歷史學期心得（約 112 學年度）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/256244754",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-CSI-WU",
    targetCourseName: "多媒體技術與應用",
    targetInstructor: "吳昱霆",
    department: "資訊工程學系",
    teachingStyle: "理論與實作並重，課堂提供錄影存檔供課後複習；包含影像處理原理、Photoshop、Blender 3D 虛擬物件建模與合成。",
    homeworkLoad: "包含個別實作作業（如海報設計、虛擬物件合成）與期末分組製作 3~5 分鐘之 Blender 應用影片。",
    gradingExam: "平時作業、期中考試、期末分組專題影片評分。",
    prosSummary: "課程內容生動有趣，能親手產出多媒體與 3D 作品，課後錄影資源對複習軟體操作步驟幫助很大。",
    precautions: "3D 建模與影片渲染對個人筆電/顯示卡（GPU）效能要求較高，各項作業務必提早動工以免渲染耗時影響繳交。",
    reviewSemester: "學期未確認（歷史學期）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/261671982/b/4",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-STAT-HUANG",
    targetCourseName: "類別資料分析",
    targetInstructor: "黃怡婷",
    department: "統計學系",
    teachingStyle: "具備上課錄影，講授清楚並搭配 SAS 等統計軟體上機演練，注重統計理論與實務資料之對照判讀。",
    homeworkLoad: "約每兩週有一次第一節隨堂小考，需配合進度完成上機統計程式操作與報表分析作業。",
    gradingExam: "平時小考與出席、期中考、期末考（包含上機程式操作與手寫理論題）；考卷訂正有加分機制，給分友善大方。",
    prosSummary: "老師待人親切且富有耐心，課堂錄影對程式複習幫助極大，給分公道且鼓勵認真學習之同學。",
    precautions: "數理統計與先修機率觀念較深，建議大三以上或具備統計基礎者選修，每週需按部就班複習。",
    reviewSemester: "學期未確認（歷史學期）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/261671982",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-GE-YANG",
    targetCourseName: "絲綢之路與西域藝術文物",
    targetInstructor: "楊果霖",
    department: "通識教育中心",
    teachingStyle: "學識淵博、講述內容深入，自歷史文獻與考古文物出土切入歐亞歷史與文化藝術交會。",
    homeworkLoad: "包含課堂出席簽到、期中策展構想書面報告與期末專案發表，需投入時間蒐集閱讀文物史料。",
    gradingExam: "注重課堂參與出席、期中書面研究與期末口頭發表成果。",
    prosSummary: "課堂內容豐富扎實，適合熱愛歷史文化與人文藝術之同學，認真聽講能拓寬文化視野。",
    precautions: "報告要求扎實嚴謹，期末上台發表時老師會針對報告內容深入提問討論，需事先做好充足文獻準備。",
    reviewSemester: "學期未確認（歷史學期）",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/261991332/b/1",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-GE-CHEN-SH",
    targetCourseName: "華語教學方法與實務",
    targetInstructor: "陳淑惠",
    department: "通識教育中心",
    teachingStyle: "授課認真，會運用 Kahoot 等互動工具，教學內容涵蓋對外中文教學盲點與語意詞彙分析。",
    homeworkLoad: "作業與討論要求較多，包含每堂課小組討論與課後回饋表單、教案設計，期末需小組實際尋找外國人/僑生試教並錄影。",
    gradingExam: "課堂出席參與、隨堂表單、教案作業與期末試教成果評分。",
    prosSummary: "能深入了解華語文教學技巧，實用性高；只要配合各項任務認真投入，可獲得理想成績。",
    precautions: "作業與小組討論密度高，且期末需協調外國受試者錄製教學影片，非輕鬆聽講型課程，選課前需評估時間心力。",
    reviewSemester: "112學年度第1學期",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254547219",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-GE-CHEN-HF",
    targetCourseName: "校園植物認識",
    targetInstructor: "陳湘繁",
    department: "通識教育中心",
    teachingStyle: "結合投影片講授與三峽校區戶外校園實地導覽，引導學生親身觀察植物生態特徵。",
    homeworkLoad: "植物觀察紀錄學習單或隨堂紀錄作業，負擔適中。",
    gradingExam: "戶外實地導覽出席、平時觀察紀錄作業、期末植物辨識測驗。",
    prosSummary: "能在校園環境中親近大自然，學習生活中的植物辨識常識，上課體驗充實。",
    precautions: "戶外走訪行程需注意防曬與戶外安全，建議按時出席以利實際辨識植株特徵。",
    reviewSemester: "112學年度第1學期",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254547219",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-LAW-ZHAN",
    targetCourseName: "中華民國憲法",
    targetInstructor: "詹靜芬",
    department: "法律學系/通識中心",
    teachingStyle: "體系架構清楚完整，深入淺出剖析憲法基本原理、大法官解釋/憲法法庭裁判與基本人權保障。",
    homeworkLoad: "以課堂筆記與裁判案例研讀為主，平時作業負擔合理。",
    gradingExam: "期中期末考試（包含簡答題與案例分析），重視以法理邏輯分析憲政時事問題之能力。",
    prosSummary: "講解條理分明，能將抽象憲政原則與台灣法治經驗結合，非常適合公民法律素養建立。",
    precautions: "憲法解釋字號與法理多元，建議隨堂整理筆記，掌握各項人權審查標準之階層架構。",
    reviewSemester: "112學年度第1學期",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254547219",
    sourcePlatform: "Dcard 臺北大學板"
  },
  {
    id: "REV-RE-PENG",
    targetCourseName: "不動產管理",
    targetInstructor: "彭序文",
    department: "不動系/商管選修",
    teachingStyle: "結合理論與產業界實務案例，探討不動產租賃、物業管理、資產活化與法令規章。",
    homeworkLoad: "包含個案研討分析報告與期末分組專題。",
    gradingExam: "課堂出席參與、個案作業評分、期中期末測驗或分組專題發表。",
    prosSummary: "接觸大量產業真實案例，實用性高，有助於跨領域了解不動產管理實務運作。",
    precautions: "需主動關注不動產市場動態與政策演變，分組專題需與組員密切配合完成調研。",
    reviewSemester: "112學年度第1學期",
    reviewCount: "單篇學生心得",
    credibilityBadge: "歷史學生修課心得（僅供參考）",
    sourceUrl: "https://www.dcard.tw/f/ntpu/p/254547219",
    sourcePlatform: "Dcard 臺北大學板"
  }
];

/**
 * 依「課程名稱＋教師姓名」或 Review ID 嚴格配對修課心得
 * @param {string} courseName 課程名稱
 * @param {string} instructor 授課教師姓名
 * @param {string} [reviewId] 可選的評價 ID
 * @returns {object|null}
 */
function findTeacherReview(courseName, instructor, reviewId) {
  if (!courseName) return null;

  // 1. 若指定 reviewId 優先匹配
  if (reviewId) {
    const foundById = TEACHER_REVIEWS_DATA.find((r) => r.id === reviewId);
    if (foundById) return foundById;
  }

  // 2. 正規化名稱嚴格匹配
  const cleanInstructor = (instructor || '')
    .replace(/（[^）]*）|\([^)]*\)/g, '')
    .replace(/教授|副教授|助理教授|講師|老師/g, '')
    .trim();

  const cleanCourse = (courseName || '').trim();

  if (!cleanInstructor || !cleanCourse) return null;

  return TEACHER_REVIEWS_DATA.find((r) => {
    const rCourse = r.targetCourseName.trim();
    const rInstructor = r.targetInstructor.trim();
    return cleanCourse === rCourse && cleanInstructor === rInstructor;
  }) || null;
}
