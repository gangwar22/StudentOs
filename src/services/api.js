export function getAuthToken() {
  return localStorage.getItem('student_os_token') || sessionStorage.getItem('student_os_token');
}

export function saveAuthToken(token, rememberMe = true) {
  localStorage.removeItem('student_os_token');
  sessionStorage.removeItem('student_os_token');
  (rememberMe ? localStorage : sessionStorage).setItem('student_os_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('student_os_token');
  sessionStorage.removeItem('student_os_token');
}

export async function apiRequest(path, options = {}) {
  const { auth = true, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers || {});
  const token = auth ? getAuthToken() : null;
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, { ...requestOptions, headers });
  const hasJsonBody = response.headers.get('content-type')?.includes('application/json');
  const result = response.status === 204
    ? {}
    : hasJsonBody
      ? await response.json()
      : { error: `The server returned an unexpected response (${response.status}).` };
  if (!response.ok) throw new Error(result.error || `Request failed with status ${response.status}.`);
  return result;
}
