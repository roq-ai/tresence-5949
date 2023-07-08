import axios from 'axios';
import queryString from 'query-string';
import { TravelAgentInterface, TravelAgentGetQueryInterface } from 'interfaces/travel-agent';
import { GetQueryInterface } from '../../interfaces';

export const getTravelAgents = async (query?: TravelAgentGetQueryInterface) => {
  const response = await axios.get(`/api/travel-agents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTravelAgent = async (travelAgent: TravelAgentInterface) => {
  const response = await axios.post('/api/travel-agents', travelAgent);
  return response.data;
};

export const updateTravelAgentById = async (id: string, travelAgent: TravelAgentInterface) => {
  const response = await axios.put(`/api/travel-agents/${id}`, travelAgent);
  return response.data;
};

export const getTravelAgentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/travel-agents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTravelAgentById = async (id: string) => {
  const response = await axios.delete(`/api/travel-agents/${id}`);
  return response.data;
};
