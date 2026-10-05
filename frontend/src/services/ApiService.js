export default class ApiService {
  constructor(resource) {
    this.baseUrl = `/api/${resource}`;
  }

  async request(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (response.status === 204) return null;

    const body = await response.json();
    if (!response.ok) {
      const details = body.details ? ` (${Object.values(body.details).join(', ')})` : '';
      throw new Error(body.message + details);
    }
    return body;
  }

  list(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(query ? `${this.baseUrl}?${query}` : this.baseUrl);
  }

  get(id) {
    return this.request(`${this.baseUrl}/${id}`);
  }

  create(data) {
    return this.request(this.baseUrl, { method: 'POST', body: JSON.stringify(data) });
  }

  update(id, data) {
    return this.request(`${this.baseUrl}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  patch(id, data) {
    return this.request(`${this.baseUrl}/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  remove(id) {
    return this.request(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }
}
