const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const PostsAPI = {
  list: () => apiRequest('/posts/'),
  create: (post, token) => apiRequest('/posts/', { method: 'POST', body: post, token }),
  get: (id) => apiRequest(`/posts/${id}`),
  remove: (id, token) => apiRequest(`/posts/${id}`, { method: 'DELETE', token }),
};


