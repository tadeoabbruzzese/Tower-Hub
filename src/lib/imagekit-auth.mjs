const NO_STORE = { 'Cache-Control': 'private, no-store' };
const reply = (status, error) => Response.json({ error }, { status, headers: NO_STORE });

// Verification is delegated to Firebase Auth, not to client role/UID headers.
// Firestore REST with an ID token also enforces the project's Security Rules.
export async function handleImageKitAuth(request, { env, sign, fetchImpl = fetch, now = () => Date.now() }) {
  const bearer = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i);
  if (!bearer) return reply(401, 'Authentication required');
  if (!env.NEXT_PUBLIC_FIREBASE_API_KEY || !env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return reply(503, 'Upload authentication unavailable');
  }

  const token = bearer[1];
  try {
    const identityResponse = await fetchImpl(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.NEXT_PUBLIC_FIREBASE_API_KEY)}`,
      {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }), cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!identityResponse.ok) {
      const error = await identityResponse.json();
      const invalidToken = ['INVALID_ID_TOKEN', 'TOKEN_EXPIRED', 'USER_DISABLED', 'USER_NOT_FOUND'].includes(error?.error?.message);
      return invalidToken ? reply(401, 'Invalid or expired session') : reply(503, 'Upload authentication unavailable');
    }
    const { users } = await identityResponse.json();
    const account = users?.[0];
    if (!account?.localId || account.disabled) return reply(401, 'Invalid or expired session');

    // Decode only AFTER Firebase has validated the signed token; check project,
    // expiry and account revocation boundary without trusting arbitrary claims.
    let claims;
    try { claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8')); }
    catch { return reply(401, 'Invalid or expired session'); }
    const seconds = Math.floor(now() / 1000);
    const project = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (claims.sub !== account.localId || claims.aud !== project ||
        claims.iss !== `https://securetoken.google.com/${project}` ||
        !Number.isFinite(claims.exp) || claims.exp <= seconds ||
        !Number.isFinite(claims.auth_time) || claims.auth_time < Number(account.validSince || 0)) {
      return reply(401, 'Invalid or expired session');
    }

    const roleResponse = await fetchImpl(
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/users/${encodeURIComponent(account.localId)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(10000) }
    );
    if ([403, 404].includes(roleResponse.status)) return reply(403, 'Administrator access required');
    if (roleResponse.status === 401) return reply(401, 'Invalid or expired session');
    if (!roleResponse.ok) return reply(503, 'Upload authentication unavailable');
    const profile = await roleResponse.json();
    if (profile.fields?.role?.stringValue !== 'admin') return reply(403, 'Administrator access required');

    return Response.json(sign(), { headers: NO_STORE });
  } catch {
    // Do not return/log tokens, Firebase account data or provider error bodies.
    return reply(503, 'Upload authentication unavailable');
  }
}
