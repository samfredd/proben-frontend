const DEFAULT_API_ORIGIN = 'http://localhost:8000';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const normalizedApiUrl = trimTrailingSlash(rawApiUrl || DEFAULT_API_ORIGIN);

export const API_BASE_URL = normalizedApiUrl.endsWith('/api/v1')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api/v1`;

export const getApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
