const API = '/api';

function getHeaders(auth = false) {
  const h = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Błąd serwera' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (username, password) =>
    request(`${API}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ username, password }) }),
  changePassword: (oldPassword, newPassword) =>
    request(`${API}/auth/change-password`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify({ oldPassword, newPassword }) }),
  getProfile: () =>
    request(`${API}/auth/profile`, { headers: getHeaders(true) }),
  updateProfile: (data) =>
    request(`${API}/auth/profile`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  forgotPassword: (username) =>
    request(`${API}/auth/forgot-password`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ username }) }),
  resetPassword: (token, newPassword) =>
    request(`${API}/auth/reset-password`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ token, newPassword }) }),
  submitContact: (data) =>
    request(`${API}/contact`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) }),

  // Content
  getAllContent: () => request(`${API}/content`),
  getContent: (section) => request(`${API}/content/${section}`),
  updateContent: (section, data) =>
    request(`${API}/content/${section}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),

  // Services
  getServices: () => request(`${API}/services`),
  getService: (id) => request(`${API}/services/${id}`),
  createService: (data) =>
    request(`${API}/services`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),
  updateService: (id, data) =>
    request(`${API}/services/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  deleteService: (id) =>
    request(`${API}/services/${id}`, { method: 'DELETE', headers: getHeaders(true) }),

  // Pricing
  getPricingFull: () => request(`${API}/pricing/full`),
  getPricingGroups: () => request(`${API}/pricing/groups`),
  createPricingGroup: (data) =>
    request(`${API}/pricing/groups`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),
  updatePricingGroup: (id, data) =>
    request(`${API}/pricing/groups/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  deletePricingGroup: (id) =>
    request(`${API}/pricing/groups/${id}`, { method: 'DELETE', headers: getHeaders(true) }),
  getPricingItems: (groupId) => request(`${API}/pricing/items?group_id=${groupId}`),
  createPricingItem: (data) =>
    request(`${API}/pricing/items`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),
  updatePricingItem: (id, data) =>
    request(`${API}/pricing/items/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  deletePricingItem: (id) =>
    request(`${API}/pricing/items/${id}`, { method: 'DELETE', headers: getHeaders(true) }),

  // Gallery
  getGallery: () => request(`${API}/gallery`),
  createGalleryItem: (data) =>
    request(`${API}/gallery`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),
  updateGalleryItem: (id, data) =>
    request(`${API}/gallery/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  deleteGalleryItem: (id) =>
    request(`${API}/gallery/${id}`, { method: 'DELETE', headers: getHeaders(true) }),

  // Testimonials
  getTestimonials: () => request(`${API}/testimonials`),
  createTestimonial: (data) =>
    request(`${API}/testimonials`, { method: 'POST', headers: getHeaders(true), body: JSON.stringify(data) }),
  updateTestimonial: (id, data) =>
    request(`${API}/testimonials/${id}`, { method: 'PUT', headers: getHeaders(true), body: JSON.stringify(data) }),
  deleteTestimonial: (id) =>
    request(`${API}/testimonials/${id}`, { method: 'DELETE', headers: getHeaders(true) }),

  // Upload
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd
    });
    if (!res.ok) throw new Error('Błąd przesyłania');
    return res.json();
  }
};
