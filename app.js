// IELTS Reading practice interface
const TOTAL_Q = 40;
const HIGHLIGHTS_KEY = 'ielts-reading-highlights';
const API_BASE_URL = String(window.IELTS_API_BASE_URL || '').replace(/\/+$/, '');

async function apiRequest(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, credentials: 'include' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Unable to connect to the server.');
  return payload;
}

function loadHighlights() {
  try {
    const highlights = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}');
    return highlights && typeof highlights === 'object' && !Array.isArray(highlights) ? highlights : {};
  } catch {
    return {};
  }
}

const state = {
  page: 'home',
  currentPassage: 0,
  currentQuestion: 1,
  answers: {},
  seconds: 60 * 60,
  timer: null,
  paused: false,
  submitted: false,
  review: false,
  filter: 'all',
  user: null,
  authMode: 'login',
  pendingTestPassage: null,
  testPassageIndex: null,
  activePracticeTestId: null,
  durationSeconds: 60 * 60,
  history: [],
  highlights: loadHighlights(),
  pendingHighlight: null,
  reviewReturnQuestion: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
$('#readyButton').addEventListener('click', () => {
  $('#welcomeScreen').hidden = true;
  $('#appShell').hidden = false;
});
const activePassages = () => state.activePracticeTestId
  ? [practiceTests.find(test => test.id === state.activePracticeTestId).passage]
  : passages;
const allQuestions = () => activePassages().flatMap(passage => passage.questionSets.flatMap(set => set.questions.map(question => ({ ...question, type: set.type, instruction: set.instruction, passageId: passage.id, headings: set.headings }))));
const driveTests = [
  { test: '1CABwqqugnJuEJwueYi7P0bwFqvKuoQA-', answer: '158uHHXJPoocK5Kr6fUXf1ZdBckOxej21' },
  { test: '1IvjJn4dz9ZesLxBfxrag9tWWGGcGxxVk', answer: '1UdG37aLnfBYJgMtVpFimI26X0sfZmiNG' },
  { test: '1dFw5e3e__0nTSDtRDRaRZ5lFcnulR60U', answer: '189R44oUcdT4YR5WDYXEwJ9wXIDfoHoS4' },
  { test: '1r4jUppPy5aMU9XHqNFXw3IlB6DMMi6KS', answer: '1KicBz0ZAkAFbRNOGDc6lU8EwwPm_1J5_' },
  { test: '1yJWCv7h4uIfWteQzpgLVEBxnpAmF3SeG', answer: '1V3s2p3JpIjM8deThmCsH8Ou6R6ntBdwp' },
  { test: '1T_lhjiky2R7bB5SehYaDp27GyCHSlxVu', answer: '1eiu3J3ISWegyEED6VTjf9-ZKffOO5uvA' },
  { test: '1AKXBiA2qstU5ksHb1BQVBdOzIe6J-MPx', answer: '1OnvJKaQgmOuDlqlBBgz_ACgZhfCiHPvh' },
  { test: '1hQthJd1PIYhePsziyrpTVtTbjSew94WG', answer: '1tXbD3-mott9TvC6rrB5yvYLrroiaYjuO' }
];

function showPage(name) {
  if (['test', 'history'].includes(name) && !state.user) {
    openLogin();
    return;
  }
  state.page = name;
  document.body.classList.toggle('is-testing', name === 'test');
  $$('.page').forEach(page => page.classList.toggle('page--active', page.id === `page-${name}`));
  $$('.nav__link').forEach(link => link.classList.toggle('nav__link--active', link.dataset.page === name));
  $('#mainNav').classList.remove('header__nav--open');
  $('#burgerBtn').setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function isAdminUser() {
  return state.user?.role === 'admin';
}

document.addEventListener('click', event => {
  const link = event.target.closest('[data-page]');
  if (link) {
    event.preventDefault();
    showPage(link.dataset.page);
  }
});

function openLogin() {
  setAuthMode('login');
  $('#loginOverlay').hidden = false;
  $('#loginError').hidden = true;
  $('#loginEmail').focus();
}

function closeLogin() {
  $('#loginOverlay').hidden = true;
  state.pendingTestPassage = null;
}

async function refreshLearnerResults() {
  if (!state.user || isAdminUser()) {
    state.history = [];
  } else {
    const { results } = await apiRequest('/api/results');
    state.history = results;
  }
  renderHistory();
  renderBandChart();
}

function updateAuthControls() {
  const isLoggedIn = Boolean(state.user);
  $('#loginBtn').classList.toggle('hidden', isLoggedIn);
  $('#accountMenu').classList.toggle('hidden', !isLoggedIn);
  $('#historyNavLink').hidden = !isLoggedIn;
  $('#adminNavLink').hidden = !isAdminUser();
  closeAccountMenu();
  if (isLoggedIn) {
    const initials = state.user.email.split('@')[0].slice(0, 2).toUpperCase();
    $('#avatarBtn').querySelector('span').textContent = initials;
    $('#avatarBtn').title = `Account: ${state.user.email}`;
    $('#avatarBtn').setAttribute('aria-label', `Open account menu for ${state.user.email}`);
    $('#accountMenuEmail').textContent = state.user.email;
  }
}

function closeAccountMenu() {
  $('#accountMenu').dataset.open = 'false';
  $('#avatarBtn').setAttribute('aria-expanded', 'false');
}

function openAccountInfo() {
  if (!state.user) return;
  $('#accountInfoEmail').textContent = state.user.email;
  renderAccountInfo();
  $('#accountInfoOverlay').hidden = false;
  closeAccountMenu();
  $('#closeAccountInfoBtn').focus();
}

function renderAccountInfo() {
  const totalQuestions = state.history.reduce((sum, record) => sum + Number(record.total || 0), 0);
  const correctAnswers = state.history.reduce((sum, record) => sum + Number(record.correct || 0), 0);
  const averageBand = state.history.length
    ? state.history.reduce((sum, record) => sum + Number(record.band || 0), 0) / state.history.length
    : null;
  const highestBand = state.history.reduce((highest, record) => Math.max(highest, Number(record.band || 0)), 0);
  $('#accountTestsTaken').textContent = state.history.length;
  $('#accountAverageBand').textContent = averageBand === null ? '—' : averageBand.toFixed(1);
  $('#accountHighestBand').textContent = state.history.length ? highestBand.toFixed(1) : '—';
  $('#accountAccuracy').textContent = `${totalQuestions ? Math.round(correctAnswers / totalQuestions * 100) : 0}%`;
  const recent = state.history.slice(0, 5);
  $('#accountHistoryList').innerHTML = recent.length
    ? recent.map(renderHistoryRow).join('')
    : '<p class="history-empty">You have not completed a test yet.</p>';
}

function closeAccountInfo() {
  $('#accountInfoOverlay').hidden = true;
  $('#avatarBtn').focus();
}

$('#loginBtn').addEventListener('click', openLogin);
$('#closeLoginBtn').addEventListener('click', closeLogin);
$('#loginOverlay').addEventListener('click', event => {
  if (event.target === $('#loginOverlay')) closeLogin();
});
function setAuthMode(mode) {
  state.authMode = mode;
  const registering = mode === 'register';
  $('#authDescription').textContent = registering
    ? 'Create a learner account to save your practice results.'
    : 'Sign in to save your progress and continue practicing.';
  $('#loginTitle').textContent = registering ? 'Create a Learner Account' : 'Sign In to Practice';
  $('#authSubmitBtn').textContent = registering ? 'Create Account' : 'Sign In and Continue';
  $('#authModePrompt').textContent = registering ? 'Already have an account?' : 'New here?';
  $('#authModeToggle').textContent = registering ? 'Sign In' : 'Create an Account';
  $('#registerPasswordConfirmWrap').hidden = !registering;
  $('#registerPasswordConfirm').required = registering;
  $('#loginPassword').autocomplete = registering ? 'new-password' : 'current-password';
  $('#loginError').hidden = true;
}

$('#authModeToggle').addEventListener('click', () => setAuthMode(state.authMode === 'register' ? 'login' : 'register'));
$('#loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  const error = $('#loginError');
  const registering = state.authMode === 'register';
  if (!$('#loginEmail').checkValidity() || password.length < 8) {
    error.textContent = 'Enter a valid email address and a password with at least 8 characters.';
    error.hidden = false;
    return;
  }
  if (registering && password !== $('#registerPasswordConfirm').value) {
    error.textContent = 'The passwords do not match.';
    error.hidden = false;
    return;
  }
  try {
    const { user } = await apiRequest(registering ? '/api/auth/register' : '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    state.user = user;
  } catch (requestError) {
    error.textContent = requestError.message;
    error.hidden = false;
    return;
  }
  if (isAdminUser()) {
    window.location.assign('admin.html');
    return;
  }
  try {
    await refreshLearnerResults();
  } catch (requestError) {
    error.textContent = requestError.message;
    error.hidden = false;
    return;
  }
  updateAuthControls();
  const pendingTest = state.pendingTestPassage;
  $('#loginOverlay').hidden = true;
  $('#loginForm').reset();
  setAuthMode('login');
  state.pendingTestPassage = null;
  if (pendingTest) startTest(pendingTest.passageIndex, pendingTest.practiceTestId);
});
$('#avatarBtn').addEventListener('click', () => {
  const isOpen = $('#accountMenu').dataset.open === 'true';
  $('#accountMenu').dataset.open = String(!isOpen);
  $('#avatarBtn').setAttribute('aria-expanded', String(!isOpen));
});
$('#accountMenu').addEventListener('pointerenter', () => {
  $('#accountMenu').dataset.open = 'true';
  $('#avatarBtn').setAttribute('aria-expanded', 'true');
});
$('#accountMenu').addEventListener('pointerleave', () => {
  if (!$('#accountMenu').contains(document.activeElement)) closeAccountMenu();
});
$('#accountInfoBtn').addEventListener('click', openAccountInfo);
$('#closeAccountInfoBtn').addEventListener('click', closeAccountInfo);
$('#doneAccountInfoBtn').addEventListener('click', closeAccountInfo);
$('#accountInfoOverlay').addEventListener('click', event => {
  if (event.target === $('#accountInfoOverlay')) closeAccountInfo();
});
$('#logoutBtn').addEventListener('click', async () => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch (error) {
    window.alert(error.message);
    return;
  }
  state.user = null;
  state.history = [];
  renderHistory();
  renderBandChart();
  updateAuthControls();
  if (state.page === 'history') showPage('home');
});
document.addEventListener('click', event => {
  if (!$('#accountMenu').contains(event.target)) closeAccountMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!$('#guideOverlay').hidden) closeGuide();
    else if (!$('#accountInfoOverlay').hidden) closeAccountInfo();
    else closeAccountMenu();
  }
});

