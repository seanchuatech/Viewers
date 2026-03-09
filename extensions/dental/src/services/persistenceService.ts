const BACKEND_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('dental_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const persistenceService = {
  async saveMeasurements(StudyInstanceUID, measurements) {
    try {
      const response = await fetch(`${BACKEND_URL}/measurements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ StudyInstanceUID, measurements }),
      });
      return await response.json();
    } catch (err) {
      console.error('Failed to save measurements:', err);
      return { success: false, error: err.message };
    }
  },

  async loadMeasurements(StudyInstanceUID) {
    try {
      const response = await fetch(`${BACKEND_URL}/measurements/${StudyInstanceUID}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('dental_token');
        return [];
      }
      return await response.json();
    } catch (err) {
      console.error('Failed to load measurements:', err);
      return [];
    }
  },
};
