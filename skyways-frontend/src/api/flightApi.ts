import api from './apiConfig';
import { getMockFlights } from './mockFlights';
import type { ApiResponse, Airport, FlightDto, FlightSearchRequest } from '../types';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

function shouldUseMock(e: any): boolean {
  // No response at all (pure network error) OR 5xx returned by the dev-proxy
  // when the backend is not running (ECONNREFUSED forwarded as 500/503).
  return !e.response || e.response.status >= 500;
}

export const flightApi = {
  search: async (params: FlightSearchRequest): Promise<FlightDto[]> => {
    if (USE_MOCK) {
      return getMockFlights(params.origin, params.destination, params.departureDate);
    }
    try {
      const res = await api.get<ApiResponse<FlightDto[]>>('/flights/search', { params });
      const flights = res.data.data;
      if (!flights || flights.length === 0) {
        return getMockFlights(params.origin, params.destination, params.departureDate);
      }
      return flights;
    } catch (e: any) {
      if (shouldUseMock(e)) {
        return getMockFlights(params.origin, params.destination, params.departureDate);
      }
      throw e;
    }
  },

  getById: (flightId: string) =>
    api.get<ApiResponse<FlightDto>>(`/flights/${flightId}`).then((r) => r.data.data),

  searchAirports: (query: string) =>
    api.get<ApiResponse<Airport[]>>('/flights/airports', { params: { q: query } })
       .then((r) => r.data.data),

  getPopularRoutes: () =>
    api.get<ApiResponse<{ origin: Airport; destination: Airport; price: number }[]>>('/flights/popular-routes')
       .then((r) => r.data.data),
};
