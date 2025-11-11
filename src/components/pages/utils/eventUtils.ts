import { Event } from '../data/eventsData';

export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const formatEventTime = (time: string): string => {
  return time;
};

export const getAvailableSpots = (event: Event): number => {
  return event.maxParticipants - event.currentParticipants;
};

export const getEventStatus = (event: Event): 'available' | 'almost-full' | 'full' => {
  const available = getAvailableSpots(event);
  if (available === 0) return 'full';
  if (available <= 3) return 'almost-full';
  return 'available';
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const isEventUpcoming = (dateString: string): boolean => {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
};

export const sortEvents = (events: Event[], sortBy: string): Event[] => {
  const sorted = [...events];
  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'popularity':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'availability':
      return sorted.sort((a, b) => getAvailableSpots(b) - getAvailableSpots(a));
    case 'name':
    default:
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
};

export const filterEventsByDate = (events: Event[], dateRange: string): Event[] => {
  if (dateRange === 'All') return events;
  
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const monthAfter = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

  return events.filter(event => {
    const eventDate = new Date(event.date);
    
    switch (dateRange) {
      case 'This Week':
        return eventDate >= today && eventDate <= nextWeek;
      case 'This Month':
        return eventDate >= today && eventDate <= nextMonth;
      case 'Next Month':
        return eventDate >= nextMonth && eventDate <= monthAfter;
      case 'Later':
        return eventDate > monthAfter;
      default:
        return true;
    }
  });
};