$('#burgerBtn').addEventListener('click', () => {
  const expanded = $('#burgerBtn').getAttribute('aria-expanded') === 'true';
  $('#burgerBtn').setAttribute('aria-expanded', String(!expanded));
  $('#mainNav').classList.toggle('header__nav--open', !expanded);
});

function getPassageQuestionCount(passage) {
  return passage.questionSets.reduce((count, set) => count + set.questions.length, 0);
}

function questionsForTest() {
  const questions = allQuestions();
  if (state.activePracticeTestId) return questions;
  return state.testPassageIndex === null
    ? questions
    : questions.filter(question => question.passageId === passages[state.testPassageIndex].id);
}

function getQuestionEvidence(question) {
  const passage = activePassages().find(item => item.id === question.passageId) || activePassages()[state.currentPassage];
  if (!passage) return null;

  const paragraphReference = String(question.label || question.text || '').match(/\bparagraph\s+([A-F])\b/i);
  if (paragraphReference) {
    const paragraph = passage.body.find(item => item.label.toLowerCase() === paragraphReference[1].toLowerCase());
    if (paragraph) return { label: paragraph.label, text: paragraph.text };
  }

  const answerText = question.type === 'mcq'
    ? question.options?.find(option => option.letter === question.answer)?.text || ''
    : question.answer;
  const isNotGiven = ['NOT GIVEN'].includes(String(question.answer).toUpperCase());
  const ignoredWords = new Set([
    'about', 'after', 'again', 'also', 'among', 'been', 'being', 'both', 'could', 'does', 'each', 'from',
    'have', 'into', 'more', 'most', 'other', 'over', 'same', 'some', 'such', 'than', 'that', 'their',
    'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'under', 'very', 'what', 'when',
    'where', 'which', 'while', 'with', 'would', 'your', 'were', 'will', 'was', 'were', 'does', 'did',
    'true', 'false', 'given', 'paragraph', 'according', 'passage', 'statement', 'states'
  ]);
  const terms = [...new Set(`${question.text || ''} ${answerText || ''}`
    .toLowerCase()
    .match(/[a-z]{3,}/g) || [])]
    .filter(term => !ignoredWords.has(term));

  const rankedSentences = passage.body.flatMap(paragraph => {
    const sentences = paragraph.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [paragraph.text];
    return sentences.map(sentence => {
      const sentenceTerms = new Set(sentence.toLowerCase().match(/[a-z]{3,}/g) || []);
      const score = terms.reduce((total, term) => total + (sentenceTerms.has(term) ? 1 : 0), 0);
      return { label: paragraph.label, text: sentence.trim(), score };
    });
  }).sort((a, b) => b.score - a.score);

  const normalizedAnswer = String(answerText || '').trim().toLowerCase();
  const exactMatch = !isNotGiven && normalizedAnswer.length > 2
    ? rankedSentences.find(sentence => sentence.text.toLowerCase().includes(normalizedAnswer))
    : null;
  const bestMatch = exactMatch || rankedSentences[0];
  if (!bestMatch || (isNotGiven && bestMatch.score === 0)) {
    return { label: '', text: '', notGiven: isNotGiven };
  }
  return { ...bestMatch, notGiven: isNotGiven };
}

