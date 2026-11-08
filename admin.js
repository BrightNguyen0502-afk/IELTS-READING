const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const API_BASE_URL = String(window.IELTS_API_BASE_URL || '').replace(/\/+$/, '');
const state = { results: [], search: '' };
let refreshTimer = null;

async function apiRequest(endpoint, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers, credentials: 'include' });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Unable to connect to the server.');
  return payload;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function formatElapsedTime(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function renderResults() {
  const filtered = state.results.filter(result => `${result.learnerEmail || ''} ${result.title || ''}`.toLowerCase().includes(state.search));
  $('#adminAttemptsList').innerHTML = filtered.length
    ? filtered.map(result => `<tr><td>${escapeHTML(result.learnerEmail)}</td><td>${escapeHTML(result.title)}</td><td>${formatDate(result.completedAt)}</td><td>${Number(result.correct)}/${Number(result.total)}</td><td>${Number(result.accuracy)}%</td><td>${Number(result.band).toFixed(1)}</td><td>${formatElapsedTime(result.durationSeconds)}</td><td><button class="link admin-detail-open" type="button" data-result-id="${escapeHTML(result.id)}">View Details</button></td></tr>`).join('')
    : '<tr><td class="empty-cell" colspan="8">No matching test attempts.</td></tr>';
}

async function showAttemptDetails(resultId) {
  try {
    const { result } = await apiRequest(`/api/admin/results/${encodeURIComponent(resultId)}`);
    $('#adminDetailTitle').textContent = result.title;
    $('#adminDetailSummary').textContent = `${result.learnerEmail} · ${formatDate(result.completedAt)} · ${result.correct}/${result.total} correct · ${result.accuracy}% · Band ${Number(result.band).toFixed(1)}`;
    const details = Array.isArray(result.details) ? result.details : [];
    $('#adminQuestionDetails').innerHTML = details.length
      ? details.map(item => {
        const status = ({ correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Unanswered' })[item.status] || 'Unanswered';
        return `<tr><td>${Number(item.questionNumber)}</td><td>${escapeHTML(item.prompt || item.questionType)}</td><td>${escapeHTML(item.userAnswer || 'Not answered')}</td><td>${escapeHTML(item.correctAnswer)}</td><td><span class="admin-answer-status admin-answer-status--${item.status}">${status}</span></td></tr>`;
      }).join('')
      : '<tr><td class="empty-cell" colspan="5">Question-level details were not saved for this attempt.</td></tr>';
    $('#adminResultDetail').hidden = false;
    $('#adminResultDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    $('#adminQuestionDetails').innerHTML = `<tr><td class="empty-cell" colspan="5">${escapeHTML(error.message)}</td></tr>`;
    $('#adminResultDetail').hidden = false;
  }
}

async function refreshDashboard() {
  try {
    const { summary, results } = await apiRequest('/api/admin/dashboard');
    state.results = results;
    $('#adminLearnerCount').textContent = summary.learners;
    $('#adminAttemptCount').textContent = summary.attempts;
    $('#adminAverageBand').textContent = summary.averageBand === null ? '—' : Number(summary.averageBand).toFixed(1);
    renderResults();
  } catch (error) {
    if (error.message.includes('sign in') || error.message.includes('permission')) {
      showLogin(error.message);
      return;
    }
    $('#adminAttemptsList').innerHTML = `<tr><td class="empty-cell" colspan="7">${escapeHTML(error.message)}</td></tr>`;
  }
}

function showLogin(message = '') {
  if (refreshTimer) window.clearInterval(refreshTimer);
  refreshTimer = null;
  $('#adminLoginView').hidden = false;
  $('#adminDashboard').hidden = true;
  $('#adminLogoutBtn').hidden = true;
  $('#adminRefreshBtn').hidden = true;
  $('#adminLoginError').textContent = message;
  $('#adminLoginError').hidden = !message;
}

function showDashboard() {
  $('#adminLoginView').hidden = true;
  $('#adminDashboard').hidden = false;
  $('#adminLogoutBtn').hidden = false;
  $('#adminRefreshBtn').hidden = false;
  refreshDashboard();
  if (!refreshTimer) refreshTimer = window.setInterval(refreshDashboard, 30000);
}

$('#adminLoginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const email = $('#adminEmail').value.trim();
  const password = $('#adminPassword').value;
  const error = $('#adminLoginError');
  try {
    const { user } = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (user.role !== 'admin') {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      throw new Error('This account does not have administrator access.');
    }
    $('#adminLoginForm').reset();
    showDashboard();
  } catch (requestError) {
    error.textContent = requestError.message;
    error.hidden = false;
  }
});

$('#adminLogoutBtn').addEventListener('click', async () => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    window.location.replace('index.html');
  }
});
$('#adminRefreshBtn').addEventListener('click', refreshDashboard);
$('#adminAttemptsList').addEventListener('click', event => {
  const detailButton = event.target.closest('[data-result-id]');
  if (detailButton) showAttemptDetails(detailButton.dataset.resultId);
});
$('#adminDetailBackBtn').addEventListener('click', () => {
  $('#adminResultDetail').hidden = true;
  $('#adminAttemptsList').querySelector('[data-result-id]')?.focus();
});
$('#adminSearch').addEventListener('input', event => {
  state.search = event.target.value.trim().toLowerCase();
  renderResults();
});

async function initializeAdmin() {
  try {
    const { user } = await apiRequest('/api/auth/me');
    if (user?.role === 'admin') showDashboard();
    else showLogin(user ? 'This account does not have administrator access.' : '');
  } catch (error) {
    showLogin(error.message);
  }
}

initializeAdmin();
