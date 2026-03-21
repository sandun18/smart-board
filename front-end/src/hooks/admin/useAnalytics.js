import { useState, useEffect } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await AdminService.getAnalytics(timeRange);
        if (response) {
          setData(response);
        } else {
          setError("Received empty response from server.");
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
        // Error message for backend being offline
        setError("Could not connect to the API. Please ensure the backend is running at " + import.meta.env.VITE_API_BASE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  return { timeRange, setTimeRange, data, isLoading, error };
};