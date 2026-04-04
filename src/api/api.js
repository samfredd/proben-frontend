import { API_BASE_URL } from '@/config/env';

const BASE_URL = API_BASE_URL;

const getHeaders = (customHeaders = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  // If Content-Type is null, remove it (useful for FormData)
  if (customHeaders['Content-Type'] === null) {
    delete headers['Content-Type'];
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  return { data };
};

const api = {
  get: async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: getHeaders(options.headers),
    });
    return handleResponse(response);
  },
  post: async (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = getHeaders({
      ...(isFormData ? { 'Content-Type': null } : {}),
      ...options.headers,
    });

    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (url, body, options = {}) => {
    const isFormData = body instanceof FormData;
    const headers = getHeaders({
      ...(isFormData ? { 'Content-Type': null } : {}),
      ...options.headers,
    });

    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
  delete: async (url, options = {}) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders(options.headers),
    });
    return handleResponse(response);
  },
};


export default api;
