import api from './authService';

export const flightService = {
  getFlights: () => api.get('/flights'),
  getFlight: (id) => api.get(`/flights/${id}`),
  createFlight: (data) => api.post('/flights', data),
  updateFlight: (id, data) => api.put(`/flights/${id}`, data),
  endFlight: (id, data) => api.put(`/flights/${id}/end`, data),
}; 