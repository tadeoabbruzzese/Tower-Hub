import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleImageKitAuth } from '../src/lib/imagekit-auth.mjs';
import { requestImageKitAuthorization } from '../src/lib/imagekit-client-auth.mjs';

const env = { NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'demo-towerhub', NEXT_PUBLIC_FIREBASE_API_KEY: 'test-public-key' };
const claims = { sub: 'admin-uid', aud: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  iss: 'https://securetoken.google.com/demo-towerhub', exp: 2000, auth_time: 900 };
// A fixture, not a real credential. Firebase validation is mocked at the HTTP boundary.
const tokenFor = (data = claims) => `fixture.${Buffer.from(JSON.stringify(data)).toString('base64url')}.fixture`;
const requestFor = (token = tokenFor()) => new Request('http://localhost/api/auth/imagekit', {
  headers: token ? { Authorization: `Bearer ${token}`, 'X-Role': 'admin', 'X-Uid': 'spoofed' } : {},
});
function setup({ identityStatus = 200, identity = { users: [{ localId: 'admin-uid', validSince: '800' }] },
  roleStatus = 200, role = 'admin', networkError = false, signError = false, token = tokenFor() } = {}) {
  let signed = 0;
  const calls = [];
  return {
    request: requestFor(token), calls, signed: () => signed,
    dependencies: { env, now: () => 1000000,
      sign: () => { signed++; if (signError) throw new Error('private-provider-detail'); return { token: 'fixture-upload', expire: 2000, signature: 'fixture-signature' }; },
      fetchImpl: async (url, options) => {
        calls.push({ url, options });
        if (networkError) throw new Error('private-provider-detail');
        return calls.length === 1
          ? Response.json(identity, { status: identityStatus })
          : Response.json({ fields: { role: { stringValue: role } } }, { status: roleStatus });
      },
    },
  };
}
async function checkRejected(options, expectedStatus) {
  const fixture = setup(options);
  const response = await handleImageKitAuth(fixture.request, fixture.dependencies);
  assert.equal(response.status, expectedStatus);
  assert.equal(fixture.signed(), 0);
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  const body = await response.text();
  assert.equal(body.includes('fixture-signature'), false);
  assert.equal(body.includes('private-provider-detail'), false);
  return fixture;
}

test('anonymous requests cannot obtain signatures or call Firebase', async () => {
  const fixture = await checkRejected({ token: null }, 401);
  assert.equal(fixture.calls.length, 0);
});
test('Firebase rejects invalid/forged sessions before any role lookup or signing', async () => {
  const fixture = await checkRejected({ identityStatus: 400, identity: { error: { message: 'INVALID_ID_TOKEN' } } }, 401);
  assert.equal(fixture.calls.length, 1);
});
test('expired, wrong-project, wrong-UID, revoked and disabled sessions fail closed', async () => {
  for (const modified of [
    { ...claims, exp: 999 }, { ...claims, aud: 'other-project' },
    { ...claims, iss: 'https://attacker.example' }, { ...claims, sub: 'another-uid' },
    { ...claims, auth_time: 799 }, { ...claims, exp: '2000' },
  ]) await checkRejected({ token: tokenFor(modified) }, 401);
  await checkRejected({ identity: { users: [{ localId: 'admin-uid', disabled: true }] } }, 401);
  await checkRejected({ identity: { users: [] } }, 401);
  await checkRejected({ token: 'malformed' }, 401);
});
test('non-admin, missing user document and denied Firestore reads never sign', async () => {
  for (const role of ['executor', 'Admin', null]) await checkRejected({ role }, 403);
  await checkRejected({ roleStatus: 404 }, 403);
  await checkRejected({ roleStatus: 403 }, 403);
  await checkRejected({ roleStatus: 401 }, 401);
});
test('provider failures remain closed and do not disclose details', async () => {
  await checkRejected({ networkError: true }, 503);
  await checkRejected({ identityStatus: 500, identity: {} }, 503);
  await checkRejected({ roleStatus: 500 }, 503);
  const fixture = setup({ signError: true });
  const response = await handleImageKitAuth(fixture.request, fixture.dependencies);
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes('private-provider-detail'), false);
});
test('verified admin signs once using the authenticated UID and uncached role read', async () => {
  const fixture = setup();
  const response = await handleImageKitAuth(fixture.request, fixture.dependencies);
  assert.equal(response.status, 200);
  assert.equal(fixture.signed(), 1);
  assert.deepEqual(await response.json(), { token: 'fixture-upload', expire: 2000, signature: 'fixture-signature' });
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  assert.ok(fixture.calls[1].url.endsWith('/users/admin-uid'));
  assert.equal(fixture.calls[1].options.headers.Authorization, `Bearer ${tokenFor()}`);
  for (const { options } of fixture.calls) assert.equal(options.cache, 'no-store');
});
test('client requests pass the current Firebase token and preserve ImageKit response shape', async () => {
  const data = { token: 'fixture-upload', expire: 2000, signature: 'fixture-signature' };
  const result = await requestImageKitAuthorization({ currentUser: { getIdToken: async () => 'fixture-token' } }, async (url, options) => {
    assert.equal(url, '/api/auth/imagekit');
    assert.equal(options.headers.Authorization, 'Bearer fixture-token');
    assert.equal(options.cache, 'no-store');
    return Response.json(data);
  });
  assert.deepEqual(result, data);
  await assert.rejects(requestImageKitAuthorization({ currentUser: null }), /Sign in/);
  await assert.rejects(requestImageKitAuthorization({ currentUser: { getIdToken: async () => 'fixture-token' } }, async () => Response.json({}, { status: 403 })), /403/);
});
