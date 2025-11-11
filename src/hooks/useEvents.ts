import { useState, useEffect } from "react";
import { getEvents, getEventById, type Event } from "../utils/database-service";
import { toast } from "sonner";

interface UseEventsOptions {
  category?: string;
  upcoming?: boolean;
  page?: number;
  limit?: number;
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchEvents = async (fetchOptions: UseEventsOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const page = fetchOptions.page || options.page || 1;
      const limit = fetchOptions.limit || options.limit || 12;
      const offset = (page - 1) * limit;

      const params = {
        category: fetchOptions.category || options.category,
        upcoming:
          fetchOptions.upcoming !== undefined
            ? fetchOptions.upcoming
            : options.upcoming,
        limit,
        offset,
      };

      console.log("🔍 useEvents: Fetching with params:", params);
      const { data, total, error: dbError } = await getEvents(params);

      if (dbError) {
        throw new Error(dbError.message || "Failed to fetch events");
      }

      setEvents(data);

      const totalPages = Math.ceil(total / limit);
      setPagination({
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      });

      console.log("✅ useEvents:", events);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
      console.error("❌ useEvents error:", err);

      setEvents([]);
      setPagination({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });

      toast.error("Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, []);

  // Refetch when options change
  const refetch = (newOptions?: UseEventsOptions) => {
    fetchEvents(newOptions);
  };

  return {
    events,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 useEvent: Fetching event:", eventId);
        const { data, error: dbError } = await getEventById(eventId);

        if (dbError) {
          throw new Error(dbError.message || "Failed to fetch event");
        }

        setEvent(data);
        console.log(`✅ useEvent: Loaded event ${eventId}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch event";
        setError(errorMessage);
        console.error("❌ useEvent error:", err);
        setEvent(null);
        toast.error("Unable to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return {
    event,
    loading,
    error,
  };
}