function renderEvidence(question) {
  const evidence = getQuestionEvidence(question);
  if (!evidence) return '';
  if (evidence.notGiven) {
    return `<div class="review-evidence review-evidence--not-given"><strong>Why: NOT GIVEN</strong><p>The passage does not provide direct information to confirm or contradict this statement.</p>${evidence.text ? `<small>Closest related paragraph (${escapeHTML(evidence.label)}):</small><blockquote>${escapeHTML(evidence.text)}</blockquote>` : ''}</div>`;
  }
  if (!evidence.text) {
    return '<div class="review-evidence"><strong>Evidence</strong><p>No direct supporting sentence was found in the passage.</p></div>';
  }
  return `<div class="review-evidence"><strong>Evidence · Paragraph ${escapeHTML(evidence.label)}</strong><blockquote>${escapeHTML(evidence.text)}</blockquote></div>`;
}

function getDisplayAnswer(question) {
  if (question.type === 'mcq') {
    const option = question.options?.find(item => item.letter === question.answer);
    return option ? `${question.answer}. ${option.text}` : question.answer;
  }
  if (question.type === 'heading_match' || question.type === 'matching_headings') {
    const headingIndex = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'].indexOf(String(question.answer).toLowerCase());
    const heading = question.headings?.[headingIndex];
    if (heading) return `${question.answer}. ${typeof heading === 'string' ? heading.replace(/^[ivx]+\.\s*/i, '') : heading.text}`;
  }
  return question.answer;
}

function getDisplayUserAnswer(question, answer) {
  if (!answer) return '';
  if (question.type === 'mcq') {
    const option = question.options?.find(item => item.letter === answer);
    return option ? `${answer}. ${option.text}` : answer;
  }
  if (['heading_match', 'matching_headings', 'matching_information', 'matching_features'].includes(question.type)) {
    const choices = question.headings || question.options || question.features || [];
    const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];
    const choiceIndex = question.type === 'heading_match' || question.type === 'matching_headings'
      ? roman.indexOf(String(answer).toLowerCase())
      : String(answer).charCodeAt(0) - 65;
    const choice = choices[choiceIndex];
    if (choice) {
      const label = typeof choice === 'string' ? choice : choice.text;
      return `${answer}. ${label.replace(/^(?:[ivx]+|[a-z])\.\s*/i, '')}`;
    }
  }
  return answer;
}

function renderTestCard(passageIndex = null) {
  if (passageIndex === null) {
    return `<article class="test-card" data-category="academic" data-difficulty="medium" data-attempts="1248" data-title="ielts reading full practice test 01">
      <div class="test-card__top"><span class="badge">Academic</span><span class="difficulty difficulty--medium">Medium</span></div>
      <h3>IELTS Reading Full Practice Test 01</h3><p class="test-card__subtitle">${passages.map(passage => escapeHTML(passage.title)).join(' · ')}</p>
      <div class="test-card__meta"><span>${TOTAL_Q} questions</span><span>60 minutes</span><span>${passages.length} passages</span></div>
      <button class="btn btn--primary test-start" data-test-passage="">Start Full Test</button>
    </article>`;
  }
  const passage = passages[passageIndex];
  const questionCount = getPassageQuestionCount(passage);
  const title = `Passage ${passageIndex + 1}: ${passage.title}`;
  return `<article class="test-card" data-category="academic" data-difficulty="medium" data-attempts="${900 - passageIndex * 150}" data-title="${escapeHTML(title.toLowerCase())}">
    <div class="test-card__top"><span class="badge">Academic · Passage ${passageIndex + 1}</span><span class="difficulty difficulty--medium">Medium</span></div>
    <h3>${escapeHTML(passage.title)}</h3><p class="test-card__subtitle">Practice this passage individually</p>
    <div class="test-card__meta"><span>${questionCount} questions</span><span>20 minutes</span></div>
    <button class="btn btn--primary test-start" data-test-passage="${passageIndex}">Start Passage</button>
  </article>`;
}

function renderPracticeTestCard(test) {
  const questionCount = test.passage.questionSets.reduce((count, set) => count + set.questions.length, 0);
  return `<article class="test-card" data-category="academic" data-difficulty="${test.difficulty}" data-attempts="0" data-title="${escapeHTML(test.title.toLowerCase())}">
    <div class="test-card__top"><span class="badge">Academic · Practice set</span><span class="difficulty difficulty--${test.difficulty}">${test.difficulty}</span></div>
    <h3>${escapeHTML(test.title)}</h3><p class="test-card__subtitle">Original practice passage · ${test.difficulty === 'easy' ? 'General vocabulary' : test.difficulty === 'medium' ? 'Main ideas and inference' : 'Argument and nuance'}</p>
    <div class="test-card__meta"><span>${questionCount} questions</span><span>${test.durationMinutes} minutes</span><span>Answer review</span></div>
    <button class="btn btn--primary test-start" data-practice-test="${test.id}">Start Test</button>
  </article>`;
}

function renderTestLists() {
  const cards = [renderTestCard(), ...passages.map((passage, index) => renderTestCard(index)), ...practiceTests.map(renderPracticeTestCard)].join('');
  $('#testsList').innerHTML = cards;
  $('#driveTestsList').innerHTML = driveTests.map((files, index) => {
    const testUrl = `https://drive.google.com/file/d/${files.test}/preview`;
    const answerUrl = `https://drive.google.com/file/d/${files.answer}/preview`;
    const title = `IELTS Reading Test ${String(index + 1).padStart(2, '0')}`;
    return `<article class="test-card drive-test-card" data-category="academic" data-difficulty="unrated" data-attempts="0" data-title="${title.toLowerCase()}">
      <div class="test-card__top"><span class="badge">PDF · Google Drive</span><span class="drive-test-card__format">Scanned Copy</span></div>
      <h3>${title}</h3><p class="test-card__subtitle">Practice test with a matching answer key</p>
      <div class="drive-test-card__actions"><a class="btn btn--primary" href="${testUrl}" target="_blank" rel="noopener noreferrer">Open Test PDF</a><a class="btn btn--outline" href="${answerUrl}" target="_blank" rel="noopener noreferrer">Open Answer Key</a></div>
    </article>`;
  }).join('');
}

