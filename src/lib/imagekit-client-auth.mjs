export async function requestImageKitAuthorization(auth, fetchImpl = fetch) {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in as an administrator to upload images.');
  // Firebase refreshes an expired token; no token is persisted by this helper.
  const token = await user.getIdToken();
  const response = await fetchImpl('/api/auth/imagekit', {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Upload authorization failed (${response.status}).`);
  return response.json();
}
