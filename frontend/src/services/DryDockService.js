import ApiService from './ApiService';

export default class DryDockService extends ApiService {
  constructor() {
    super('dry-docks');
  }

  summary(id) {
    return this.request(`${this.baseUrl}/${id}/summary`);
  }

  start(id) {
    return this.request(`${this.baseUrl}/${id}/start`, { method: 'POST' });
  }

  copyEstimates(id) {
    return this.request(`${this.baseUrl}/${id}/copy-estimates`, { method: 'POST' });
  }
}
