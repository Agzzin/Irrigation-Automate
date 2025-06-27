import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { token } = useAuth();

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(url, { ...options, headers });
  };

  return { authFetch };
};
