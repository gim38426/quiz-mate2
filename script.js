/**
 * ==========================================================================
 * QuizMate - Core JavaScript Logic
 * - 1. DOM Elements & State Management
 * - 2. Natural Language Processing (NLP) heuristics (Sentence splitting & Keyword extraction)
 * - 3. Quiz Generation Engine (Multiple Choice, OX, Fill-in-the-Blank)
 * - 4. Navigation & Interactive Scoring Flow
 * - 5. Incorrect Answer Note (오답노트) & LocalStorage Sync
 * ==========================================================================
 */
// --------------------------------------------------------------------------
// 1. 상태(State) 및 DOM 요소 정의
// --------------------------------------------------------------------------
const state = {
  subject: '',
  notes: '',
  quizType: 'mixed',
  requestCount: 3,
  questions: [],      // 생성된 문제 배열
  currentIndex: 0,    // 현재 풀이 중인 문제 인덱스
  score: 0,           // 맞힌 개수
  wrongAnswersList: [] // 오답 목록
};
// DOM 요소 캐싱
const els = {
  // 섹션
  configSection: document.getElementById('config-section'),
  quizSection: document.getElementById('quiz-section'),
  resultSection: document.getElementById('result-section'),
  wrongAnswersSection: document.getElementById('wrong-answers-section'),
  // 폼 및 설정
  configForm: document.getElementById('quiz-config-form'),
  subjectInput: document.getElementById('subject-name'),
  studyNotesInput: document.getElementById('study-notes'),
  charCounter: document.getElementById('char-counter'),
  quizTypeSelect: document.getElementById('quiz-type'),
  questionCountSelect: document.getElementById('question-count'),
  generateBtn: document.getElementById('generate-btn'),
  // 퀴즈 화면
  quizSubjectBadge: document.getElementById('quiz-subject-badge'),
  questionNumber: document.getElementById('question-number'),
  progressBar: document.getElementById('quiz-progress-bar'),
  questionTypeText: document.getElementById('question-type-text'),
  questionText: document.getElementById('question-text'),
  choiceAnswersArea: document.getElementById('choice-answers-area'),
  oxAnswersArea: document.getElementById('ox-answers-area'),
  blankAnswersArea: document.getElementById('blank-answers-area'),
  blankInput: document.getElementById('blank-input'),
  submitBlankBtn: document.getElementById('submit-blank-btn'),
  // 피드백 패널
  feedbackPanel: document.getElementById('feedback-panel'),
  feedbackIcon: document.getElementById('feedback-icon'),
  feedbackTitle: document.getElementById('feedback-title'),
  feedbackUserAns: document.getElementById('feedback-user-ans'),
  feedbackCorrectAns: document.getElementById('feedback-correct-ans'),
  feedbackExplanation: document.getElementById('feedback-explanation'),
  nextBtn: document.getElementById('next-btn'),
  nextBtnText: document.getElementById('next-btn-text'),
  // 결과 화면
  resultPercentage: document.getElementById('result-percentage'),
  resultCircle: document.querySelector('.result-summary-circle'),
  resultMessage: document.getElementById('result-score-message'),
  statTotal: document.getElementById('stat-total'),
  statCorrect: document.getElementById('stat-correct'),
  statWrong: document.getElementById('stat-wrong'),
  statPoints: document.getElementById('stat-points'),
  restartBtn: document.getElementById('restart-btn'),
  newQuizBtn: document.getElementById('new-quiz-btn'),
  // 오답노트 화면
  wrongCountBadge: document.getElementById('wrong-count-badge'),
  filterSubject: document.getElementById('filter-subject'),
  clearAllWrongBtn: document.getElementById('clear-all-wrong-btn'),
  wrongListContainer: document.getElementById('wrong-list-container')
};
// 학술/기술 관련 더미 오답 풀 (텍스트에서 키워드 추출이 부족할 때 예비용으로 활용)
const FALLBACK_DISTRACTORS = [
  "개념", "이론", "원리", "시스템", "구조", "프로세스", "상호작용", "데이터", 
  "네트워크", "알고리즘", "인프라", "아키텍처", "프레임워크", "방법론", "프로토콜"
];
// --------------------------------------------------------------------------
// 2. 한국어 형태 분석 규칙 및 자연어 처리(NLP) 휴리스틱
// --------------------------------------------------------------------------
/**
 * 입력된 텍스트를 문장 단위로 분할합니다.
 * - 온점(.), 물음표(?), 느낌표(!) 및 줄바꿈(\n)을 기준으로 나눕니다.
 */