function applyTestFilters() {
  const query = $('#testSearch').value.trim().toLowerCase();
  const sort = $('#sortSelect').value;
  const cards = $$('.test-card', $('#testsList'));
  cards.forEach(card => {
    const matchesQuery = card.dataset.title.includes(query) || card.textContent.toLowerCase().includes(query);
    const matchesFilter = state.filter === 'all' || card.dataset.category === state.filter || card.dataset.difficulty === state.filter;
    card.hidden = !matchesQuery || !matchesFilter;
  });
  cards.sort((a, b) => sort === 'popular' ? Number(b.dataset.attempts) - Number(a.dataset.attempts) : sort === 'difficulty' ? ['easy', 'medium', 'hard'].indexOf(a.dataset.difficulty) - ['easy', 'medium', 'hard'].indexOf(b.dataset.difficulty) : Number(a.dataset.title > b.dataset.title) - Number(a.dataset.title < b.dataset.title));
  cards.forEach(card => $('#testsList').append(card));
  const driveCards = $$('.drive-test-card', $('#driveTestsList'));
  driveCards.forEach(card => {
    const matchesQuery = card.dataset.title.includes(query) || card.textContent.toLowerCase().includes(query);
    const matchesFilter = state.filter === 'all' || state.filter === 'academic';
    card.hidden = !matchesQuery || !matchesFilter;
  });
  $('#testsList').querySelector('.empty-state')?.remove();
  if (![...cards, ...driveCards].some(card => !card.hidden)) {
    $('#testsList').insertAdjacentHTML('beforeend', '<p class="empty-state">No matching tests. Try another search or filter.</p>');
  }
}

document.addEventListener('click', event => {
  const startButton = event.target.closest('.test-start');
  if (startButton) {
    if (startButton.dataset.practiceTest) {
      startTest(null, startButton.dataset.practiceTest);
    } else {
      const passageIndex = startButton.dataset.testPassage;
      startTest(passageIndex === '' ? null : Number(passageIndex));
    }
  }
  const passagePractice = event.target.closest('[data-open-passage]');
  if (passagePractice) startTest(Number(passagePractice.dataset.openPassage));
  const filterButton = event.target.closest('.chip');
  if (filterButton) {
    $$('.chip').forEach(chip => chip.classList.toggle('chip--active', chip === filterButton));
    state.filter = filterButton.dataset.filter;
    applyTestFilters();
  }
  const passageTab = event.target.closest('.ptab');
  if (passageTab) {
    state.currentPassage = Number(passageTab.dataset.ptab);
    renderPassage(state.currentPassage);
  }
  const questionJump = event.target.closest('[data-jump-question]');
  if (questionJump) {
    if (state.submitted) {
      state.review = true;
      state.reviewReturnQuestion = Number(questionJump.dataset.jumpQuestion);
      $('#returnToReviewBtn').hidden = false;
      showPage('test');
      setTimeout(() => goToQuestion(state.reviewReturnQuestion), 0);
    } else goToQuestion(Number(questionJump.dataset.jumpQuestion));
  }
});

$('#testSearch').addEventListener('input', applyTestFilters);
$('#sortSelect').addEventListener('change', applyTestFilters);

const vocabulary = [
  ['resilience', 'noun', 'the ability to recover from difficulty or change', 'Technology'],
  ['infrastructure', 'noun', 'the basic systems and facilities of a society or organization', 'Technology'],
  ['pervasive', 'adjective', 'present or spreading throughout an area or group', 'Technology'],
  ['hydroponics', 'noun', 'a method of growing plants in nutrient-rich water without soil', 'Environment'],
  ['scarce', 'adjective', 'available in limited amounts; in short supply', 'Environment'],
  ['complement', 'verb', 'to add to something in a way that improves it', 'Environment'],
  ['heuristic', 'noun', 'a practical shortcut used to solve a problem or make a decision', 'Psychology'],
  ['asymmetry', 'noun', 'a lack of balance or correspondence between two parts', 'Psychology'],
  ['paternalistic', 'adjective', 'controlling others in a way that assumes authority over them', 'Psychology'],
  ['adaptation', 'noun', 'a change that helps something adjust to new conditions', 'Environment'],
  ['adverse', 'adjective', 'unfavorable or harmful', 'Environment'],
  ['alleviate', 'verb', 'to make a problem or condition less severe', 'Environment'],
  ['biodiversity', 'noun', 'the variety of living species in an area or ecosystem', 'Environment'],
  ['carbon footprint', 'noun', 'the greenhouse gases produced by a person, activity, or organization', 'Environment'],
  ['conservation', 'noun', 'the protection and careful management of natural resources', 'Environment'],
  ['contamination', 'noun', 'the presence of an unwanted or harmful substance', 'Environment'],
  ['deteriorate', 'verb', 'to become worse in quality or condition', 'Environment'],
  ['emission', 'noun', 'the release of gas, heat, or another substance', 'Environment'],
  ['ecosystem', 'noun', 'a community of organisms interacting with their environment', 'Environment'],
  ['renewable', 'adjective', 'able to be naturally replaced or replenished', 'Environment'],
  ['sustainable', 'adjective', 'able to continue without exhausting resources or causing lasting harm', 'Environment'],
  ['urbanization', 'noun', 'the growth of cities and the movement of people into them', 'Environment'],
  ['allocate', 'verb', 'to distribute resources or duties for a particular purpose', 'Society'],
  ['demographic', 'adjective', 'relating to the structure or characteristics of a population', 'Society'],
  ['disparity', 'noun', 'a clear difference or inequality between people or groups', 'Society'],
  ['diversity', 'noun', 'the presence of a range of different people or things', 'Society'],
  ['inequality', 'noun', 'an unfair difference in status, rights, or access to resources', 'Society'],
  ['migration', 'noun', 'the movement of people from one place or region to another', 'Society'],
  ['population', 'noun', 'the people or organisms living in a particular area', 'Society'],
  ['welfare', 'noun', 'health, happiness, and basic well-being; public support services', 'Society'],
  ['acquire', 'verb', 'to gain or obtain a skill, quality, or possession', 'Education'],
  ['curriculum', 'noun', 'the subjects and content taught in an educational program', 'Education'],
  ['literacy', 'noun', 'the ability to read and write; knowledge of a particular subject', 'Education'],
  ['pedagogy', 'noun', 'the theory and practice of teaching', 'Education'],
  ['assessment', 'noun', 'the process of evaluating knowledge, ability, or performance', 'Education'],
  ['cognitive', 'adjective', 'relating to mental processes such as learning and reasoning', 'Education'],
  ['correlation', 'noun', 'a relationship or connection between two variables', 'Science'],
  ['empirical', 'adjective', 'based on observation, experience, or experiment', 'Science'],
  ['evidence', 'noun', 'facts or information that support a conclusion', 'Science'],
  ['hypothesis', 'noun', 'a proposed explanation that can be tested', 'Science'],
  ['mechanism', 'noun', 'a process or system through which something works', 'Science'],
  ['phenomenon', 'noun', 'an observable event, fact, or situation', 'Science'],
  ['prevalence', 'noun', 'the proportion or frequency with which something occurs', 'Science'],
  ['variable', 'noun', 'a factor or quantity that can change', 'Science'],
  ['consumption', 'noun', 'the use of goods, services, or resources', 'Economics'],
  ['distribution', 'noun', 'the way something is shared or spread among people or places', 'Economics'],
  ['incentive', 'noun', 'something that encourages a person to act', 'Economics'],
  ['investment', 'noun', 'the use of money or resources to gain future benefits', 'Economics'],
  ['productivity', 'noun', 'the amount of output produced from a given set of resources', 'Economics'],
  ['revenue', 'noun', 'income received by a business or organization', 'Economics'],
  ['subsidy', 'noun', 'financial support provided by a government or organization', 'Economics'],
  ['bias', 'noun', 'a tendency to favor one person, group, or idea unfairly', 'Psychology'],
  ['perception', 'noun', 'the way something is noticed, understood, or interpreted', 'Psychology'],
  ['motivation', 'noun', 'the reason or desire that leads someone to act', 'Psychology'],
  ['stimulus', 'noun', 'something that causes a response or reaction', 'Psychology'],
  ['tendency', 'noun', 'a usual pattern or inclination to behave in a certain way', 'Psychology'],
  ['artificial intelligence', 'noun', 'computer systems designed to perform tasks that usually require human intelligence', 'Technology'],
  ['automation', 'noun', 'the use of technology to perform tasks with little human input', 'Technology'],
  ['innovation', 'noun', 'a new idea, method, or product', 'Technology'],
  ['implement', 'verb', 'to put a plan, decision, or system into effect', 'Technology'],
  ['regulate', 'verb', 'to control an activity by using rules or laws', 'Technology'],
  ['transform', 'verb', 'to change the form, nature, or appearance of something', 'Technology']
];

