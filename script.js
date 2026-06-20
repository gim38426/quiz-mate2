/* ==========================================================================
   QuizMate CSS Design System & Layout
   - Clean, modern, responsive design optimized for college students.
   - Primary: Indigo & Violet gradient accents.
   - Core layouts: Mobile-first Flexbox and CSS Grid.
   ========================================================================== */
/* 1. 디자인 시스템 토큰 정의 */
:root {
  /* 테마 색상 */
  --primary-color: #4f46e5;       /* Indigo */
  --primary-hover: #4338ca;
  --primary-light: #e0e7ff;
  --secondary-color: #7c3aed;     /* Violet */
  --secondary-hover: #6d28d9;
  --accent-color: #06b6d4;        /* Cyan */
  
  /* 상태 색상 */
  --success-color: #10b981;       /* Emerald Green */
  --success-bg: #ecfdf5;
  --success-border: #a7f3d0;
  --error-color: #ef4444;         /* Red */
  --error-bg: #fef2f2;
  --error-border: #fca5a5;
  
  /* 중성색 (Grayscale) */
  --bg-color: #f1f5f9;            /* Cool Gray 100 */
  --card-bg: #ffffff;
  --text-main: #0f172a;           /* Slate 900 */
  --text-muted: #475569;          /* Slate 600 */
  --text-light: #94a3b8;          /* Slate 400 */
  --border-color: #e2e8f0;        /* Slate 200 */
  --input-focus-border: #818cf8;  /* Light Indigo */
  
  /* 레이아웃 & 효과 */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.25s ease-in-out;
}
/* 2. 기본 브라우저 초기화 및 폰트 세팅 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}
body {
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.6;
  font-size: 16px;
  padding: 20px 10px;
  min-height: 100vh;
}
/* 3. 앱 레이아웃 컨테이너 */
.app-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
/* 4. 헤더 영역 스타일 */
.main-header {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: var(--radius-md);
  color: #ffffff;
  box-shadow: var(--shadow-md);
}
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}
.logo-icon {
  font-size: 2rem;
  animation: pulse 2s infinite;
}
.logo-text {
  font-family: 'Outfit', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.05em;
}
.logo-sub {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.8;
  vertical-align: middle;
}
.header-desc {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto;
  font-weight: 300;
}
/* 5. 카드 UI 컴포넌트 */
.card {
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  display: none; /* 기본적으로 숨기고 .active 클래스로 노출 */
  overflow: hidden;
}
.card.active {
  display: block;
  animation: fadeIn 0.4s ease-out;
}
.card:hover {
  box-shadow: var(--shadow-md);
}
.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}
.step-badge {
  font-size: 0.75rem;
  font-weight: 700;
  background-color: var(--primary-light);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: uppercase;
}
.play-badge {
  background-color: #fef3c7;
  color: #d97706;
}
.result-badge {
  background-color: #d1fae5;
  color: #059669;
}
.card-body {
  padding: 24px;
}
/* 6. 폼 컨트롤 및 입력란 */
.form-group {
  margin-bottom: 20px;
}
.form-group:last-child {
  margin-bottom: 0;
}
.label-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
label {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
}
.required {
  color: var(--error-color);
  margin-left: 2px;
}
.helper-text {
  font-size: 0.8rem;
  color: var(--text-light);
}
input[type="text"],
textarea,
select {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-main);
  background-color: #ffffff;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}
textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
/* 커스텀 셀렉트 화살표 지원 */
.custom-select-wrapper {
  position: relative;
}
/* 7. 버튼 컴포넌트 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  gap: 8px;
  text-decoration: none;
}
.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-secondary {
  background-color: var(--primary-light);
  color: var(--primary-color);
}
.btn-secondary:hover {
  background-color: #c7d2fe;
}
.btn-danger {
  background-color: var(--error-bg);
  color: var(--error-color);
  border: 1px solid var(--error-border);
}
.btn-danger:hover {
  background-color: #fee2e2;
}
.btn-indigo {
  background-color: var(--primary-color);
  color: #ffffff;
}
.btn-indigo:hover {
  background-color: var(--primary-hover);
}
.btn-block {
  display: flex;
  width: 100%;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 6px;
}
.float-right {
  float: right;
}
/* 8. 퀴즈 화면 레이아웃 */
.quiz-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.quiz-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.subject-badge {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #f1f5f9;
  color: var(--text-muted);
  padding: 2px 8px;
  border-radius: 4px;
}
/* 진행률 표시줄 */
.progress-container {
  height: 6px;
  background-color: var(--border-color);
  position: relative;
  width: 100%;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  width: 0%;
  transition: width 0.3s ease;
}
/* 문제 텍스트 및 안내 */
.question-container {
  margin-bottom: 24px;
  padding: 16px 0;
}
.question-type-indicator {
  margin-bottom: 8px;
}
.type-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--secondary-color);
  background-color: #f5f3ff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd6fe;
}
.question-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.6;
}
/* 퀴즈 공통 빈칸 스타일 */
.quiz-blank {
  display: inline-block;
  min-width: 80px;
  border-bottom: 2px solid var(--primary-color);
  margin: 0 4px;
  text-align: center;
  color: var(--primary-color);
  font-weight: 700;
}
/* 객관식 보기 버튼 그리드 */
.choice-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.choice-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px 20px;
  background-color: #ffffff;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
  outline: none;
}
.choice-btn:hover {
  background-color: #faf5ff;
  border-color: #c7d2fe;
}
.choice-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: #f1f5f9;
  border-radius: 50%;
  margin-right: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: background-color var(--transition-fast), color var(--transition-fast);
  flex-shrink: 0;
}
.choice-btn:hover .choice-num {
  background-color: var(--primary-light);
  color: var(--primary-color);
}
.choice-text {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-main);
}
/* 객관식 선택 시 상태 */
.choice-btn.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}
.choice-btn.selected .choice-num {
  background-color: var(--primary-color);
  color: #ffffff;
}
/* 정답/오답 확인 상태 피드백 */
.choice-btn.correct {
  border-color: var(--success-color) !important;
  background-color: var(--success-bg) !important;
}
.choice-btn.correct .choice-num {
  background-color: var(--success-color) !important;
  color: #ffffff !important;
}
.choice-btn.incorrect {
  border-color: var(--error-color) !important;
  background-color: var(--error-bg) !important;
}
.choice-btn.incorrect .choice-num {
  background-color: var(--error-color) !important;
  color: #ffffff !important;
}
/* OX 버튼 그리드 */
.ox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ox-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background-color: #ffffff;
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}
.ox-btn:hover {
  background-color: #f8fafc;
  border-color: var(--primary-light);
}
.ox-icon {
  font-size: 3rem;
  margin-bottom: 8px;
}
.ox-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-muted);
}
.ox-btn.selected.btn-o {
  background-color: #ecfdf5;
  border-color: var(--success-color);
}
.ox-btn.selected.btn-o .ox-text {
  color: var(--success-color);
}
.ox-btn.selected.btn-x {
  background-color: #fef2f2;
  border-color: var(--error-color);
}
.ox-btn.selected.btn-x .ox-text {
  color: var(--error-color);
}
.ox-btn.correct {
  border-color: var(--success-color) !important;
  background-color: var(--success-bg) !important;
}
.ox-btn.incorrect {
  border-color: var(--error-color) !important;
  background-color: var(--error-bg) !important;
}
/* 빈칸 주관식 입력 그룹 */
.blank-input-group {
  display: flex;
  gap: 12px;
}
.blank-input-group input {
  flex: 1;
}
/* 9. 피드백 패널 (정답/오답 및 설명) */
.feedback-panel {
  margin-top: 24px;
  padding: 20px;
  border-radius: var(--radius-sm);
  border-left: 5px solid var(--border-color);
  background-color: #f8fafc;
  animation: slideDown 0.3s ease-out;
}
.feedback-panel.correct {
  background-color: var(--success-bg);
  border-left-color: var(--success-color);
  border-top: 1px solid var(--success-border);
  border-right: 1px solid var(--success-border);
  border-bottom: 1px solid var(--success-border);
}
.feedback-panel.incorrect {
  background-color: var(--error-bg);
  border-left-color: var(--error-color);
  border-top: 1px solid var(--error-border);
  border-right: 1px solid var(--error-border);
  border-bottom: 1px solid var(--error-border);
}
.feedback-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
#feedback-icon {
  font-size: 1.4rem;
}
#feedback-title {
  font-size: 1.15rem;
  font-weight: 700;
}
.feedback-panel.correct #feedback-title {
  color: var(--success-color);
}
.feedback-panel.incorrect #feedback-title {
  color: var(--error-color);
}
.feedback-content {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.explanation-box {
  margin-top: 8px;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px dashed var(--border-color);
}
.explanation-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 4px;
}
#feedback-explanation {
  color: var(--text-main);
  font-weight: 400;
  line-height: 1.5;
}
/* 10. 결과 리포트 영역 */
.text-center {
  text-align: center;
}
.result-summary-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(var(--primary-color) 0deg, var(--border-color) 0deg);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: var(--shadow-sm);
}
.circle-inner {
  width: 120px;
  height: 120px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#result-percentage {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
}
.circle-label {
  font-size: 0.75rem;
  color: var(--text-light);
  font-weight: 600;
}
.result-message {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-main);
}
/* 통계 그리드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}
.stat-card {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
}
.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.correct-stat {
  border-color: var(--success-border);
}
.correct-stat .stat-num {
  color: var(--success-color);
}
.wrong-stat {
  border-color: var(--error-border);
}
.wrong-stat .stat-num {
  color: var(--error-color);
}
.score-stat {
  grid-column: span 2;
  background: linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%);
  border-color: #c7d2fe;
}
.score-stat .stat-num {
  color: var(--primary-color);
  font-size: 1.8rem;
}
.result-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
/* 11. 오답노트 영역 */
.wrong-answers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.count-badge {
  background-color: var(--error-color);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-select {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 6px;
  width: auto;
  min-width: 130px;
}
.wrong-section-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}
/* 오답 목록 */
.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.wrong-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background-color: #ffffff;
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
  animation: fadeIn 0.3s ease-out;
}
.wrong-item:hover {
  box-shadow: var(--shadow-sm);
}
.wrong-item-header {
  padding: 14px 16px;
  background-color: #fafafa;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-subject-badge {
  font-size: 0.75rem;
  font-weight: 700;
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 2px 8px;
  border-radius: 4px;
}
.btn-delete-item {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-light);
  padding: 4px;
  border-radius: 4px;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}