function splitTextIntoSentences(text) {
  if (!text) return [];
  // 문장 기호 및 공백, 줄바꿈을 포함하여 정규식 분할
  const rawSentences = text.split(/[.!?](?:\s+|$)+|\n+/);
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length >= 8); // 지나치게 짧은 문장은 문제 출제에서 제외
}
/**
 * 한국어 조사 및 동사/형용사 접미사를 정규식으로 지워 명사/키워드 형태를 반환합니다.
 * 예: "자바스크립트는" -> "자바스크립트", "서울이다" -> "서울"
 */
function cleanKoreanKeyword(word) {
  // 단어 뒤에 붙는 한국어 문법 조사(조사/접미사) 패턴 정의
  const particles = /(은|는|이|가|을|를|의|에|와|과|로|으로|에서|도|만|이다|였다|이고|하며|하여|합니다|입니다)$/;
  let cleaned = word.trim();
  
  // 단어가 완전히 비어버리지 않는 선에서 조사 제거 반복
  let prev;
  do {
    prev = cleaned;
    cleaned = cleaned.replace(particles, '');
  } while (cleaned !== prev && cleaned.length > 1);
  // 문장부호 제거 (쉼표, 따옴표 등)
  cleaned = cleaned.replace(/['"`,.!?]/g, '');
  return cleaned.trim();
}
/**
 * 단어가 키워드로 적합한지 평가하고 가중치 점수를 부여합니다.
 */
function getKeywordScore(word, cleanedKeyword) {
  // 너무 짧은 키워드(1글자 이하) 및 너무 긴 키워드는 제외
  if (cleanedKeyword.length <= 1 || cleanedKeyword.length > 8) return 0;
  
  // 무의미한 지시 대명사나 접속부사 스킵 리스트 (Stop Words)
  const stopWords = ["이것", "저것", "그것", "또한", "그리고", "따라서", "때문에", "통해", "의해", "위해", "매우", "가장", "어떤", "어떻게"];
  if (stopWords.includes(cleanedKeyword)) return 0;
  // 숫자가 포함된 경우 연도나 통계 수치이므로 유용할 수 있어 기본 점수 부여
  let score = cleanedKeyword.length; // 기본 길이에 따른 점수
  // 영문/숫자 혼합(예: HTML, CSS, CPU 등 기술 용어)일 경우 우선권 부여
  if (/[a-zA-Z0-9]/.test(cleanedKeyword)) {
    score += 3;
  }
  return score;
}
/**
 * 단일 문장에서 가장 핵심이 되는 단어(키워드) 정보를 추출합니다.
 */
function extractBestKeywordFromSentence(sentence) {
  // 공백 기준으로 단어 분할
  const words = sentence.split(/\s+/);
  let bestWord = null;
  let bestCleaned = '';
  let maxScore = 0;
  for (const word of words) {
    const cleaned = cleanKoreanKeyword(word);
    const score = getKeywordScore(word, cleaned);
    
    // 이 문장 내에서 키워드 매칭 여부 재확인
    if (score > maxScore && sentence.includes(cleaned)) {
      maxScore = score;
      bestWord = word;
      bestCleaned = cleaned;
    }
  }
  if (maxScore > 0) {
    return {
      originalWord: bestWord, // 텍스트 상의 어절 (예: "자바스크립트는")
      keyword: bestCleaned    // 조사 제거된 키워드 (예: "자바스크립트")
    };
  }
  return null;
}
// --------------------------------------------------------------------------
// 3. 퀴즈 생성 엔진 (Quiz Generation Engine)
// --------------------------------------------------------------------------
/**
 * 추출된 전체 키워드 풀에서 정답을 제외한 중복 없는 오답 보기(Distractors)를 생성합니다.
 */
function generateDistractors(correctAnswer, allKeywords, count = 3) {
  // 정답을 제외하고 고유한 키워드 필터링
  let candidates = allKeywords.filter(k => k !== correctAnswer && k.length > 1);
  candidates = [...new Set(candidates)];
  // 후보군이 부족한 경우 예비용 단어 풀에서 무작위 추가
  const shuffledFallback = [...FALLBACK_DISTRACTORS].sort(() => 0.5 - Math.random());
  while (candidates.length < count) {
    const extra = shuffledFallback.pop();
    if (!candidates.includes(extra) && extra !== correctAnswer) {
      candidates.push(extra);
    }
  }
  // 무작위로 섞어서 필요한 개수만큼 리턴
  return candidates.sort(() => 0.5 - Math.random()).slice(0, count);
}
/**
 * 학습 텍스트 전체를 분석하여 지정된 조건에 맞는 문제들을 출제합니다.
 */
function generateQuiz(subject, text, type, count) {
  const sentences = splitTextIntoSentences(text);
  if (sentences.length === 0) {
    throw new Error("분석할 수 있는 문장이 없습니다. 텍스트를 더 길게 입력해 주세요.");
  }
  // 1. 문장별로 핵심 단어 추출 시도
  const sentenceDataList = [];
  const allKeywords = [];
  sentences.forEach(sentence => {
    const kwData = extractBestKeywordFromSentence(sentence);
    if (kwData) {
      sentenceDataList.push({
        sentence: sentence,
        keyword: kwData.keyword,
        originalWord: kwData.originalWord
      });
      allKeywords.push(kwData.keyword);
    }
  });
  if (sentenceDataList.length === 0) {
    throw new Error("학습 내용에서 핵심 키워드를 추출하지 못했습니다. 더 많은 명사나 개념을 포함해 보세요.");
  }
  // 2. 문제 수 결정 (요청량과 가용 문장 수 중 최솟값)
  const actualCount = Math.min(count, sentenceDataList.length);
  
  // 무작위 순서로 섞은 문장 리스트에서 문제 수만큼 추출
  const selectedSentences = sentenceDataList
    .sort(() => 0.5 - Math.random())
    .slice(0, actualCount);
  // 3. 문제 유형 설정 및 빌드
  const questions = selectedSentences.map((data, idx) => {
    // 문제별 개별 유형 결정 (혼합형일 경우 순환 배치)
    let qType = type;
    if (type === 'mixed') {
      const types = ['choice', 'ox', 'blank'];
      qType = types[idx % types.length];
    }
    if (qType === 'choice') {
      // 1) 객관식 문제
      const distractors = generateDistractors(data.keyword, allKeywords, 3);
      const options = [data.keyword, ...distractors].sort(() => 0.5 - Math.random());
      
      // 원래 문장에서 키워드 부위를 빈칸 표기로 치환
      const questionText = data.sentence.replace(data.keyword, " [  ] ");
      return {
        type: 'choice',
        text: questionText,
        options: options,
        correctAnswer: data.keyword,
        explanation: `원본 내용: "${data.sentence}"`
      };
    } else if (qType === 'ox') {
      // 2) OX 진위형 문제
      const isTrue = Math.random() > 0.5;
      
      if (isTrue) {
        return {
          type: 'ox',
          text: `다음 설명이 맞는지 판단하세요:\n"${data.sentence}"`,
          correctAnswer: 'O',
          explanation: `올바른 설명입니다. 원본 내용: "${data.sentence}"`
        };
      } else {
        // 거짓 문장 생성: 키워드를 다른 추출된 단어 또는 더미로 치환
        const swapKeyword = generateDistractors(data.keyword, allKeywords, 1)[0];
        // 정교한 치환
        const modifiedSentence = data.sentence.replace(data.keyword, swapKeyword);
        return {
          type: 'ox',
          text: `다음 설명이 맞는지 판단하세요:\n"${modifiedSentence}"`,
          correctAnswer: 'X',
          explanation: `틀린 설명입니다. '${swapKeyword}' 대신 '${data.keyword}'(이)가 들어가야 맞습니다.\n원본 내용: "${data.sentence}"`
        };
      }
    } else {
      // 3) 빈칸 주관식 문제
      const questionText = data.sentence.replace(data.keyword, " [  ] ");
      return {
        type: 'blank',
        text: questionText,
        correctAnswer: data.keyword,
        explanation: `원본 내용: "${data.sentence}"`
      };
    }
  });
  return questions;
}
// --------------------------------------------------------------------------
// 4. 네비게이션 및 인터랙티브 퀴즈 풀이 흐름
// --------------------------------------------------------------------------
/**
 * 활성 화면(Section Card)을 제어하는 라우터 함수
 */
function navigateTo(sectionId) {
  els.configSection.classList.remove('active');
  els.quizSection.classList.remove('active');
  els.resultSection.classList.remove('active');
  
  if (sectionId === 'config') {
    els.configSection.classList.add('active');
  } else if (sectionId === 'quiz') {
    els.quizSection.classList.add('active');
  } else if (sectionId === 'result') {
    els.resultSection.classList.add('active');
  }
  // 스크롤 탑으로 복귀
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
/**
 * 퀴즈 풀이를 시작합니다.
 */
function startQuizFlow() {
  const subject = els.subjectInput.value.trim();
  const notes = els.studyNotesInput.value.trim();
  const type = els.quizTypeSelect.value;
  const count = parseInt(els.questionCountSelect.value, 10);
  // 간단한 유효성 검사
  if (!subject) {
    alert("과목명을 입력해 주세요!");
    els.subjectInput.focus();
    return;
  }
  if (!notes || notes.length < 15) {
    alert("학습 내용을 충분히 입력해 주세요. (최소 15자 이상)");
    els.studyNotesInput.focus();
    return;
  }
  try {
    const generatedQuestions = generateQuiz(subject, notes, type, count);
    
    // 엔진 상태 업데이트
    state.subject = subject;
    state.notes = notes;
    state.quizType = type;
    state.requestCount = count;
    state.questions = generatedQuestions;
    state.currentIndex = 0;
    state.score = 0;
    // UI 배치
    els.quizSubjectBadge.textContent = subject;
    renderQuestion(0);
    navigateTo('quiz');
  } catch (error) {
    alert(error.message);
  }
}
/**
 * 현재 인덱스의 문제를 렌더링합니다.
 */
function renderQuestion(index) {
  const q = state.questions[index];
  const total = state.questions.length;
  // 헤더 및 프로그레스바 설정
  els.questionNumber.textContent = `문제 ${index + 1} / ${total}`;
  const progressPercent = ((index) / total) * 100;
  els.progressBar.style.width = `${progressPercent}%`;
  // 피드백 패널 및 입력 영역 초기화
  els.feedbackPanel.style.display = 'none';
  els.feedbackPanel.className = 'feedback-panel';
  els.blankInput.value = '';
  els.blankInput.disabled = false;
  els.submitBlankBtn.disabled = false;
  // 다음 버튼 텍스트 조절
  if (index === total - 1) {
    els.nextBtnText.textContent = "결과 확인하기";
  } else {
    els.nextBtnText.textContent = "다음 문제";
  }
  // 1) 문제 유형 뱃지 텍스트 표기
  if (q.type === 'choice') {
    els.questionTypeText.textContent = '객관식 (4지선다)';
    els.questionTypeText.className = 'type-badge';
  } else if (q.type === 'ox') {
    els.questionTypeText.textContent = 'OX 진위형';
    els.questionTypeText.className = 'type-badge';
  } else {
    els.questionTypeText.textContent = '빈칸 주관식';
    els.questionTypeText.className = 'type-badge';
  }
  // 2) 문제 지문 세팅
  // 빈칸 디자인 적용 ( [  ] 표기를 html 템플릿으로 변환하여 시각적 효과 배가)
  const formattedText = q.text.replace(/\[\s*\]/g, '<span class="quiz-blank">?</span>');
  els.questionText.innerHTML = formattedText;
  // 3) 답변 컨트롤 보이기/숨기기 및 리스너 등록
  els.choiceAnswersArea.style.display = 'none';
  els.oxAnswersArea.style.display = 'none';
  els.blankAnswersArea.style.display = 'none';
  if (q.type === 'choice') {
    els.choiceAnswersArea.style.display = 'block';
    const buttons = els.choiceAnswersArea.querySelectorAll('.choice-btn');
    buttons.forEach((btn, idx) => {
      btn.className = 'choice-btn'; // 클래스 초기화
      const textSpan = btn.querySelector('.choice-text');
      textSpan.textContent = q.options[idx];
      btn.disabled = false;
      
      // 클릭 시 답안 검증 이벤트
      btn.onclick = () => submitAnswer(q.options[idx], btn);
    });
  } else if (q.type === 'ox') {
    els.oxAnswersArea.style.display = 'block';
    const buttons = els.oxAnswersArea.querySelectorAll('.ox-btn');
    buttons.forEach(btn => {
      btn.className = `ox-btn ${btn.classList.contains('btn-o') ? 'btn-o' : 'btn-x'}`;
      btn.disabled = false;
      
      // 클릭 시 답안 검증 이벤트
      const val = btn.getAttribute('data-value');
      btn.onclick = () => submitAnswer(val, btn);
    });
  } else if (q.type === 'blank') {
    els.blankAnswersArea.style.display = 'block';
    // 엔터키 지원
    els.blankInput.onkeypress = (e) => {
      if (e.key === 'Enter') {
        event.preventDefault();
        handleBlankSubmit();
      }
    };
    els.submitBlankBtn.onclick = handleBlankSubmit;
  }
}
/**
 * 빈칸 주관식 답안 제출 처리
 */
function handleBlankSubmit() {
  const userVal = els.blankInput.value.trim();
  if (!userVal) {
    alert("답안을 입력해 주세요!");
    els.blankInput.focus();
    return;
  }
  els.blankInput.disabled = true;
  els.submitBlankBtn.disabled = true;
  submitAnswer(userVal, null);
}
/**
 * 사용자가 선택한 정답 여부를 판단하고 화면에 피드백을 노출합니다.
 */
function submitAnswer(userAnswer, targetButton) {
  const currentQ = state.questions[state.currentIndex];
  let isCorrect = false;
  // 모든 동종 입력 비활성화 처리
  disableCurrentControls();
  // 대소문자 및 띄어쓰기 트리밍하여 주관식 답안 비교 편의성 향상
  const normalizedUser = userAnswer.toLowerCase().replace(/\s+/g, '');
  const normalizedCorrect = currentQ.correctAnswer.toLowerCase().replace(/\s+/g, '');
  if (normalizedUser === normalizedCorrect) {
    isCorrect = true;
    state.score++;
  }
  // 1) 입력 컴포넌트 시각적 상태 업데이트 (정답/오답 하이라이트)
  if (currentQ.type === 'choice') {
    const buttons = els.choiceAnswersArea.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      const btnText = btn.querySelector('.choice-text').textContent;
      if (btnText === currentQ.correctAnswer) {
        btn.classList.add('correct'); // 실제 정답 표시
      }
      if (btn === targetButton && !isCorrect) {
        btn.classList.add('incorrect'); // 사용자가 틀린 것 표시
      }
    });
  } else if (currentQ.type === 'ox') {
    const buttons = els.oxAnswersArea.querySelectorAll('.ox-btn');
    buttons.forEach(btn => {
      const val = btn.getAttribute('data-value');
      if (val === currentQ.correctAnswer) {
        btn.classList.add('correct');
      }
      if (btn === targetButton && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });
  } else if (currentQ.type === 'blank') {
    if (isCorrect) {
      els.blankInput.classList.add('correct');
    } else {
      els.blankInput.classList.add('incorrect');
    }
  }
  // 2) 피드백 패널 내용 삽입 및 렌더링
  if (isCorrect) {
    els.feedbackIcon.textContent = '🎉';
    els.feedbackTitle.textContent = '정답입니다!';
    els.feedbackPanel.className = 'feedback-panel correct';
  } else {
    els.feedbackIcon.textContent = '😢';
    els.feedbackTitle.textContent = '아쉽게도 틀렸습니다.';
    els.feedbackPanel.className = 'feedback-panel incorrect';
    
    // 오답노트에 자동 기록 및 저장
    saveToWrongAnswers(currentQ, userAnswer);
  }
  els.feedbackUserAns.textContent = userAnswer;
  els.feedbackCorrectAns.textContent = currentQ.correctAnswer;
  els.feedbackExplanation.textContent = currentQ.explanation;
  els.feedbackPanel.style.display = 'block';
  // 피드백 패널로 자연스럽게 포커스 이동
  setTimeout(() => {
    els.feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}
/**
 * 답변 제출 후 다른 버튼들이 클릭되지 않도록 비활성화합니다.
 */
function disableCurrentControls() {
  const currentQ = state.questions[state.currentIndex];
  if (currentQ.type === 'choice') {
    const buttons = els.choiceAnswersArea.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.disabled = true);
  } else if (currentQ.type === 'ox') {
    const buttons = els.oxAnswersArea.querySelectorAll('.ox-btn');
    buttons.forEach(btn => btn.disabled = true);
  }
}
/**
 * 다음 문제로 넘어가거나 결과를 출력합니다.
 */
function handleNextQuestion() {
  state.currentIndex++;
  if (state.currentIndex < state.questions.length) {
    renderQuestion(state.currentIndex);
  } else {
    // 최종 결과 출력 화면 진입
    showQuizReport();
  }
}
/**
 * 최종 점수 리포트를 구성하고 렌더링합니다.
 */
function showQuizReport() {
  const total = state.questions.length;
  const correct = state.score;
  const wrong = total - correct;
  const percentage = Math.round((correct / total) * 100);
  // 1) 정답률 및 conic-gradient 원형 챠트 적용
  els.resultPercentage.textContent = `${percentage}%`;
  els.resultCircle.style.background = `conic-gradient(var(--primary-color) ${percentage * 3.6}deg, var(--border-color) 0deg)`;
  // 2) 점수 등급별 격려 메시지 세팅
  if (percentage === 100) {
    els.resultMessage.textContent = "🏆 완벽합니다! 모든 개념을 마스터하셨네요.";
  } else if (percentage >= 80) {
    els.resultMessage.textContent = "👍 훌륭합니다! 시험 합격이 눈앞에 보여요.";
  } else if (percentage >= 50) {
    els.resultMessage.textContent = "✏️ 아쉽게 틀린 부분들을 오답노트에서 재점검해 보세요.";
  } else {
    els.resultMessage.textContent = "📚 기본 개념을 다시 한 번 정독해 보는 것을 권장합니다.";
  }
  // 3) 상세 스탯 보드 적용
  els.statTotal.textContent = total;
  els.statCorrect.textContent = correct;
  els.statWrong.textContent = wrong;
  els.statPoints.textContent = `${percentage}점`;
  navigateTo('result');
}
// --------------------------------------------------------------------------
// 5. 오답노트 (Wrong Answer Notebook) CRUD & LocalStorage 동기화
// --------------------------------------------------------------------------
/**
 * 로컬 스토리지로부터 오답 이력을 로드하여 전역 상태와 동기화합니다.
 */
function loadWrongAnswers() {
  const rawData = localStorage.getItem('quizmate_wrong_answers');
  if (rawData) {
    try {
      state.wrongAnswersList = JSON.parse(rawData);
    } catch (e) {
      state.wrongAnswersList = [];
    }
  } else {
    state.wrongAnswersList = [];
  }
  renderWrongAnswersSection();
}
/**
 * 오답 노트를 저장합니다.
 */
function saveToWrongAnswers(questionObj, userAnswer) {
  let typeStr = '객관식';
  if (questionObj.type === 'ox') typeStr = 'OX 진위형';
  if (questionObj.type === 'blank') typeStr = '빈칸 주관식';
  const wrongItem = {
    id: Date.now() + Math.random().toString(36).substr(2, 5), // 고유 Key값 생성
    subject: state.subject,
    type: typeStr,
    question: questionObj.text,
    userAnswer: userAnswer,
    correctAnswer: questionObj.correctAnswer,
    explanation: questionObj.explanation,
    date: new Date().toLocaleDateString('ko-KR')
  };
  state.wrongAnswersList.unshift(wrongItem); // 최신 데이터가 가장 위로 가도록
  localStorage.setItem('quizmate_wrong_answers', JSON.stringify(state.wrongAnswersList));
  renderWrongAnswersSection();
}
/**
 * 개별 오답 카드를 삭제합니다.
 */
function deleteWrongItem(id) {
  state.wrongAnswersList = state.wrongAnswersList.filter(item => item.id !== id);
  localStorage.setItem('quizmate_wrong_answers', JSON.stringify(state.wrongAnswersList));
  renderWrongAnswersSection();
}
/**
 * 오답 전체를 초기화합니다.
 */
function clearAllWrongAnswers() {
  if (confirm("저장된 오답노트를 정말 전부 삭제하시겠습니까?\n삭제된 내용은 복구되지 않습니다.")) {
    state.wrongAnswersList = [];
    localStorage.removeItem('quizmate_wrong_answers');
    renderWrongAnswersSection();
  }
}
/**
 * 오답 목록 화면 렌더링 및 과목별 필터 드롭다운 동적 생성
 */
function renderWrongAnswersSection() {
  const container = els.wrongListContainer;
  const countBadge = els.wrongCountBadge;
  const filterSelect = els.filterSubject;
  const currentFilter = filterSelect.value || 'all';
  // 1) 전체 오답수 뱃지 갱신
  countBadge.textContent = state.wrongAnswersList.length;
  // 2) 과목 필터 드롭다운 동적 생성
  const subjects = [...new Set(state.wrongAnswersList.map(item => item.subject))];
  
  // 기존 필터 선택값 백업 후 옵션 리플레시
  filterSelect.innerHTML = '<option value="all">모든 과목 보기</option>';
  subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub;
    opt.textContent = sub;
    if (sub === currentFilter) {
      opt.selected = true;
    }
    filterSelect.appendChild(opt);
  });
  // 3) 필터링 조건 설정
  const filteredList = currentFilter === 'all' 
    ? state.wrongAnswersList 
    : state.wrongAnswersList.filter(item => item.subject === currentFilter);
  // 4) HTML 카드 생성
  if (filteredList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎉</span>
        <p>${currentFilter === 'all' ? '오답노트가 비어 있습니다! 모든 문제를 맞혀 보세요.' : '이 과목에 해당하는 오답이 없습니다.'}</p>
      </div>
    `;
    return;
  }
  container.innerHTML = '';
  filteredList.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'wrong-item';
    
    // 빈칸 및 문장 꾸미기
    const formattedQuestion = item.question.replace(/\[\s*\]/g, '<span class="quiz-blank">?</span>');
    itemEl.innerHTML = `
      <div class="wrong-item-header">
        <div>
          <span class="item-subject-badge">${escapeHtml(item.subject)}</span>
          <span class="step-badge" style="background-color:#f5f3ff; color:#7c3aed; margin-left:4px;">${escapeHtml(item.type)}</span>
        </div>
        <button type="button" class="btn-delete-item" title="이 오답 삭제" onclick="deleteWrongItem('${item.id}')">
          🗑️ 삭제
        </button>
      </div>
      <div class="wrong-item-body">
        <p class="wrong-question-text">${formattedQuestion}</p>
        <div class="answers-comparison">
          <div class="ans-comp-row">
            <span class="ans-comp-label">내가 쓴 답:</span>
            <span class="ans-comp-val wrong">${escapeHtml(item.userAnswer)}</span>
          </div>
          <div class="ans-comp-row">
            <span class="ans-comp-label">실제 정답:</span>
            <span class="ans-comp-val correct">${escapeHtml(item.correctAnswer)}</span>
          </div>
        </div>
        <div class="wrong-explanation">
          <span class="wrong-explanation-label">💡 설명 및 원래 문장</span>
          <p>${escapeHtml(item.explanation)}</p>
        </div>
      </div>
    `;
    container.appendChild(itemEl);
  });
}
/**
 * HTML 인젝션 공격 방지를 위한 헬퍼 함수
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
// --------------------------------------------------------------------------
// 6. 이벤트 바인딩 및 초기화 설정
// --------------------------------------------------------------------------
// 텍스트 카운터 감지기 연결
els.studyNotesInput.addEventListener('input', () => {
  const count = els.studyNotesInput.value.length;
  els.charCounter.textContent = `${count.toLocaleString()}자`;
});
// 생성 버튼 바인딩
els.generateBtn.addEventListener('click', startQuizFlow);
// 다음 문제 버튼 바인딩
els.nextBtn.addEventListener('click', handleNextQuestion);
// 다시 풀기 버튼 바인딩
els.restartBtn.addEventListener('click', () => {
  try {
    state.currentIndex = 0;
    state.score = 0;
    
    // 기존 문제 배열을 유지하고, OX 랜덤 거짓 조건 등의 변화를 주기 위해 퀴즈 재생성 프로세스 실행
    const generatedQuestions = generateQuiz(state.subject, state.notes, state.quizType, state.requestCount);
    state.questions = generatedQuestions;
    els.quizSubjectBadge.textContent = state.subject;
    renderQuestion(0);
    navigateTo('quiz');
  } catch (error) {
    alert("퀴즈 초기화 중 오류가 발생했습니다: " + error.message);
  }
});
// 새 퀴즈 만들기 버튼 바인딩
els.newQuizBtn.addEventListener('click', () => {
  navigateTo('config');
});
// 오답 필터 변동 이벤트 감지
els.filterSubject.addEventListener('change', renderWrongAnswersSection);
// 오답노트 전체 삭제 바인딩
els.clearAllWrongAnswers = clearAllWrongAnswers; // 전역 바인딩
els.clearAllWrongBtn.addEventListener('click', clearAllWrongAnswers);
// 개별 삭제용 전역 노출
window.deleteWrongItem = deleteWrongItem;
// 최초 로딩 시 초기화 실행
window.addEventListener('DOMContentLoaded', () => {
  loadWrongAnswers();
});