function renderVocabulary(query = '') {
  const filtered = vocabulary.filter(item => item.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  $('#vocabList').innerHTML = filtered.length
    ? filtered.map(([word, type, meaning, topic]) => `<tr><th scope="row">${escapeHTML(word)}</th><td>${escapeHTML(type)}</td><td>${escapeHTML(meaning)}</td><td><span class="vocab-topic">${escapeHTML(topic)}</span></td></tr>`).join('')
    : '<tr><td class="empty-cell" colspan="4">No matching vocabulary found.</td></tr>';
}

function renderPassageLibrary() {
  $('#passagesList').innerHTML = passages.map((passage, index) => {
    const questionCount = getPassageQuestionCount(passage);
    const excerpt = passage.body[0].text;
    return `<article class="passage-card"><div class="passage-card__meta"><span class="badge">Passage ${index + 1}</span><span>${questionCount} questions</span></div><h2>${escapeHTML(passage.title)}</h2><p>${escapeHTML(excerpt.slice(0, 180))}...</p><button class="btn btn--outline" data-open-passage="${index}">Read and Practice</button></article>`;
  }).join('');
}

$('#vocabSearch').addEventListener('input', event => renderVocabulary(event.target.value));

function startTest(passageIndex = null, practiceTestId = null) {
  if (!state.user) {
    state.pendingTestPassage = { passageIndex, practiceTestId };
    openLogin();
    return;
  }
  state.answers = {};
  state.activePracticeTestId = practiceTestId;
  state.testPassageIndex = practiceTestId ? 0 : passageIndex;
  state.currentPassage = practiceTestId ? 0 : passageIndex ?? 0;
  state.currentQuestion = allQuestions().find(question => question.passageId === state.currentPassage)?.num || 1;
  const practiceTest = practiceTestId && practiceTests.find(test => test.id === practiceTestId);
  state.durationSeconds = practiceTest ? practiceTest.durationMinutes * 60 : passageIndex === null ? 60 * 60 : 20 * 60;
  state.seconds = state.durationSeconds;
  state.paused = false;
  state.submitted = false;
  state.review = false;
  $('#submitBtn').hidden = false;
  $('#submitBtn').disabled = false;
  clearInterval(state.timer);
  $('#pauseOverlay').hidden = true;
  $('#testTopTitle').textContent = practiceTest
    ? practiceTest.title
    : passageIndex === null
      ? 'IELTS Reading Full Practice Test 01'
      : `Passage ${passageIndex + 1}: ${passages[passageIndex].title}`;
  renderPassage(state.currentPassage);
  renderQuestions();
  updateProgress();
  updateTimer();
  showPage('test');
  state.timer = setInterval(() => {
    if (state.paused || state.submitted) return;
    state.seconds = Math.max(0, state.seconds - 1);
    updateTimer();
    if (state.seconds === 0) submitTest();
  }, 1000);
}

function renderPassage(index, resetQuestion = true) {
  const passage = activePassages()[index];
  if (resetQuestion) state.currentQuestion = allQuestions().find(question => question.passageId === passage.id)?.num || 1;
  $('#passageTitle').textContent = passage.title;
  $('#passageBadge').textContent = 'Academic';
  state.pendingHighlight = null;
  $('#highlightSelectionBtn').disabled = true;
  $('#passageText').innerHTML = passage.body.map(paragraph => `<p data-paragraph="${escapeHTML(paragraph.label)}"><span class="para-label">${escapeHTML(paragraph.label)}</span>${renderHighlightedText(paragraph.text, passage.id, paragraph.label)}</p>`).join('');
  $$('.ptab').forEach(tab => {
    tab.hidden = state.testPassageIndex !== null && Number(tab.dataset.ptab) !== state.testPassageIndex;
    tab.classList.toggle('ptab--active', Number(tab.dataset.ptab) === index);
  });
  const practiceTest = state.activePracticeTestId && practiceTests.find(test => test.id === state.activePracticeTestId);
  $('#testTopTitle').textContent = practiceTest ? practiceTest.title : 'IELTS Reading Full Practice Test 01';
  renderQuestions();
  updateProgress();
}

function highlightOwnerKey() {
  return String(state.user?.email || 'guest').trim().toLowerCase();
}

function renderHighlightedText(text, passageId, paragraphLabel) {
  const ranges = state.highlights[highlightOwnerKey()]?.[passageId]?.[paragraphLabel] || [];
  let cursor = 0;
  let html = '';
  ranges
    .filter(range => Number.isInteger(range.start) && Number.isInteger(range.end) && range.start >= 0 && range.end <= text.length && range.start < range.end)
    .sort((first, second) => first.start - second.start)
    .forEach(range => {
      if (range.start < cursor) return;
      html += `${escapeHTML(text.slice(cursor, range.start))}<mark class="passage-highlight">${escapeHTML(text.slice(range.start, range.end))}</mark>`;
      cursor = range.end;
    });
  return `${html}${escapeHTML(text.slice(cursor))}`;
}

function getParagraphTextOffset(paragraph, targetNode, targetOffset) {
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
  let offset = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('.para-label')) continue;
    if (node === targetNode) return offset + targetOffset;
    offset += node.textContent.length;
  }
  return null;
}

function captureHighlightSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const findParagraph = node => (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest('#passageText p[data-paragraph]');
  const paragraph = findParagraph(range.startContainer);
  if (!paragraph || paragraph !== findParagraph(range.endContainer)) return;
  const start = getParagraphTextOffset(paragraph, range.startContainer, range.startOffset);
  const end = getParagraphTextOffset(paragraph, range.endContainer, range.endOffset);
  if (start === null || end === null || end <= start || range.toString().length !== end - start) return;
  state.pendingHighlight = {
    passageId: activePassages()[state.currentPassage].id,
    paragraphLabel: paragraph.dataset.paragraph,
    start,
    end
  };
  $('#highlightSelectionBtn').disabled = false;
}

function saveHighlightSelection() {
  const highlight = state.pendingHighlight;
  if (!highlight) return;
  const owner = highlightOwnerKey();
  state.highlights[owner] ||= {};
  state.highlights[owner][highlight.passageId] ||= {};
  const ranges = state.highlights[owner][highlight.passageId][highlight.paragraphLabel] || [];
  ranges.push({ start: highlight.start, end: highlight.end });
  ranges.sort((first, second) => first.start - second.start);
  state.highlights[owner][highlight.passageId][highlight.paragraphLabel] = ranges.reduce((merged, range) => {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push({ ...range });
    return merged;
  }, []);
  try {
    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(state.highlights));
  } catch {
    // Keep highlights visible for this page if browser storage is unavailable.
  }
  state.pendingHighlight = null;
  $('#highlightSelectionBtn').disabled = true;
  renderPassage(state.currentPassage, false);
  window.getSelection()?.removeAllRanges();
}

function clearPassageHighlights() {
  const owner = highlightOwnerKey();
  const passageId = activePassages()[state.currentPassage].id;
  if (!state.highlights[owner]?.[passageId]) return;
  delete state.highlights[owner][passageId];
  try {
    localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(state.highlights));
  } catch {
    // Keep the cleared view for this page if browser storage is unavailable.
  }
  renderPassage(state.currentPassage, false);
}

$('#passageText').addEventListener('mouseup', captureHighlightSelection);
$('#passageText').addEventListener('keyup', captureHighlightSelection);
$('#highlightSelectionBtn').addEventListener('mousedown', event => event.preventDefault());
$('#highlightSelectionBtn').addEventListener('click', saveHighlightSelection);
$('#clearHighlightsBtn').addEventListener('click', clearPassageHighlights);

function renderQuestion(question, set) {
  const passage = activePassages().find(item => item.id === question.passageId) || activePassages()[state.currentPassage];
  const answer = state.answers[question.num] || '';
  const prompt = escapeHTML(question.text || question.label || '').replace(/_{4,}/g, '<span class="question-blank" aria-label="Answer blank"></span>');
  const questionBody = `<span class="q-num">${question.num}</span><span>${prompt}</span>`;
  let control = '';
  if (set.type === 'mcq') {
    control = `<div class="mcq-options">${question.options.map(option => `<label class="mcq-option ${answer === option.letter ? 'selected' : ''}"><input type="radio" name="q-${question.num}" value="${option.letter}" ${answer === option.letter ? 'checked' : ''} ${state.submitted ? 'disabled' : ''}><span class="option-letter">${option.letter}</span><span>${escapeHTML(option.text)}</span></label>`).join('')}</div>`;
  } else if (set.type === 'tfng' || set.type === 'ynng') {
    const options = set.type === 'ynng' ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'];
    control = `<div class="choice-row">${options.map(option => `<label class="choice-option ${answer === option ? 'selected' : ''}"><input type="radio" name="q-${question.num}" value="${option}" ${answer === option ? 'checked' : ''} ${state.submitted ? 'disabled' : ''}><span>${option}</span></label>`).join('')}</div>`;
  } else if (set.type === 'heading_match' || set.type === 'matching_information' || set.type === 'matching_features' || set.type === 'matching_headings') {
    const choices = question.headings || set.headings || set.options || set.features || [];
    const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];
    control = `<label class="answer-select-label" for="answer-${question.num}">Choose an answer</label><select class="answer-select" id="answer-${question.num}" data-answer="${question.num}" ${state.submitted ? 'disabled' : ''}><option value="">Select an answer</option>${choices.map((choice, index) => { const title = typeof choice === 'string' ? choice : choice.text; const value = set.type === 'heading_match' || set.type === 'matching_headings' ? roman[index] : (typeof choice === 'object' && (choice.id || choice.code)) || String.fromCharCode(65 + index); const label = title.replace(/^(?:[ivx]+|[a-z])\.\s*/i, ''); return `<option value="${value}" ${answer === value ? 'selected' : ''}>${value}. ${escapeHTML(label)}</option>`; }).join('')}</select>`;
  } else {
    const placeholder = /summary|note|table/i.test(set.type) ? 'Enter the missing word or phrase' : 'Enter your answer';
    control = `<input class="fill-input" type="text" data-answer="${question.num}" value="${escapeHTML(answer)}" placeholder="${placeholder}" autocomplete="off" ${state.submitted ? 'disabled' : ''}>`;
  }
  let feedback = '';
  if (state.submitted && state.review) {
    const correct = String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
    const reviewQuestion = { ...question, type: set.type, passageId: passage.id, headings: question.headings || set.headings };
    feedback = `<div class="answer-key ${correct ? 'answer-key--correct' : 'answer-key--wrong'}">${correct ? 'Correct answer' : `Correct answer: ${escapeHTML(getDisplayAnswer(reviewQuestion))}`}</div>${renderEvidence(reviewQuestion)}`;
  }
  return `<article class="question-card" id="question-${question.num}"><div class="question-card__type">${escapeHTML(typeLabel(set.type))}</div><div class="question-card__prompt">${questionBody}</div>${control}${feedback}</article>`;
}

function renderQuestions() {
  const passage = activePassages()[state.currentPassage];
  const questions = passage.questionSets.flatMap(set => set.questions);
  $('#qContent').innerHTML = passage.questionSets.map(set => `<section class="question-group"><div class="question-group__instruction"><strong>${escapeHTML(typeLabel(set.type))}</strong><p>${escapeHTML(set.instruction || 'Read each question and choose the best answer.')}</p></div>${set.questions.map(question => renderQuestion(question, set)).join('')}</section>`).join('');
  const currentPassageQuestions = questions.map(question => question.num);
  $('#qNavigator').innerHTML = `<div class="q-navigator__label">Question Navigator</div><div class="q-navigator__grid">${questionsForTest().map(question => `<button class="q-nav-item ${state.answers[question.num] ? 'q-nav-item--answered' : ''} ${question.passageId === state.currentPassage ? 'q-nav-item--current-passage' : ''} ${question.num === state.currentQuestion ? 'q-nav-item--active' : ''}" data-jump-question="${question.num}" aria-label="Question ${question.num}${state.answers[question.num] ? ', answered' : ', unanswered'}">${question.num}</button>`).join('')}</div>`;
  if (!currentPassageQuestions.includes(state.currentQuestion)) state.currentQuestion = currentPassageQuestions[0];
}