.btn-delete-item:hover {
  color: var(--error-color);
  background-color: #fee2e2;
}
.wrong-item-body {
  padding: 16px;
}
.wrong-question-text {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
  margin-bottom: 12px;
  line-height: 1.5;
}
.answers-comparison {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--border-color);
}
.ans-comp-row {
  display: flex;
  font-size: 0.85rem;
}
.ans-comp-label {
  width: 90px;
  color: var(--text-light);
  font-weight: 600;
}
.ans-comp-val {
  font-weight: 600;
}
.ans-comp-val.wrong {
  color: var(--error-color);
}
.ans-comp-val.correct {
  color: var(--success-color);
}
.wrong-explanation {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}
.wrong-explanation-label {
  display: block;
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 2px;
}
/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-light);
}
.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 12px;
}
/* 12. 푸터 스타일 */
.main-footer {
  text-align: center;
  padding: 24px 16px;
  color: var(--text-light);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.footer-note {
  font-size: 0.75rem;
  opacity: 0.8;
}
/* 13. 애니메이션 효과 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
/* 14. 반응형 미디어 쿼리 (모바일 지원) */
@media (max-width: 640px) {
  body {
    padding: 12px 6px;
  }
  
  .app-container {
    gap: 16px;
  }
  
  .main-header {
    padding: 16px 12px;
  }
  
  .logo-text {
    font-size: 1.8rem;
  }
  
  .logo-sub {
    font-size: 1rem;
  }
  
  .header-desc {
    font-size: 0.9rem;
  }
  
  .card-header {
    padding: 16px 20px;
  }
  
  .card-body {
    padding: 20px 16px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .choice-btn {
    padding: 12px 16px;
  }
  
  .ox-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .ox-btn {
    padding: 20px;
  }
  
  .result-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .result-buttons .btn {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .score-stat {
    grid-column: span 1;
  }
  
  .wrong-answers-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
}

