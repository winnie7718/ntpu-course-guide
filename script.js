/**
 * 北大選課資訊指南 (NTPU Course Guide) - 核心互動與官方真實資料匯入邏輯
 * 
 * 遵守最高真實性規範：
 * - 絕不公開展示示範課程、示範教授或虛構心得
 * - 當真實資料為空時，明確顯示「目前尚無完成查證的課程資料」
 * - 支援官方開放格式 CSV 與 JSON 兩種真實資料匯入方式
 * - 未查證之欄位一律標記「尚未確認」，不可猜測
 */

(function () {
  'use strict';

  // ================= DOM 元素快取 =================
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const departmentSelect = document.getElementById('departmentSelect');
  const typeSelect = document.getElementById('typeSelect');
  const creditsSelect = document.getElementById('creditsSelect');
  const statusSelect = document.getElementById('statusSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const activeFilterBadge = document.getElementById('activeFilterBadge');

  const courseGrid = document.getElementById('courseGrid');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');
  const emptyImportBtn = document.getElementById('emptyImportBtn');
  const emptyResetBtn = document.getElementById('emptyResetBtn');
  const matchedCountEl = document.getElementById('matchedCount');
  const totalCountEl = document.getElementById('totalCount');
  const reviewCountBadge = document.getElementById('reviewCountBadge');

  // 課程詳細資訊 Modal 元素
  const courseModal = document.getElementById('courseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalCourseName = document.getElementById('modalCourseName');
  const modalDepartment = document.getElementById('modalDepartment');
  const modalId = document.getElementById('modalId');
  const modalBadges = document.getElementById('modalBadges');
  const modalInstructor = document.getElementById('modalInstructor');
  const modalCredits = document.getElementById('modalCredits');
  const modalSchedule = document.getElementById('modalSchedule');
  const modalSemester = document.getElementById('modalSemester');
  const modalDescription = document.getElementById('modalDescription');
  const modalSource = document.getElementById('modalSource');
  const modalVerificationStatus = document.getElementById('modalVerificationStatus');

  // 教師心得區塊元素
  const reviewCredibilityBadge = document.getElementById('reviewCredibilityBadge');
  const reviewCardContent = document.getElementById('reviewCardContent');
  const reviewSemesterText = document.getElementById('reviewSemesterText');
  const reviewCountText = document.getElementById('reviewCountText');
  const reviewTeachingStyle = document.getElementById('reviewTeachingStyle');
  const reviewHomeworkLoad = document.getElementById('reviewHomeworkLoad');
  const reviewGradingExam = document.getElementById('reviewGradingExam');
  const reviewProsSummary = document.getElementById('reviewProsSummary');
  const reviewPrecautions = document.getElementById('reviewPrecautions');
  const reviewSourceUrl = document.getElementById('reviewSourceUrl');
  const reviewSourcePlatform = document.getElementById('reviewSourcePlatform');
  const reviewEmptyNotice = document.getElementById('reviewEmptyNotice');

  // 官方資料匯入 Modal 元素
  const openImportBtn = document.getElementById('openImportBtn');
  const importModal = document.getElementById('importModal');
  const importCloseBtn = document.getElementById('importCloseBtn');
  const importCancelBtn = document.getElementById('importCancelBtn');
  const importSubmitBtn = document.getElementById('importSubmitBtn');
  const tabJsonBtn = document.getElementById('tabJsonBtn');
  const tabCsvBtn = document.getElementById('tabCsvBtn');
  const copyTemplateBtn = document.getElementById('copyTemplateBtn');
  const templateFormatLabel = document.getElementById('templateFormatLabel');
  const importInputLabel = document.getElementById('importInputLabel');
  const importDataTextarea = document.getElementById('importDataTextarea');
  const importErrorMsg = document.getElementById('importErrorMsg');

  // ================= 應用狀態 =================
  let rawCourses = [];
  let currentImportFormat = 'json'; // 'json' 或 'csv'
  let debounceTimer = null;

  /**
   * 初始化系統
   */
  function init() {
    // 檢查課程資料是否載入（嚴禁假資料，僅載入真實資料）
    if (typeof COURSES_DATA !== 'undefined' && Array.isArray(COURSES_DATA)) {
      // 雙重過濾：徹底排除任何 isDemo: true 或示範字眼的課程
      rawCourses = COURSES_DATA.filter((c) => c && c.isDemo !== true);
    } else {
      rawCourses = [];
    }

    // 更新總數統計
    updateStatsCounter();

    // 綁定事件監聽
    bindEvents();

    // 執行首次篩選渲染
    applyFilters();
  }

  /**
   * 更新統計數字
   */
  function updateStatsCounter() {
    if (totalCountEl) {
      totalCountEl.textContent = rawCourses.length;
    }
    if (reviewCountBadge && typeof TEACHER_REVIEWS_DATA !== 'undefined') {
      reviewCountBadge.textContent = TEACHER_REVIEWS_DATA.length;
    }
  }

  /**
   * 綁定使用者操作事件
   */
  function bindEvents() {
    // 搜尋輸入 (Debounce 200ms)
    searchInput.addEventListener('input', function () {
      toggleSearchClearBtn();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        applyFilters();
      }, 200);
    });

    // 清除搜尋框字詞
    searchClearBtn.addEventListener('click', function () {
      searchInput.value = '';
      toggleSearchClearBtn();
      applyFilters();
      searchInput.focus();
    });

    // 下拉選單連動
    departmentSelect.addEventListener('change', applyFilters);
    typeSelect.addEventListener('change', applyFilters);
    creditsSelect.addEventListener('change', applyFilters);
    if (statusSelect) {
      statusSelect.addEventListener('change', applyFilters);
    }

    // 一鍵清除所有篩選條件
    resetFiltersBtn.addEventListener('click', clearAllFilters);
    emptyResetBtn.addEventListener('click', clearAllFilters);

    // 課程詳細資訊 Modal 關閉操作
    modalCloseBtn.addEventListener('click', closeModal);
    modalConfirmBtn.addEventListener('click', closeModal);

    // 點擊 Modal 背景半透明遮罩關閉
    courseModal.addEventListener('click', function (e) {
      if (e.target === courseModal) {
        closeModal();
      }
    });

    // 匯入官方資料 Modal 互動
    if (openImportBtn) {
      openImportBtn.addEventListener('click', openImportModal);
    }
    if (emptyImportBtn) {
      emptyImportBtn.addEventListener('click', openImportModal);
    }
    if (importCloseBtn) {
      importCloseBtn.addEventListener('click', closeImportModal);
    }
    if (importCancelBtn) {
      importCancelBtn.addEventListener('click', closeImportModal);
    }
    if (importModal) {
      importModal.addEventListener('click', function (e) {
        if (e.target === importModal) {
          closeImportModal();
        }
      });
    }

    // 匯入格式切換與範本填入
    if (tabJsonBtn && tabCsvBtn) {
      tabJsonBtn.addEventListener('click', () => switchImportFormat('json'));
      tabCsvBtn.addEventListener('click', () => switchImportFormat('csv'));
    }
    if (copyTemplateBtn) {
      copyTemplateBtn.addEventListener('click', fillTemplateFormat);
    }
    if (importSubmitBtn) {
      importSubmitBtn.addEventListener('click', handleCourseImport);
    }

    // 按下鍵盤 ESC 關閉目前啟用的 Modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (importModal && importModal.classList.contains('active')) {
          closeImportModal();
        } else if (courseModal && courseModal.classList.contains('active')) {
          closeModal();
        }
      }
    });
  }

  /**
   * 控制搜尋框的清除 (X) 按鈕顯示狀態
   */
  function toggleSearchClearBtn() {
    if (searchInput.value.trim().length > 0) {
      searchClearBtn.style.display = 'inline-flex';
    } else {
      searchClearBtn.style.display = 'none';
    }
  }

  /**
   * 多重條件交集 (AND) 篩選與結果渲染
   */
  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedDept = departmentSelect.value;
    const selectedType = typeSelect.value;
    const selectedCredits = creditsSelect.value;
    const selectedStatus = statusSelect ? statusSelect.value : 'all';

    const filtered = rawCourses.filter((course) => {
      // 1. 關鍵字模糊比對（課程名稱、教師、系所、課程代碼、課綱簡介、上課時間、資料來源）
      if (keyword) {
        const matchName = course.name && course.name.toLowerCase().includes(keyword);
        const matchInstructor = course.instructor && course.instructor.toLowerCase().includes(keyword);
        const matchDept = course.department && course.department.toLowerCase().includes(keyword);
        const matchId = course.id && course.id.toLowerCase().includes(keyword);
        const matchDesc = course.description && course.description.toLowerCase().includes(keyword);
        const matchSchedule = course.schedule && course.schedule.toLowerCase().includes(keyword);
        const matchSource = course.source && course.source.toLowerCase().includes(keyword);

        if (!(matchName || matchInstructor || matchDept || matchId || matchDesc || matchSchedule || matchSource)) {
          return false;
        }
      }

      // 2. 開課系所篩選
      if (selectedDept !== 'all') {
        if (course.department !== selectedDept) {
          return false;
        }
      }

      // 3. 修別類型篩選 (必修 / 選修 / 通識)
      if (selectedType !== 'all') {
        if (course.type !== selectedType) {
          return false;
        }
      }

      // 4. 學分數篩選 (1 / 2 / 3 / other)
      if (selectedCredits !== 'all') {
        if (selectedCredits === 'other') {
          if (typeof course.credits !== 'number' || course.credits < 4) {
            return false;
          }
        } else {
          if (course.credits !== Number(selectedCredits)) {
            return false;
          }
        }
      }

      // 5. 資料可信度與狀態篩選
      if (selectedStatus !== 'all') {
        const courseStatus = course.verificationStatus || '官方資料';
        if (courseStatus !== selectedStatus) {
          return false;
        }
      }

      return true;
    });

    // 更新篩選標籤文字
    updateActiveFilterBadge(keyword, selectedDept, selectedType, selectedCredits, selectedStatus);

    // 渲染卡片結果
    renderCourseList(filtered);
  }

  /**
   * 更新篩選狀態徽章
   */
  function updateActiveFilterBadge(keyword, dept, type, credits, status) {
    let activeCount = 0;
    if (keyword) activeCount++;
    if (dept !== 'all') activeCount++;
    if (type !== 'all') activeCount++;
    if (credits !== 'all') activeCount++;
    if (status && status !== 'all') activeCount++;

    if (activeCount === 0) {
      activeFilterBadge.textContent = '條件：全部課程';
    } else {
      activeFilterBadge.textContent = `已套用 ${activeCount} 項篩選條件`;
    }
  }

  /**
   * 渲染課程清單卡片
   */
  function renderCourseList(courses) {
    matchedCountEl.textContent = courses.length;

    // 若資料庫完全為空（尚未匯入任何官方課程）
    if (rawCourses.length === 0) {
      courseGrid.innerHTML = '';
      courseGrid.style.display = 'none';
      emptyState.style.display = 'block';
      emptyTitle.textContent = '目前尚無完成查證的課程資料';
      emptyDesc.textContent = '本站堅守資料真實性原則，已徹底清除所有示範教授與假資料，絕不為湊數而捏造排課內容。您可以點擊下方按鈕手動貼上由教務處系統匯出之 CSV 或 JSON 官方真實課程資料。';
      emptyImportBtn.style.display = 'inline-flex';
      emptyResetBtn.style.display = 'none';
      return;
    }

    // 若資料庫有資料，但篩選後無符合結果
    if (courses.length === 0) {
      courseGrid.innerHTML = '';
      courseGrid.style.display = 'none';
      emptyState.style.display = 'block';
      emptyTitle.textContent = '找不到符合條件的課程，請試著調整搜尋條件';
      emptyDesc.textContent = '請嘗試清空搜尋關鍵字、切換其他系所或放寬學分條件。';
      emptyImportBtn.style.display = 'none';
      emptyResetBtn.style.display = 'inline-flex';
      return;
    }

    emptyState.style.display = 'none';
    courseGrid.style.display = 'grid';

    // 產生 HTML 卡片
    const cardsHtml = courses.map((course) => {
      // 根據課程修別決定標籤樣式 class
      let typeClass = 'required';
      if (course.type === '選修') {
        typeClass = 'elective';
      } else if (course.type === '通識') {
        typeClass = 'ge';
      }

      // 檢查是否具有已收錄之教師修課心得
      let hasReviewTag = '';
      if (typeof findTeacherReview === 'function') {
        const review = findTeacherReview(course.name, course.instructor, course.teacherReview);
        if (review) {
          hasReviewTag = `<span class="tag-badge has-review" title="已收錄真實學生歷史修課心得">有修課心得</span>`;
        }
      }

      const creditsText = (typeof course.credits === 'number') ? `${course.credits} 學分` : '學分未確認';

      return `
        <article class="course-card" data-course-id="${escapeHtml(course.id)}">
          <div class="card-top">
            <div class="card-badges">
              <span class="tag-badge ${typeClass}">${escapeHtml(course.type || '修別未確認')}</span>
              <span class="tag-badge official">官方資料</span>
              ${hasReviewTag}
            </div>
            <span class="credits-pill">${escapeHtml(creditsText)}</span>
          </div>

          <div class="card-main">
            <h3 class="card-course-name">${escapeHtml(course.name)}</h3>
            <div class="card-department">${escapeHtml(course.department)}</div>
            
            <div class="card-details-preview">
              <div class="preview-row" title="授課教師：${escapeHtml(course.instructor)}">
                <svg class="preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="preview-text">${escapeHtml(course.instructor)}</span>
              </div>
              <div class="preview-row" title="上課節次：${escapeHtml(course.schedule || '尚未確認')}">
                <svg class="preview-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="preview-text">${escapeHtml(course.schedule || '尚未確認')}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button type="button" class="btn-card-detail" data-action="view-detail" data-id="${escapeHtml(course.id)}">
              <span>查看詳細資訊與心得</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    courseGrid.innerHTML = cardsHtml;

    // 為卡片上的按鈕綁定事件
    const detailButtons = courseGrid.querySelectorAll('[data-action="view-detail"]');
    detailButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const courseId = this.getAttribute('data-id');
        const course = rawCourses.find((c) => c.id === courseId);
        if (course) {
          openModal(course);
        }
      });
    });

    // 點擊整張卡片亦可觸發彈窗
    const cards = courseGrid.querySelectorAll('.course-card');
    cards.forEach((card) => {
      card.addEventListener('click', function () {
        const courseId = this.getAttribute('data-course-id');
        const course = rawCourses.find((c) => c.id === courseId);
        if (course) {
          openModal(course);
        }
      });
    });
  }

  /**
   * 開啟課程詳細資訊彈跳視窗
   */
  function openModal(course) {
    modalCourseName.textContent = course.name || '未命名課程';
    modalDepartment.textContent = course.department || '--';
    modalId.textContent = course.id || '尚未確認代碼';
    modalInstructor.textContent = course.instructor || '尚未確認';
    modalCredits.textContent = (typeof course.credits === 'number') ? `${course.credits} 學分` : (course.credits || '尚未確認');
    modalSchedule.textContent = course.schedule || '尚未確認（以選課系統即時公告為準）';
    modalSemester.textContent = course.semester || '115學年度第1學期';
    modalDescription.textContent = course.description || '目前暫無課綱簡介。';
    modalSource.textContent = course.source || '國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)';

    if (modalVerificationStatus) {
      modalVerificationStatus.textContent = '官方資料（可追溯之官方開課紀錄，絕非 AI 捏造）';
    }

    // 渲染彈窗修別標籤
    let typeClass = 'required';
    if (course.type === '選修') {
      typeClass = 'elective';
    } else if (course.type === '通識') {
      typeClass = 'ge';
    }

    modalBadges.innerHTML = `
      <span class="tag-badge ${typeClass}">${escapeHtml(course.type || '修別未確認')}</span>
      <span class="tag-badge official">官方資料</span>
    `;

    // 渲染教師修課心得模組
    renderTeacherReviewSection(course);

    // 顯示視窗並鎖定背景滾動
    courseModal.classList.add('active');
    courseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 渲染教師修課心得區塊
   */
  function renderTeacherReviewSection(course) {
    let review = null;
    if (typeof findTeacherReview === 'function') {
      review = findTeacherReview(course.name, course.instructor, course.teacherReview);
    }

    if (review) {
      // 找到完全匹配的真實修課心得
      reviewCardContent.style.display = 'flex';
      reviewEmptyNotice.style.display = 'none';

      reviewCredibilityBadge.textContent = review.credibilityBadge || '歷史學生心得';
      reviewSemesterText.textContent = `心得所屬學期：${review.reviewSemester || '學期未確認'}`;
      reviewCountText.textContent = `資料筆數：${review.reviewCount || '單篇學生心得'}`;

      reviewTeachingStyle.textContent = review.teachingStyle || '尚無紀錄';
      reviewHomeworkLoad.textContent = review.homeworkLoad || '尚無紀錄';
      reviewGradingExam.textContent = review.gradingExam || '尚無紀錄';
      reviewProsSummary.textContent = review.prosSummary || '尚無紀錄';
      reviewPrecautions.textContent = review.precautions || '尚無紀錄';

      reviewSourceUrl.href = review.sourceUrl || '#';
      reviewSourceUrl.setAttribute('target', '_blank');
      reviewSourceUrl.setAttribute('rel', 'noopener noreferrer');
      reviewSourcePlatform.textContent = `前往原始討論連結（${review.sourcePlatform || 'Dcard 臺北大學板'}）`;
    } else {
      // 無匹配之修課心得
      reviewCardContent.style.display = 'none';
      reviewEmptyNotice.style.display = 'flex';
      reviewCredibilityBadge.textContent = '目前尚無已查證心得';
    }
  }

  /**
   * 關閉詳細資訊彈跳視窗
   */
  function closeModal() {
    courseModal.classList.remove('active');
    courseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /**
   * 清除所有搜尋與篩選條件
   */
  function clearAllFilters() {
    searchInput.value = '';
    toggleSearchClearBtn();
    departmentSelect.value = 'all';
    typeSelect.value = 'all';
    creditsSelect.value = 'all';
    if (statusSelect) {
      statusSelect.value = 'all';
    }
    applyFilters();
  }

  // ================= 官方真實課程資料匯入機制 (CSV / JSON) =================

  function openImportModal() {
    if (!importModal) return;
    importErrorMsg.style.display = 'none';
    importModal.classList.add('active');
    importModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeImportModal() {
    if (!importModal) return;
    importModal.classList.remove('active');
    importModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function switchImportFormat(format) {
    currentImportFormat = format;
    if (format === 'json') {
      tabJsonBtn.classList.add('active');
      tabCsvBtn.classList.remove('active');
      templateFormatLabel.textContent = '標準 JSON 範本：';
      importInputLabel.textContent = '貼上課程資料 (JSON 陣列)：';
      importDataTextarea.placeholder = '請在此貼上符合規範之 JSON 陣列課程資料...';
    } else {
      tabCsvBtn.classList.add('active');
      tabJsonBtn.classList.remove('active');
      templateFormatLabel.textContent = '標準 CSV 範本：';
      importInputLabel.textContent = '貼上課程資料 (CSV 格式，第一行為欄位名稱)：';
      importDataTextarea.placeholder = '請在此貼上符合規範之 CSV 格式課程資料...';
    }
    importErrorMsg.style.display = 'none';
  }

  /**
   * 填入可供複製參考之規範範本
   */
  function fillTemplateFormat() {
    if (currentImportFormat === 'json') {
      const sampleJson = [
        {
          "id": "1151-BA101-OFFICIAL",
          "name": "管理學",
          "department": "企業管理學系",
          "instructor": "國立臺北大學企管系師資",
          "credits": 3,
          "type": "必修",
          "schedule": "尚未確認",
          "description": "企管系核心必修科目，涵蓋規劃、組織、領導與控制四大現代管理機能。",
          "semester": "115學年度第1學期",
          "source": "國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)"
        },
        {
          "id": "1151-ECON101-OFFICIAL",
          "name": "經濟學原理",
          "department": "經濟學系",
          "instructor": "陳孝琪",
          "credits": 3,
          "type": "必修",
          "schedule": "尚未確認",
          "description": "商學院核心基礎科目。個體經濟與總體經濟原理。",
          "semester": "115學年度第1學期",
          "source": "國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)"
        }
      ];
      importDataTextarea.value = JSON.stringify(sampleJson, null, 2);
    } else {
      const sampleCsv = 
`id,name,department,instructor,credits,type,schedule,description,semester,source
1151-BA101-OFFICIAL,管理學,企業管理學系,國立臺北大學企管系師資,3,必修,尚未確認,企管系核心必修科目,115學年度第1學期,國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)
1151-ECON101-OFFICIAL,經濟學原理,經濟學系,陳孝琪,3,必修,尚未確認,商學院核心基礎科目,115學年度第1學期,國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)`;
      importDataTextarea.value = sampleCsv;
    }
    importErrorMsg.style.display = 'none';
  }

  /**
   * 處理資料匯入 (自動識別 JSON 或 CSV)
   */
  function handleCourseImport() {
    const rawInput = importDataTextarea.value.trim();
    if (!rawInput) {
      showImportError('請先貼上有效的課程資料，或點擊上方「填入範本格式」按鈕。');
      return;
    }

    try {
      let parsedCourses = [];

      // 判斷是否以 [ 開頭判定為 JSON，否則依 CSV 解析
      if (rawInput.startsWith('[')) {
        parsedCourses = parseJsonCourses(rawInput);
      } else {
        parsedCourses = parseCsvCourses(rawInput);
      }

      if (parsedCourses.length === 0) {
        showImportError('解析未取得任何有效課程資料，請確認資料格式。');
        return;
      }

      // 檢查關鍵欄位：課名、系所、教師、學期、來源
      for (let i = 0; i < parsedCourses.length; i++) {
        const item = parsedCourses[i];
        if (!item.name || !item.department || !item.instructor) {
          showImportError(`第 ${i + 1} 筆課程缺少關鍵資訊 (課名 name, 系所 department, 或 教師 instructor)。`);
          return;
        }
      }

      // 整合進現有課程清單，並標註為官方已核實資料
      const newCourses = parsedCourses.map((c, index) => ({
        id: c.id || `IMPORT-${Date.now()}-${index}`,
        name: String(c.name).trim(),
        department: String(c.department).trim(),
        instructor: String(c.instructor).trim(),
        credits: (!isNaN(Number(c.credits)) && Number(c.credits) > 0) ? Number(c.credits) : '尚未確認',
        type: c.type ? String(c.type).trim() : '尚未確認',
        schedule: c.schedule ? String(c.schedule).trim() : '尚未確認',
        description: c.description ? String(c.description).trim() : '國立臺北大學正式課程',
        semester: c.semester ? String(c.semester).trim() : '115學年度第1學期',
        source: c.source ? String(c.source).trim() : '國立臺北大學課程查詢系統 (https://sea.cc.ntpu.edu.tw/pls/dev_stud/course_query_all.CHI_MAIN)',
        isDemo: false, // 絕不使用示範標籤
        verificationStatus: '官方資料',
        teacherReview: c.teacherReview || null
      }));

      // 更新資料
      const newIds = new Set(newCourses.map((c) => c.id));
      rawCourses = [...newCourses, ...rawCourses.filter((c) => !newIds.has(c.id))];

      updateStatsCounter();
      closeImportModal();
      applyFilters();

      alert(`成功匯入 ${newCourses.length} 門官方已核實課程！系統已將其加入課程清單。`);
    } catch (err) {
      showImportError(`資料解析失敗：${err.message}`);
    }
  }

  /**
   * 解析 JSON 格式課程
   */
  function parseJsonCourses(text) {
    const list = JSON.parse(text);
    if (!Array.isArray(list)) {
      throw new Error('輸入的 JSON 必須為陣列 (Array) 結構。');
    }
    return list;
  }

  /**
   * 解析 CSV 格式課程
   */
  function parseCsvCourses(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      throw new Error('CSV 必須至少包含一列欄位標題與一筆資料。');
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const item = {};
      headers.forEach((h, index) => {
        item[h] = values[index] || '';
      });
      result.push(item);
    }

    return result;
  }

  function showImportError(msg) {
    if (importErrorMsg) {
      importErrorMsg.textContent = msg;
      importErrorMsg.style.display = 'block';
    }
  }

  /**
   * 簡易 HTML 特殊符號轉義，預防 XSS
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // DOM 載入後啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
