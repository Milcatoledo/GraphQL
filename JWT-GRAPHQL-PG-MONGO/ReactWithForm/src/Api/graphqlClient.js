import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/* añade authorization si hay token*/
export async function graphqlRequest(query, variables = {}) {
  const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_BASE_URL}/graphql`;

  try {
    const res = await axios.post(url, { query, variables }, { headers });

    if (res.data && res.data.errors && res.data.errors.length) {
      console.error('GraphQL errors:', res.data.errors);
      const first = res.data.errors[0] || {};
      const error = new Error(first.message || 'GraphQL error');
      error.graphQLErrors = res.data.errors;
      error.status = res.status;
      // normalizar mensaje
      error.response = { data: { message: first.message || 'GraphQL error', errors: res.data.errors } };
      throw error;
    }

    return res.data && res.data.data ? res.data.data : null;
  } catch (err) {
    // errores de red/servidor
    if (err && err.request && !err.response) {
      console.error('Network/CORS error: request made but no response received. Request details:', {
        url,
        headers,
        message: err.message,
      });
    } else {
      console.error('graphqlRequest error:', err?.response || err);
    }

    if (err.response && err.response.data) {
      const out = new Error(err.response.data.message || 'Network Error');
      out.status = err.response.status;
      out.response = err.response.data;
      throw out;
    }
    throw err;
  }
}

export default graphqlRequest;
