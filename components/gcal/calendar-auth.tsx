'use client';
import { Button } from '@/components/ui/button';
import useCalendar from '@/hooks/use-calendar';

export default function CalendarAuth() {
  const {
    isAuthorizing,
    calendars,
    selectedCalendars,
    handleAuth,
    handleCalendarSelect,
    handleGetEvents,
    events
  } = useCalendar();

  return (
    <div className="space-y-4">
      <Button 
        onClick={handleAuth}
        disabled={isAuthorizing}
      >
        {isAuthorizing ? 'Authorizing...' : 'Connect Google Calendar'}
      </Button>

      {calendars.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Select Calendars</h3>
          <div className="grid grid-cols-2 gap-2">
            {calendars.map((calendar) => (
              <label key={calendar.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCalendars.includes(calendar.id)}
                  onChange={() => handleCalendarSelect(calendar.id)}
                  className="h-4 w-4"
                />
                <span>{calendar.summary}</span>
              </label>
            ))}
          </div>
          <Button onClick={handleGetEvents}>Show Events</Button>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          {/* Events will be rendered here */}
        </div>
      )}
    </div>
  );
}
