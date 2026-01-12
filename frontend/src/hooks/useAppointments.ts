import { useState, useEffect, useCallback } from 'react';
import { getAppointments } from '../lib/api';
import type { Appointment } from '../types';

/**
 * Custom hook to manage appointments
 * Follows React best practices with proper state management and error handling
 */
export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch appointments from the backend
     */
    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAppointments();
            setAppointments(data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresh appointments (can be called manually)
     */
    const refreshAppointments = useCallback(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    /**
     * Initial fetch on mount
     */
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return {
        appointments,
        loading,
        error,
        refreshAppointments,
    };
}
