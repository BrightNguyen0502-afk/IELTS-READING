import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import test from 'node:test';
import { createApplication } from './server.js';

const adminEmail = 'admin@test.example';
const adminPassword = 'test-admin-password-very-long';

async function startTestServer(t) {
  const { app, db } = createApplication({
    databasePath: ':memory:',
    adminEmail,
    adminPassword,
    adminSalt: 'test-salt'
  });
  const server = createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    db.close();
  });
  return `http://127.0.0.1:${server.address().port}`;
}

function sessionCookie(response) {
  const cookie = response.headers.getSetCookie().find(value => value.startsWith('ielts_session='));
  assert.ok(cookie, 'response should issue an HTTP-only session cookie');
  return cookie.split(';', 1)[0];
}

test('learners register, sign in, and store results visible to admins only', async t => {
  const baseUrl = await startTestServer(t);
  const registration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'learner@example.com', password: 'learner-password-8' })
  });
  assert.equal(registration.status, 201);
  const learnerCookie = sessionCookie(registration);
  const learner = await registration.json();
  assert.equal(learner.user.role, 'learner');

  const storedResult = await fetch(`${baseUrl}/api/results`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie: learnerCookie },
    body: JSON.stringify({
      id: 'attempt-1',
      title: 'Sample Reading Test',
      correct: 8,
      wrong: 1,
      unanswered: 1,
      total: 10,
      band: 6.5,
      durationSeconds: 900,
      details: [
        { questionNumber: 1, questionType: 'Multiple Choice', prompt: 'What did the library first lend?', userAnswer: 'B. Books', correctAnswer: 'B. Books', status: 'correct' },
        { questionNumber: 2, questionType: 'Completion', prompt: 'The service began in ________.', userAnswer: '', correctAnswer: '2014', status: 'unanswered' }
      ]
    })
  });
  assert.equal(storedResult.status, 201);
  const saved = await storedResult.json();
  assert.equal(saved.result.accuracy, 80);

  const learnerHistory = await fetch(`${baseUrl}/api/results`, { headers: { cookie: learnerCookie } });
  assert.equal((await learnerHistory.json()).results.length, 1);

  const adminLogin = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  assert.equal(adminLogin.status, 200);
  const adminCookie = sessionCookie(adminLogin);
  const report = await fetch(`${baseUrl}/api/admin/dashboard`, { headers: { cookie: adminCookie } });
  assert.equal(report.status, 200);
  const dashboard = await report.json();
  assert.equal(dashboard.summary.learners, 1);
  assert.equal(dashboard.summary.attempts, 1);
  assert.equal(dashboard.results[0].learnerEmail, 'learner@example.com');

  const detail = await fetch(`${baseUrl}/api/admin/results/${saved.result.id}`, { headers: { cookie: adminCookie } });
  assert.equal(detail.status, 200);
  const detailData = await detail.json();
  assert.equal(detailData.result.details.length, 2);
  assert.equal(detailData.result.details[0].userAnswer, 'B. Books');
  assert.equal(detailData.result.details[1].status, 'unanswered');

  const learnerDeniedAdmin = await fetch(`${baseUrl}/api/admin/dashboard`, { headers: { cookie: learnerCookie } });
  assert.equal(learnerDeniedAdmin.status, 403);
  const learnerDeniedDetails = await fetch(`${baseUrl}/api/admin/results/${saved.result.id}`, { headers: { cookie: learnerCookie } });
  assert.equal(learnerDeniedDetails.status, 403);
  const adminDeniedLearnerHistory = await fetch(`${baseUrl}/api/results`, { headers: { cookie: adminCookie } });
  assert.equal(adminDeniedLearnerHistory.status, 403);
});

test('registration rejects duplicate accounts and weak passwords', async t => {
  const baseUrl = await startTestServer(t);
  const request = password => fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'learner@example.com', password })
  });
  assert.equal((await request('short')).status, 400);
  assert.equal((await request('learner-password-8')).status, 201);
  assert.equal((await request('another-password-9')).status, 409);
});
