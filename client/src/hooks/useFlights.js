import { useQuery } from 'react-query';
import { flightService } from '../services/flightService';

export const useFlights = () => {
  return useQuery('flights', flightService.getFlights, {
    select: (data) => data.data.flights,
  });
}; 