function typeLabel(type) {
  return ({ heading_match: 'Matching Headings', matching_headings: 'Matching Headings', matching_information: 'Matching Information', matching_features: 'Matching Features', tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', mcq: 'Multiple Choice', fill: 'Completion', sentence_completion: 'Sentence Completion', summary_completion: 'Summary Completion', note_completion: 'Note Completion', table_completion: 'Table Completion', short_answer: 'Short Answer Questions' })[type] || type.replaceAll('_', ' ');
}

$('#qContent').addEventListener('change', event => {
  if (event.target.matches('input[type="radio"][name^="q-"]')) {
    const number = Number(event.target.name.slice(2));
    state.answers[number] = event.target.value;
    state.currentQuestion = number;
    renderQuestions();
    updateProgress();
  }
  if (event.target.matches('[data-answer]')) {
    state.currentQuestion = Number(event.target.dataset.answer);
    state.answers[state.currentQuestion] = event.target.value.trim();
    updateProgress();
  }
});
$('#qContent').addEventListener('input', event => {
  if (!event.target.matches('.fill-input')) return;
  state.currentQuestion = Number(event.target.dataset.answer);
  state.answers[state.currentQuestion] = event.target.value.trim();
  updateProgress();
});

function openGuide() {
  $('#guideOverlay').hidden = false;
  $('#doneGuideBtn').focus();
}

function closeGuide() {
  $('#guideOverlay').hidden = true;
  $('#guideBtn').focus();
}

$('#guideBtn').addEventListener('click', openGuide);
$('#closeGuideBtn').addEventListener('click', closeGuide);
$('#doneGuideBtn').addEventListener('click', closeGuide);
$('#guideOverlay').addEventListener('click', event => {
  if (event.target === $('#guideOverlay')) closeGuide();
});

function goToQuestion(number) {
  const question = questionsForTest().find(item => item.num === number);
  if (!question) return;
  state.currentQuestion = number;
  if (question.passageId !== state.currentPassage) {
    state.currentPassage = question.passageId;
    renderPassage(state.currentPassage, false);
  }
  renderQuestions();
  const questionCard = $(`#question-${number}`);
  questionCard?.scrollIntoView({ behavior: 'instant', block: 'center' });
  updateProgress();
}

function updateProgress() {
  const questions = questionsForTest();
  const answered = questions.filter(question => state.answers[question.num]).length;
  const total = questions.length;
  const questionPosition = questions.findIndex(question => question.num === state.currentQuestion) + 1;
  const percentage = Math.round(answered / total * 100);
  $('#topbarProgress').textContent = `Question ${questionPosition} / ${total}`;
  $('#topbarProgressFill').style.width = `${percentage}%`;
  $$('.q-nav-item').forEach(button => {
    button.classList.toggle('q-nav-item--answered', Boolean(state.answers[button.dataset.jumpQuestion]));
    button.classList.toggle('q-nav-item--active', Number(button.dataset.jumpQuestion) === state.currentQuestion);
  });
}

function updateTimer() {
  const minutes = String(Math.floor(state.seconds / 60)).padStart(2, '0');
  const seconds = String(state.seconds % 60).padStart(2, '0');
  $('#timerDisplay').textContent = `${minutes}:${seconds}`;
  $('#timerWidget').classList.toggle('timer-widget--warn', state.seconds <= 300);
}

function moveQuestion(direction) {
  const questions = questionsForTest();
  const currentIndex = questions.findIndex(question => question.num === state.currentQuestion);
  const nextQuestion = questions[Math.max(0, Math.min(questions.length - 1, currentIndex + direction))];
  if (nextQuestion) goToQuestion(nextQuestion.num);
}

$('#prevQBtn').addEventListener('click', () => moveQuestion(-1));
$('#nextQBtn').addEventListener('click', () => moveQuestion(1));
$('#testBackBtn').addEventListener('click', () => showPage('tests'));
$('#returnToReviewBtn').addEventListener('click', () => {
  const questionNumber = state.reviewReturnQuestion;
  if (questionNumber === null) return;
  showPage('result');
  $('#resultReview').hidden = false;
  $('#reviewBtn').textContent = 'Hide Answers';
  $('#returnToReviewBtn').hidden = true;
  state.reviewReturnQuestion = null;
  setTimeout(() => {
    const reviewLink = $(`#reviewList .review-jump[data-jump-question="${questionNumber}"]`);
    const reviewItem = reviewLink?.closest('.review-item');
    reviewItem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    reviewLink?.focus({ preventScroll: true });
  }, 0);
});
$('#pauseBtn').addEventListener('click', () => { state.paused = true; $('#pauseOverlay').hidden = false; });
$('#resumeBtn').addEventListener('click', () => { state.paused = false; $('#pauseOverlay').hidden = true; });
$('#submitBtn').addEventListener('click', () => {
  const questions = questionsForTest();
  const unanswered = questions.length - questions.filter(question => state.answers[question.num]).length;
  if (unanswered && !window.confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`)) return;
  submitTest();
});

async function submitTest() {
  if (state.submitted) return;
  clearInterval(state.timer);
  state.submitted = true;
  $('#submitBtn').hidden = true;
  $('#submitBtn').disabled = true;
  const questions = questionsForTest();
  const total = questions.length;
  const correct = questions.filter(question => String(state.answers[question.num] || '').trim().toLowerCase() === String(question.answer).trim().toLowerCase()).length;
  const answered = questions.filter(question => state.answers[question.num]).length;
  const wrong = answered - correct;
  const blank = total - answered;
  const band = getBandScore(Math.round(correct / total * TOTAL_Q));
  const selectedPracticeTest = state.activePracticeTestId && practiceTests.find(test => test.id === state.activePracticeTestId);
  const testTitle = selectedPracticeTest
    ? selectedPracticeTest.title
    : state.testPassageIndex === null
      ? 'IELTS Reading Full Practice Test 01'
      : `Passage ${state.testPassageIndex + 1}: ${passages[state.testPassageIndex].title}`;
  try {
    await saveTestResult({
      id: crypto.randomUUID(),
      title: testTitle,
      correct,
      wrong,
      unanswered: blank,
      total,
      accuracy: Math.round(correct / total * 100),
      band,
      durationSeconds: state.durationSeconds - state.seconds,
      details: questions.map(question => {
        const answer = state.answers[question.num] || '';
        return {
          questionNumber: question.num,
          questionType: typeLabel(question.type),
          prompt: question.text || question.label || '',
          userAnswer: getDisplayUserAnswer(question, answer),
          correctAnswer: getDisplayAnswer(question),
          status: !answer ? 'unanswered' : String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase() ? 'correct' : 'incorrect'
        };
      })
    });
  } catch (error) {
    window.alert(`Unable to save your result to the server: ${error.message}`);
  }
  $('#resultBand').textContent = band.toFixed(1);
  $('#resCorrect').textContent = correct;
  $('#resWrong').textContent = wrong;
  $('#resBlank').textContent = blank;
  $('#resAcc').textContent = `${Math.round(correct / total * 100)}%`;
  $('#resTime').textContent = `${String(Math.floor((state.durationSeconds - state.seconds) / 60)).padStart(2, '0')}:${String((state.durationSeconds - state.seconds) % 60).padStart(2, '0')}`;
  $('#bandRingArc').style.strokeDashoffset = String(414.7 * (1 - correct / total));
  $('#resultBars').innerHTML = activePassages().map((passage, index) => {
    const passageQuestions = questions.filter(question => question.passageId === passage.id);
    const passageCorrect = passageQuestions.filter(question => String(state.answers[question.num] || '').trim().toLowerCase() === String(question.answer).trim().toLowerCase()).length;
    const pct = passageCorrect / Math.max(passageQuestions.length, 1) * 100;
    return `<div class="result-bar"><span>Passage ${index + 1}</span><div class="result-bar__track"><i style="width:${pct}%"></i></div><strong>${passageCorrect}/${passageQuestions.length}</strong></div>`;
  }).join('');
  $('#reviewList').innerHTML = questions.map(question => {
    const userAnswer = state.answers[question.num] || 'Not answered';
    const isCorrect = String(userAnswer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
    const status = isCorrect ? 'Correct' : state.answers[question.num] ? 'Incorrect' : 'Unanswered';
    return `<article class="review-item ${isCorrect ? 'review-item--correct' : 'review-item--wrong'}"><div class="review-item__heading"><strong>Question ${question.num}</strong><span>${escapeHTML(question.text || question.label || '')}</span><b class="review-item__status">${status}</b></div><p>Your answer: ${escapeHTML(userAnswer)} <span aria-hidden="true">·</span> Correct answer: ${escapeHTML(getDisplayAnswer(question))}</p>${renderEvidence(question)}<button class="link review-jump" data-jump-question="${question.num}">View Question in Passage</button></article>`;
  }).join('');
  $('#resultReview').hidden = true;
  showPage('result');
  renderQuestions();
}

$('#reviewBtn').addEventListener('click', () => {
  $('#resultReview').hidden = !$('#resultReview').hidden;
  $('#reviewBtn').textContent = $('#resultReview').hidden ? 'Review Answers' : 'Hide Answers';
});
$('#retryBtn').addEventListener('click', () => startTest(state.testPassageIndex, state.activePracticeTestId));

function renderHistory() {
  const recent = state.history.slice(0, 5);
  const emptyState = '<p class="history-empty">You have not completed a test yet.</p>';
  $('#historyList').innerHTML = recent.length ? recent.map(renderHistoryRow).join('') : emptyState;
  $('#historyListFull').innerHTML = state.history.length ? state.history.map(renderHistoryRow).join('') : emptyState;
  renderDashboardStats();
}

function renderBandChart() {
  const recent = state.history.slice(0, 12).reverse();
  $('#bandChart').innerHTML = recent.length
    ? recent.map(record => `<div class="band-chart__column"><span>${Number(record.band).toFixed(1)}</span><i style="height:${Number(record.band) / 9 * 100}%" title="Band ${Number(record.band).toFixed(1)}"></i></div>`).join('')
    : '<div class="band-chart-empty">Complete a test to see your progress.</div>';
  $('#bandChartLabels').innerHTML = recent.map(record => `<span>${formatShortDate(record.completedAt)}</span>`).join('');
}

async function saveTestResult(result) {
  const { result: savedResult } = await apiRequest('/api/results', {
    method: 'POST',
    body: JSON.stringify(result)
  });
  state.history.unshift(savedResult);
  state.history = state.history.slice(0, 500);
  renderHistory();
  renderBandChart();
  return savedResult;
}

function formatHistoryDate(value) {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit' }).format(new Date(value));
}

function renderHistoryRow(record) {
  return `<div class="history-row"><span>${escapeHTML(record.title)}</span><span>${formatHistoryDate(record.completedAt)}</span><strong>${Number(record.band).toFixed(1)}</strong><span class="status status--complete">${record.correct}/${record.total} correct · ${record.accuracy}%</span></div>`;
}

function getPracticeStreak() {
  const activeDays = new Set(state.history.map(record => {
    const date = new Date(record.completedAt);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }));
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const keyFor = value => `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
  if (!activeDays.has(keyFor(date))) date.setDate(date.getDate() - 1);
  if (!activeDays.has(keyFor(date))) return 0;
  let streak = 0;
  while (activeDays.has(keyFor(date))) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

function renderDashboardStats() {
  const totalQuestions = state.history.reduce((sum, record) => sum + record.total, 0);
  const correctAnswers = state.history.reduce((sum, record) => sum + record.correct, 0);
  const highestBand = state.history.reduce((highest, record) => Math.max(highest, record.band), 0);
  const accountName = state.user?.email?.split('@')[0] || 'Learner';
  $('#dashAvatar').textContent = accountName.slice(0, 2).toUpperCase();
  $('#dashName').textContent = accountName;
  $('#dashSub').textContent = state.user?.email || 'Progress from your submitted tests.';
  $('#heroLatestBand').textContent = state.history.length ? Number(state.history[0].band).toFixed(1) : '—';
  $('#dashTestsTaken').textContent = state.history.length;
  $('#dashCorrectAnswers').textContent = correctAnswers;
  $('#dashAccuracy').textContent = `${totalQuestions ? Math.round(correctAnswers / totalQuestions * 100) : 0}%`;
  $('#dashLatestBand').textContent = state.history.length ? Number(state.history[0].band).toFixed(1) : '—';
  $('#dashHighestBand').textContent = state.history.length ? highestBand.toFixed(1) : '—';
  $('#dashStreak').textContent = `${getPracticeStreak()} days`;
}

renderTestLists();
renderHistory();
renderBandChart();
renderVocabulary();
renderPassageLibrary();
updateAuthControls();
async function restoreSession() {
  try {
    const { user } = await apiRequest('/api/auth/me');
    state.user = user;
    if (isAdminUser()) {
      window.location.replace('admin.html');
      return;
    }
    if (user) await refreshLearnerResults();
  } catch {
    state.user = null;
  }
  updateAuthControls();
}
restoreSession();