const DEFAULT_API_ORIGIN = 'http://localhost:8000';
const trimTrailingSlash = (value) => value.replace(/\/+$/, '');
const rawApiUrl = 'https://proben-backend.onrender.com';
const normalizedApiUrl = trimTrailingSlash(rawApiUrl || DEFAULT_API_ORIGIN);

const API_BASE_URL = normalizedApiUrl.endsWith('/api/v1')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api/v1`;

console.log(API_BASE_URL + '/invoices');
